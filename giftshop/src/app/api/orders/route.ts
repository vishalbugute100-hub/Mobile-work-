import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getProduct } from "@/lib/products";
import { computeTotals, findCoupon } from "@/lib/pricing";
import { saveOrder, type Order } from "@/lib/store";

const s = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let b: any;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  const c = b.customer ?? {};
  const customer = { name: s(c.name, 80), email: s(c.email, 120), phone: s(c.phone, 15), address: s(c.address, 300), city: s(c.city, 60), state: s(c.state, 60), pincode: s(c.pincode, 6) };
  if (!customer.name || !/^\S+@\S+\.\S+$/.test(customer.email) || !/^[6-9]\d{9}$/.test(customer.phone) || !customer.address || !customer.city || !customer.state || !/^[1-9]\d{5}$/.test(customer.pincode))
    return NextResponse.json({ error: "Please check your delivery details." }, { status: 400 });

  // Prices always come from the server catalog, never from the client.
  const lines: Order["lines"] = [];
  for (const it of Array.isArray(b.items) ? b.items.slice(0, 30) : []) {
    const p = getProduct(s(it.slug));
    const qty = Math.max(1, Math.min(10, Math.floor(Number(it.qty))));
    if (!p || !Number.isFinite(qty)) continue;
    if (p.personalise && !s(it.text)) return NextResponse.json({ error: `Personalisation text missing for ${p.name}` }, { status: 400 });
    lines.push({ slug: p.slug, name: p.name, qty, price: p.price, text: p.personalise ? s(it.text, p.personalise.maxLen) : undefined });
  }
  if (!lines.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });

  const subtotal = lines.reduce((t, l) => t + l.price * l.qty, 0);
  const coupon = findCoupon(b.coupon)?.code;
  const giftWrap = !!b.giftWrap;
  const totals = computeTotals(subtotal, coupon, giftWrap);

  const method = b.method === "cod" ? "cod" : "online";
  const keyId = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
  const live = method === "online" && !!keyId && !!secret;

  const order: Order = {
    id: "GS" + randomBytes(5).toString("hex").toUpperCase(),
    createdAt: new Date().toISOString(),
    status: "pending",
    payment: method === "cod" ? { method: "cod", status: "cod" } : live ? { method: "online", status: "unpaid" } : { method: "demo", status: "paid" },
    customer, lines, giftWrap,
    giftMessage: giftWrap ? s(b.giftMessage, 200) : undefined,
    deliveryDate: /^\d{4}-\d{2}-\d{2}$/.test(s(b.deliveryDate)) ? s(b.deliveryDate) : undefined,
    coupon, totals,
  };

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

  order.status = "confirmed"; // COD, or demo payment when no gateway keys are configured
  await saveOrder(order);
  return NextResponse.json({ orderId: order.id, total: totals.total });
}
