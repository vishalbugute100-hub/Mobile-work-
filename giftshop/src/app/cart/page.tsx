"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { getProduct } from "@/lib/products";
import { COUPONS, findCoupon } from "@/lib/pricing";
import { FREE_SHIPPING_ABOVE, GIFT_WRAP_FEE } from "@/lib/site";
import { inr } from "@/lib/format";
import { Art } from "@/components/Art";

export default function CartPage() {
  const c = useCart();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  if (!c.ready) return <div className="mx-auto max-w-5xl px-4 py-20 text-center text-muted">Loading cart…</div>;
  if (!c.items.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-7xl">🛒</p>
        <h1 className="font-display mt-4 text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Let's find something lovely.</p>
        <Link href="/shop" className="btn btn-primary mt-6">Browse gifts</Link>
      </div>
    );

  const apply = () => {
    const f = findCoupon(code);
    if (!f) return setErr("Invalid coupon code");
    if (c.subtotal < (f.min ?? 0)) return setErr(`Add ${inr((f.min ?? 0) - c.subtotal)} more to use ${f.code}`);
    setErr(""); c.set({ coupon: f.code }); setCode("");
  };
  const t = c.totals;
  const toFree = FREE_SHIPPING_ABOVE - (c.subtotal - t.discount);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="font-display text-4xl font-bold">Your cart</h1>
        {toFree > 0 ? (
          <p className="mt-3 rounded-xl bg-gold/30 px-4 py-2 text-sm">Add <b>{inr(toFree)}</b> more for free shipping 🚚</p>
        ) : (
          <p className="mt-3 rounded-xl bg-leaf/10 px-4 py-2 text-sm text-leaf">🎉 You've unlocked free shipping</p>
        )}
        <ul className="mt-5 space-y-4">
          {c.items.map((it, i) => {
            const p = getProduct(it.slug)!;
            return (
              <li key={i} className="card flex gap-4 p-4">
                <Link href={`/product/${p.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl"><Art p={p} className="h-full w-full" /></Link>
                <div className="flex-1">
                  <Link href={`/product/${p.slug}`} className="font-semibold hover:text-berry">{p.name}</Link>
                  {it.text && <p className="text-sm text-muted">✍️ “{it.text}”</p>}
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center rounded-full border border-[#e7d6cf]">
                      <button className="px-3 py-1" onClick={() => c.setQty(i, it.qty - 1)} aria-label="Decrease">−</button>
                      <span className="w-6 text-center text-sm">{it.qty}</span>
                      <button className="px-3 py-1" onClick={() => c.setQty(i, it.qty + 1)} aria-label="Increase">+</button>
                    </div>
                    <button className="text-sm text-berry hover:underline" onClick={() => c.remove(i)}>Remove</button>
                  </div>
                </div>
                <p className="font-bold">{inr(p.price * it.qty)}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <aside className="card h-fit space-y-4 p-6">
        <h2 className="text-lg font-bold">Order summary</h2>
        <label className="flex items-start gap-3 rounded-xl bg-blush/60 p-3 text-sm">
          <input type="checkbox" className="mt-1" checked={c.giftWrap} onChange={(e) => c.set({ giftWrap: e.target.checked })} />
          <span><b>🎀 Gift wrap</b> (+{inr(GIFT_WRAP_FEE)})<br /><span className="text-muted">Premium wrap with a handwritten card.</span></span>
        </label>
        {c.giftWrap && (
          <textarea className="input" rows={3} maxLength={200} placeholder="Message for the card (optional)" value={c.giftMessage} onChange={(e) => c.set({ giftMessage: e.target.value })} />
        )}
        <div>
          <div className="flex gap-2">
            <input className="input" placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="btn btn-ghost !px-4" onClick={apply}>Apply</button>
          </div>
          {err && <p className="mt-1 text-sm text-berry">{err}</p>}
          {c.coupon && <p className="mt-1 text-sm text-leaf">✓ {c.coupon} applied · <button className="underline" onClick={() => c.set({ coupon: "" })}>remove</button></p>}
          <p className="mt-2 text-xs text-muted">Try: {COUPONS.map((x) => x.code).join(", ")}</p>
        </div>
        <dl className="space-y-1 border-t border-black/10 pt-4 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
          {t.discount > 0 && <div className="flex justify-between text-leaf"><dt>Discount</dt><dd>−{inr(t.discount)}</dd></div>}
          {t.wrap > 0 && <div className="flex justify-between"><dt>Gift wrap</dt><dd>{inr(t.wrap)}</dd></div>}
          <div className="flex justify-between"><dt>Shipping</dt><dd>{t.shipping ? inr(t.shipping) : "Free"}</dd></div>
          <div className="flex justify-between border-t border-black/10 pt-2 text-lg font-bold"><dt>Total</dt><dd>{inr(t.total)}</dd></div>
        </dl>
        <Link href="/checkout" className="btn btn-primary w-full">Checkout →</Link>
      </aside>
    </div>
  );
}
