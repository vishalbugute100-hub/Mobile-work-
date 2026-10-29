"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import { Art } from "@/components/Art";

export default function CartPage() {
  const c = useCart();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  if (!c.ready) return <div className="mx-auto max-w-5xl px-4 py-24 text-center text-muted">Loading cart…</div>;
  if (!c.items.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-28 text-center">
        <p className="eyebrow">Your cart</p>
        <h1 className="font-display mt-2 text-5xl font-semibold text-forest">It's empty.</h1>
        <p className="mt-2 text-muted">Let's find something worth gifting.</p>
        <div className="mt-6 flex justify-center gap-2"><Link href="/shop" className="btn btn-primary">Browse gifts</Link><Link href="/enquiry" className="btn btn-ghost">Bulk enquiry</Link></div>
      </div>
    );

  const apply = async () => {
    setErr("");
    const r = await fetch(`/api/coupon?code=${encodeURIComponent(code)}`);
    const j = await r.json();
    if (!r.ok) return setErr(j.error || "Invalid coupon code");
    if (c.subtotal < (j.coupon.min ?? 0)) return setErr(`Add ${inr(j.coupon.min - c.subtotal)} more to use ${j.coupon.code}`);
    c.set({ coupon: j.coupon }); setCode("");
  };
  const t = c.totals;
  const toFree = c.cfg.freeShipAbove - (c.subtotal - t.discount);
  const bulk = c.items.some((i) => i.qty >= 10);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="font-display text-5xl font-semibold text-forest">Your cart</h1>
        <p className={`mt-3 px-4 py-2 text-sm ${toFree > 0 ? "bg-gold/15" : "bg-forest/10 text-forest"}`}>
          {toFree > 0 ? <>Add <b>{inr(toFree)}</b> more for free shipping.</> : "You've unlocked free shipping."}
        </p>
        {bulk && <p className="mt-3 border border-gold/50 bg-white p-3 text-sm">Ordering in volume? <Link className="font-semibold text-gold underline" href="/enquiry?type=Bulk%20order">Request a bulk quote</Link> for better pricing and custom packaging.</p>}
        <ul className="mt-5 space-y-4">
          {c.items.map((it, i) => (
            <li key={i} className="card flex gap-4 p-4">
              <Link href={`/product/${it.slug}`} className="h-24 w-24 shrink-0 overflow-hidden"><Art p={it} className="h-full w-full" /></Link>
              <div className="flex-1">
                <Link href={`/product/${it.slug}`} className="font-display text-xl font-semibold text-forest hover:text-gold">{it.name}</Link>
                {it.packaging && <p className="text-xs text-muted">Presentation: {it.packaging}</p>}
                {it.text && <p className="text-xs text-muted">Note: “{it.text}”</p>}
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center border border-line">
                    <button className="px-3 py-1" onClick={() => c.setQty(i, it.qty - 1)} aria-label="Decrease">−</button>
                    <span className="w-8 text-center text-sm">{it.qty}</span>
                    <button className="px-3 py-1" onClick={() => c.setQty(i, it.qty + 1)} aria-label="Increase">+</button>
                  </div>
                  <button className="text-xs uppercase tracking-wider text-alert hover:underline" onClick={() => c.remove(i)}>Remove</button>
                </div>
              </div>
              <p className="font-semibold">{inr(it.price * it.qty)}</p>
            </li>
          ))}
        </ul>
      </div>
      <aside className="card h-fit space-y-4 p-6">
        <h2 className="eyebrow !text-forest">Order summary</h2>
        <label className="flex items-start gap-3 bg-ivory p-3 text-sm">
          <input type="checkbox" className="mt-1" checked={c.giftWrap} onChange={(e) => c.set({ giftWrap: e.target.checked })} />
          <span><b>Premium gift wrap</b> (+{inr(c.cfg.giftWrapFee)})<br /><span className="text-muted">Wrapped with a card carrying your message.</span></span>
        </label>
        {c.giftWrap && <textarea className="input" rows={3} maxLength={200} placeholder="Message for the card (optional)" value={c.giftMessage} onChange={(e) => c.set({ giftMessage: e.target.value })} />}
        <div>
          <div className="flex gap-2"><input className="input" placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} /><button className="btn btn-ghost !px-4" onClick={apply}>Apply</button></div>
          {err && <p className="mt-1 text-sm text-alert">{err}</p>}
          {c.coupon && <p className="mt-1 text-sm text-forest">✓ {c.coupon.code} applied · <button className="underline" onClick={() => c.set({ coupon: null })}>remove</button></p>}
        </div>
        <dl className="space-y-1 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
          {t.discount > 0 && <div className="flex justify-between text-forest"><dt>Discount</dt><dd>−{inr(t.discount)}</dd></div>}
          {t.wrap > 0 && <div className="flex justify-between"><dt>Gift wrap</dt><dd>{inr(t.wrap)}</dd></div>}
          <div className="flex justify-between"><dt>Shipping</dt><dd>{t.shipping ? inr(t.shipping) : "Free"}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-lg font-bold"><dt>Total</dt><dd>{inr(t.total)}</dd></div>
        </dl>
        <Link href="/checkout" className="btn btn-primary w-full">Checkout</Link>
      </aside>
    </div>
  );
}
