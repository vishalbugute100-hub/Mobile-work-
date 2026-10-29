import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getOrder, saveOrder } from "@/lib/store";
import { esc, notifyOwner } from "@/lib/notify";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const order = typeof b.orderId === "string" ? await getOrder(b.orderId) : undefined;
  if (!secret || !order || order.payment.razorpayOrderId !== b.razorpay_order_id) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const expected = createHmac("sha256", secret).update(`${b.razorpay_order_id}|${b.razorpay_payment_id}`).digest("hex");
  const given = String(b.razorpay_signature || "");
  const ok = given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!ok) return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });

  order.payment = { ...order.payment, status: "paid", paymentId: b.razorpay_payment_id };
  order.status = "confirmed";
  await saveOrder(order);
  await notifyOwner(`Paid order ${order.id} (₹${order.totals.total})`, `<p>Order ${esc(order.id)} paid by ${esc(order.customer.name)}, ${esc(order.customer.phone)}.</p>`);
  return NextResponse.json({ ok: true });
}
