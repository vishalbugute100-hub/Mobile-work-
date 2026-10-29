"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { getProduct } from "@/lib/products";
import { inr } from "@/lib/format";
import { track } from "@/lib/track";

type RzpResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
declare global { interface Window { Razorpay?: new (o: Record<string, unknown>) => { open(): void } } }

const loadRzp = () =>
  new Promise<boolean>((res) => {
    if (window.Razorpay) return res(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => res(true);
    s.onerror = () => res(false);
    document.body.appendChild(s);
  });

export default function Checkout() {
  const c = useCart();
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", deliveryDate: "" });
  const [method, setMethod] = useState<"online" | "cod">("online");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  useEffect(() => { if (c.ready && c.items.length) track("begin_checkout", { value: c.totals.total }); }, [c.ready]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!c.ready) return <div className="py-20 text-center text-muted">Loading…</div>;
  if (!c.items.length) return (<div className="py-24 text-center"><p>Your cart is empty.</p><Link href="/shop" className="btn btn-primary mt-4">Browse gifts</Link></div>);

  const done = (id: string, total: number) => {
    track("purchase", { value: total, orderId: id });
    c.clear();
    router.push(`/order/${id}`);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: f, items: c.items, coupon: c.coupon, giftWrap: c.giftWrap, giftMessage: c.giftMessage, method, deliveryDate: f.deliveryDate }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Could not place order");

      if (j.razorpay) {
        if (!(await loadRzp())) throw new Error("Could not load the payment window. Check your connection.");
        const rz = new window.Razorpay!({
          key: j.razorpay.key, order_id: j.razorpay.orderId, amount: j.razorpay.amount, currency: "INR",
          name: process.env.NEXT_PUBLIC_STORE_NAME || "Giftora", description: `Order ${j.orderId}`,
          prefill: { name: f.name, email: f.email, contact: f.phone },
          theme: { color: "#b4234f" },
          modal: { ondismiss: () => setBusy(false) },
          handler: async (resp: RzpResponse) => {
            const v = await fetch("/api/orders/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: j.orderId, ...resp }) });
            if (v.ok) done(j.orderId, j.total);
            else { setErr("Payment could not be verified. If money was debited, contact us with your order number: " + j.orderId); setBusy(false); }
          },
        });
        rz.open();
        return;
      }
      done(j.orderId, j.total);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  };

  const t = c.totals;
  return (
    <form onSubmit={submit} className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <h1 className="font-display text-4xl font-bold">Checkout</h1>
        <section className="card space-y-3 p-6">
          <h2 className="font-bold">Delivery details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required className="input" placeholder="Full name" value={f.name} onChange={set("name")} autoComplete="name" />
            <input required className="input" type="tel" placeholder="Mobile (10 digits)" pattern="[6-9][0-9]{9}" value={f.phone} onChange={set("phone")} autoComplete="tel" />
          </div>
          <input required className="input" type="email" placeholder="Email" value={f.email} onChange={set("email")} autoComplete="email" />
          <textarea required className="input" rows={2} placeholder="Address (house, street, area)" value={f.address} onChange={set("address")} autoComplete="street-address" />
          <div className="grid gap-3 sm:grid-cols-3">
            <input required className="input" placeholder="City" value={f.city} onChange={set("city")} />
            <input required className="input" placeholder="State" value={f.state} onChange={set("state")} />
            <input required className="input" placeholder="Pincode" pattern="[1-9][0-9]{5}" inputMode="numeric" maxLength={6} value={f.pincode} onChange={set("pincode")} />
          </div>
          <label className="block text-sm"><span className="font-semibold">📅 Preferred delivery date (optional)</span>
            <input type="date" className="input mt-1" min={new Date().toISOString().slice(0, 10)} value={f.deliveryDate} onChange={set("deliveryDate")} />
          </label>
        </section>
        <section className="card space-y-3 p-6">
          <h2 className="font-bold">Payment</h2>
          {([["online", "UPI / Cards / Netbanking", "Pay securely online"], ["cod", "Cash on Delivery", "Pay when your gift arrives"]] as const).map(([v, t1, d]) => (
            <label key={v} className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 ${method === v ? "border-berry bg-blush/40" : "border-[#e7d6cf]"}`}>
              <input type="radio" name="pay" checked={method === v} onChange={() => setMethod(v)} className="mt-1" />
              <span><b>{t1}</b><br /><span className="text-sm text-muted">{d}</span></span>
            </label>
          ))}
        </section>
      </div>
      <aside className="card h-fit space-y-3 p-6">
        <h2 className="text-lg font-bold">Your order</h2>
        <ul className="space-y-2 text-sm">
          {c.items.map((it, i) => { const p = getProduct(it.slug)!; return (
            <li key={i} className="flex justify-between gap-2"><span>{p.emoji} {p.name} × {it.qty}{it.text && <em className="block text-muted">“{it.text}”</em>}</span><span>{inr(p.price * it.qty)}</span></li>
          ); })}
        </ul>
        <dl className="space-y-1 border-t border-black/10 pt-3 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
          {t.discount > 0 && <div className="flex justify-between text-leaf"><dt>Discount ({c.coupon})</dt><dd>−{inr(t.discount)}</dd></div>}
          {t.wrap > 0 && <div className="flex justify-between"><dt>Gift wrap</dt><dd>{inr(t.wrap)}</dd></div>}
          <div className="flex justify-between"><dt>Shipping</dt><dd>{t.shipping ? inr(t.shipping) : "Free"}</dd></div>
          <div className="flex justify-between border-t border-black/10 pt-2 text-lg font-bold"><dt>Total</dt><dd>{inr(t.total)}</dd></div>
        </dl>
        {err && <p className="rounded-lg bg-berry/10 p-3 text-sm text-berry">{err}</p>}
        <button disabled={busy} className="btn btn-primary w-full">{busy ? "Processing…" : method === "cod" ? "Place order" : `Pay ${inr(t.total)}`}</button>
        <p className="text-center text-xs text-muted">🔒 Payments are processed securely. We never store card details.</p>
      </aside>
    </form>
  );
}
