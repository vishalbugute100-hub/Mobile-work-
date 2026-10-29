import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getProducts, getSettings, readCoupons } from "@/lib/content";
import { computeTotals } from "@/lib/pricing";
import { saveOrder, type Order } from "@/lib/store";
import { esc, notifyOwner } from "@/lib/notify";

const s = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  if ((await getSettings()).orderMode !== "shop") return NextResponse.json({ error: "Online ordering is not enabled. Please send an enquiry." }, { status: 403 });
  const c = b.customer ?? {};
  const customer = { name: s(c.name, 80), email: s(c.email, 120), phone: s(c.phone, 15), address: s(c.address, 300), city: s(c.city, 60), state: s(c.state, 60), pincode: s(c.pincode, 6) };
  if (!customer.name || !/^\S+@\S+\.\S+$/.test(customer.email) || !/^[6-9]\d{9}$/.test(customer.phone) || !customer.address || !customer.city || !customer.state || !/^[1-9]\d{5}$/.test(customer.pincode))
    return NextResponse.json({ error: "Please check your delivery details." }, { status: 400 });

  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  // Prices always come from the server catalogue, never from the browser.
  const lines: Order["lines"] = [];
  for (const it of Array.isArray(b.items) ? b.items.slice(0, 50) : []) {
    const p = products.find((x) => x.slug === s(it?.slug));
    const qty = Math.max(1, Math.min(999, Math.floor(Number(it?.qty))));
    if (!p || !Number.isFinite(qty)) continue;
    if (p.stock <= 0) return NextResponse.json({ error: `${p.name} is out of stock.` }, { status: 400 });
    if (p.personaliseLabel && !s(it.text)) return NextResponse.json({ error: `Please complete “${p.personaliseLabel}” for ${p.name}.` }, { status: 400 });
    const pk = p.packaging.find((x) => x.name === s(it.packaging));
    lines.push({ slug: p.slug, name: p.name, qty, price: p.price + (pk?.extra ?? 0), text: p.personaliseLabel ? s(it.text, p.personaliseMax || 100) : undefined, packaging: pk?.name });
  }
  if (!lines.length) return NextResponse.json({ error: "Your cart is empty or items are no longer available." }, { status: 400 });

  const subtotal = lines.reduce((t, l) => t + l.price * l.qty, 0);
  const cp = (await readCoupons()).find((x) => x.active && x.code === s(b.coupon).toUpperCase());
  const giftWrap = !!b.giftWrap;
  const totals = computeTotals(subtotal, cp ?? null, giftWrap, settings);
  const coupon = cp && totals.discount > 0 ? cp.code : undefined;

  const method = b.method === "cod" ? "cod" : "online";
  const keyId = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
  const live = method === "online" && !!keyId && !!secret;

  const order: Order = {
    id: "HML" + randomBytes(4).toString("hex").toUpperCase(),
    createdAt: new Date().toISOString(), status: "pending",
    payment: method === "cod" ? { method: "cod", status: "cod" } : live ? { method: "online", status: "unpaid" } : { method: "demo", status: "paid" },
    customer, lines, giftWrap, giftMessage: giftWrap ? s(b.giftMessage, 200) : undefined,
    deliveryDate: /^\d{4}-\d{2}-\d{2}$/.test(s(b.deliveryDate)) ? s(b.deliveryDate) : undefined,
    coupon, totals,
  };
  const alert = () => notifyOwner(`New order ${order.id} (₹${totals.total})`,
    `<h3>Order ${order.id}</h3><p>${esc(customer.name)} · ${esc(customer.phone)}<br>${esc(customer.address)}, ${esc(customer.city)} ${esc(customer.pincode)}</p><ul>${lines.map((l) => `<li>${l.qty} × ${esc(l.name)} ${l.packaging ? `(${esc(l.packaging)})` : ""} ${l.text ? `— ${esc(l.text)}` : ""}</li>`).join("")}</ul><p>Total ₹${totals.total} · ${order.payment.method}</p>`);

  if (live) {
    const r = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Basic " + Buffer.from(`${keyId}:${secret}`).toString("base64") },
      body: JSON.stringify({ amount: totals.total * 100, currency: "INR", receipt: order.id }),
    });
    if (!r.ok) return NextResponse.json({ error: "Payment gateway error. Please try again or choose Cash on Delivery." }, { status: 502 });
    const rz = await r.json();
    order.payment.razorpayOrderId = rz.id;
    await saveOrder(order);
    return NextResponse.json({ orderId: order.id, total: totals.total, razorpay: { key: keyId, orderId: rz.id, amount: rz.amount } });
  }
  order.status = "confirmed";
  await saveOrder(order);
  await alert();
  return NextResponse.json({ orderId: order.id, total: totals.total });
}
