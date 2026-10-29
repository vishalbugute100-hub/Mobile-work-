"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/track";
import { inr } from "@/lib/format";
import type { Packaging } from "@/lib/types";

type P = { slug: string; name: string; price: number; emoji: string; hue: number; image?: string; packaging: Packaging[]; personaliseLabel?: string; personaliseMax?: number; inStock: boolean };

export function AddToCart({ p }: { p: P }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [text, setText] = useState("");
  const [pk, setPk] = useState(0);
  const [added, setAdded] = useState(false);
  const pack = p.packaging[pk];
  const unit = p.price + (pack?.extra ?? 0);

  const doAdd = () => {
    if (p.personaliseLabel && !text.trim()) { alert(`Please fill in: ${p.personaliseLabel}`); return false; }
    add({ slug: p.slug, name: p.name, price: unit, emoji: p.emoji, hue: p.hue, image: p.image, text: text.trim() || undefined, packaging: pack?.name }, qty);
    track("add_to_cart", { value: unit * qty, id: p.slug, name: p.name });
    return true;
  };

  return (
    <div className="mt-6 space-y-5">
      {p.packaging.length > 0 && (
        <div>
          <p className="lbl text-xs font-semibold uppercase tracking-widest text-forest">Presentation</p>
          <div className="mt-2 grid gap-2">
            {p.packaging.map((x, i) => (
              <label key={x.name} className={`flex cursor-pointer items-center justify-between border p-3 text-sm ${pk === i ? "border-forest bg-white" : "border-line"}`}>
                <span className="flex items-center gap-2"><input type="radio" name="pk" checked={pk === i} onChange={() => setPk(i)} />{x.name}</span>
                <span className="text-muted">{x.extra ? `+ ${inr(x.extra)}` : "Included"}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {p.personaliseLabel && (
        <label className="block">
          <span className="lbl">{p.personaliseLabel}</span>
          <input className="input" maxLength={p.personaliseMax || 100} value={text} onChange={(e) => setText(e.target.value)} />
        </label>
      )}
      {p.inStock ? (
        <>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-line bg-white">
              <button type="button" className="px-4 py-2 text-lg" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button type="button" className="px-4 py-2 text-lg" onClick={() => setQty(Math.min(999, qty + 1))} aria-label="Increase">+</button>
            </div>
            <button className="btn btn-primary flex-1" onClick={() => { if (doAdd()) { setAdded(true); setTimeout(() => setAdded(false), 1800); } }}>
              {added ? "✓ Added" : `Add to cart · ${inr(unit * qty)}`}
            </button>
          </div>
          <button className="btn btn-ghost w-full" onClick={() => { if (doAdd()) router.push("/checkout"); }}>Buy now</button>
        </>
      ) : (
        <p className="border border-line bg-white p-4 text-sm">Currently out of stock. Send us an enquiry and we will let you know when it is back.</p>
      )}
    </div>
  );
}
