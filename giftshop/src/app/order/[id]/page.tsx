import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/store";
import { inr } from "@/lib/format";

export const metadata: Metadata = { title: "Order status", robots: { index: false } };
export const dynamic = "force-dynamic";

const STEPS = ["confirmed", "packed", "shipped", "delivered"] as const;

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const o = await getOrder((await params).id);
  if (!o) notFound();
  const idx = STEPS.indexOf(o.status as (typeof STEPS)[number]);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center">
        <p className="text-6xl">{o.status === "cancelled" ? "❌" : "🎉"}</p>
        <h1 className="font-display mt-2 text-4xl font-bold">{o.status === "pending" ? "Awaiting payment" : "Thank you, " + o.customer.name.split(" ")[0] + "!"}</h1>
        <p className="mt-1 text-muted">Order <b>{o.id}</b> · {new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
      </div>
      {o.status !== "pending" && o.status !== "cancelled" && (
        <ol className="mt-8 grid grid-cols-4 gap-2 text-center text-xs sm:text-sm">
          {STEPS.map((s, i) => (
            <li key={s}>
              <div className={`mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-full font-bold ${i <= idx ? "bg-leaf text-white" : "bg-black/10"}`}>{i <= idx ? "✓" : i + 1}</div>
              <span className="capitalize">{s}</span>
            </li>
          ))}
        </ol>
      )}
      {o.tracking && <p className="card mt-6 p-4 text-sm">🚚 Shipped via <b>{o.tracking.carrier}</b> · Tracking / AWB: <b>{o.tracking.awb}</b></p>}
      <div className="card mt-6 space-y-3 p-6">
        {o.lines.map((l, i) => (<div key={i} className="flex justify-between text-sm"><span>{l.name} × {l.qty}{l.text && <em className="block text-muted">“{l.text}”</em>}</span><span>{inr(l.price * l.qty)}</span></div>))}
        <div className="flex justify-between border-t border-black/10 pt-3 text-lg font-bold"><span>Total {o.payment.status === "cod" ? "(pay on delivery)" : o.payment.status === "paid" ? "(paid)" : ""}</span><span>{inr(o.totals.total)}</span></div>
        {o.payment.method === "demo" && <p className="rounded-lg bg-gold/30 p-2 text-xs">Demo mode: no real payment was taken. Add Razorpay keys to go live.</p>}
      </div>
      <div className="card mt-4 p-6 text-sm">
        <p className="font-semibold">Delivering to</p>
        <p className="text-muted">{o.customer.name}, {o.customer.address}, {o.customer.city}, {o.customer.state} {o.customer.pincode}</p>
        {o.deliveryDate && <p className="mt-1 text-muted">Preferred date: {o.deliveryDate}</p>}
        {o.giftMessage && <p className="mt-1 text-muted">Card message: “{o.giftMessage}”</p>}
      </div>
      <div className="mt-8 text-center"><Link href="/shop" className="btn btn-primary">Continue shopping</Link></div>
    </div>
  );
}
