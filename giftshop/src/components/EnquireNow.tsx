"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { inr } from "@/lib/format";
import type { Packaging } from "@/lib/types";

export function EnquireNow({ name, slug, price, showPrice, packaging, personaliseLabel, personaliseMax }: { name: string; slug: string; price: number; showPrice: boolean; packaging: Packaging[]; personaliseLabel?: string; personaliseMax?: number }) {
  const r = useRouter();
  const [pk, setPk] = useState(0);
  const [qty, setQty] = useState("");
  const [text, setText] = useState("");
  const go = () => {
    const pack = packaging[pk];
    const note = [pack ? `Presentation: ${pack.name}` : "", text ? `${personaliseLabel || "Note"}: ${text}` : ""].filter(Boolean).join(". ");
    const q = new URLSearchParams({ type: "Bulk order", product: name, slug, qty, note });
    r.push(`/enquiry?${q}`);
  };
  return (
    <div className="mt-6 space-y-5">
      {packaging.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-forest">Presentation</p>
          <div className="mt-2 grid gap-2">
            {packaging.map((x, i) => (
              <label key={x.name} className={`flex cursor-pointer items-center justify-between border p-3 text-sm ${pk === i ? "border-forest bg-white" : "border-line"}`}>
                <span className="flex items-center gap-2"><input type="radio" name="pk" checked={pk === i} onChange={() => setPk(i)} />{x.name}</span>
                <span className="text-muted">{showPrice ? (x.extra ? `+ ${inr(x.extra)}` : "Included") : ""}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {personaliseLabel && <label className="block"><span className="lbl">{personaliseLabel}</span><input className="input" maxLength={personaliseMax || 100} value={text} onChange={(e) => setText(e.target.value)} /></label>}
      <label className="block"><span className="lbl">How many do you need?</span><input className="input" inputMode="numeric" placeholder="e.g. 50" value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))} /></label>
      <button className="btn btn-primary w-full" onClick={go}>Request a quote</button>
      <p className="text-center text-xs text-muted">No payment now. We will send you a quote.</p>
    </div>
  );
}
