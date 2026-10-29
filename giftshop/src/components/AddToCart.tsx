"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/track";

export function AddToCart({ slug, name, price, personalise }: { slug: string; name: string; price: number; personalise?: { label: string; maxLen: number } }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [text, setText] = useState("");
  const [added, setAdded] = useState(false);

  const doAdd = () => {
    if (personalise && !text.trim()) { alert(`Please enter: ${personalise.label}`); return false; }
    add(slug, qty, text.trim());
    track("add_to_cart", { value: price * qty, id: slug, name });
    return true;
  };

  return (
    <div className="mt-6 space-y-4">
      {personalise && (
        <label className="block">
          <span className="text-sm font-semibold">✍️ {personalise.label}</span>
          <input className="input mt-1" maxLength={personalise.maxLen} value={text} onChange={(e) => setText(e.target.value)} placeholder={`Up to ${personalise.maxLen} characters`} />
        </label>
      )}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border-[1.5px] border-[#e7d6cf] bg-white">
          <button type="button" className="px-4 py-2 text-lg" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <button type="button" className="px-4 py-2 text-lg" onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase">+</button>
        </div>
        <button className="btn btn-primary flex-1" onClick={() => { if (doAdd()) { setAdded(true); setTimeout(() => setAdded(false), 1800); } }}>
          {added ? "✓ Added to cart" : "Add to cart"}
        </button>
      </div>
      <button className="btn btn-ghost w-full" onClick={() => { if (doAdd()) router.push("/checkout"); }}>Buy now</button>
    </div>
  );
}
