"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { inr } from "@/lib/format";
import { track } from "@/lib/track";
import { Art } from "./Art";

type P = { slug: string; name: string; price: number; category: string; emoji: string; hue: number; image?: string; size?: string };
type Box = { name: string; note: string };

export function KitBuilder({ products, cats, boxes, showPrices }: { products: P[]; cats: { slug: string; name: string }[]; boxes: Box[]; showPrices: boolean }) {
  const r = useRouter();
  const [box, setBox] = useState(0);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [cat, setCat] = useState("");
  const [extra, setExtra] = useState("");
  const [occasion, setOccasion] = useState("");
  const [card, setCard] = useState("");
  const [branding, setBranding] = useState(false);
  const [kits, setKits] = useState("");
  const [budget, setBudget] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [c, setC] = useState({ name: "", company: "", email: "", phone: "", city: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const chosen = useMemo(() => products.filter((p) => qty[p.slug] > 0), [products, qty]);
  const count = chosen.reduce((t, p) => t + qty[p.slug], 0);
  const value = chosen.reduce((t, p) => t + p.price * qty[p.slug], 0);
  const shown = cat ? products.filter((p) => p.category === cat) : products;
  const bump = (slug: string, d: number) => setQty((q) => ({ ...q, [slug]: Math.max(0, Math.min(20, (q[slug] || 0) + d)) }));

  async function submit() {
    setErr("");
    if (!chosen.length && !extra.trim()) return setErr("Please choose at least one product or describe what you would like in the kit.");
    if (!c.name.trim() || !/^\S+@\S+\.\S+$/.test(c.email) || c.phone.replace(/\D/g, "").length < 8) return setErr("Please enter your name, a valid email and phone number.");
    setBusy(true);
    const lines = [
      "CUSTOM GIFT KIT",
      `Box style: ${boxes[box]?.name ?? "No preference"}`,
      "Items in each kit:",
      ...chosen.map((p) => `- ${qty[p.slug]} × ${p.name}${p.size && !p.name.includes(p.size) ? ` (${p.size})` : ""}`),
      extra.trim() ? `Additional items / requests: ${extra.trim()}` : "",
      occasion.trim() ? `Occasion: ${occasion.trim()}` : "",
      card.trim() ? `Card message: ${card.trim()}` : "",
      kits ? `Number of kits: ${kits}` : "",
    ].filter(Boolean).join("\n");
    const res = await fetch("/api/enquiry", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "Custom gift kit", ...c, product: `Custom kit (${boxes[box]?.name ?? "box"}): ${chosen.map((p) => `${qty[p.slug]}× ${p.name}`).join(", ")}`.slice(0, 290), productSlug: "", quantity: kits, budget, neededBy, branding, message: lines }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { setErr(j.error || "Could not send. Please try again."); setBusy(false); return; }
    track("generate_lead");
    r.push(`/enquiry?sent=${j.id}`);
  }

  const step = (n: number, t: string, d?: string) => (<div className="mb-4"><p className="eyebrow">Step {n}</p><h2 className="font-display text-3xl font-semibold text-forest">{t}</h2>{d && <p className="text-sm text-muted">{d}</p>}</div>);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div className="space-y-12">
        <section>
          {step(1, "Choose your box")}
          <div className="grid gap-3 sm:grid-cols-3">
            {boxes.map((b, i) => (
              <button key={b.name} type="button" onClick={() => setBox(i)} className={`border p-4 text-left transition ${box === i ? "border-forest bg-white shadow-sm" : "border-line bg-white/50 hover:border-gold"}`}>
                <p className="font-display text-xl font-semibold text-forest">{b.name}</p>
                {b.note && <p className="mt-1 text-xs text-muted">{b.note}</p>}
              </button>
            ))}
          </div>
        </section>

        <section>
          {step(2, "Pick what goes inside", "Add as many as you like. Quantities are per kit.")}
          <div className="mb-4 flex flex-wrap gap-2">
            <button type="button" className="chip" data-on={!cat} onClick={() => setCat("")}>All</button>
            {cats.map((x) => (<button key={x.slug} type="button" className="chip" data-on={cat === x.slug} onClick={() => setCat(x.slug)}>{x.name}</button>))}
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {shown.map((p) => {
              const n = qty[p.slug] || 0;
              return (
                <div key={p.slug} className={`card overflow-hidden ${n ? "!border-forest" : ""}`}>
                  <div className="aspect-[4/3] overflow-hidden"><Art p={p} className="h-full w-full" /></div>
                  <div className="p-3">
                    <p className="font-display text-lg font-semibold leading-tight text-forest">{p.name}</p>
                    <p className="text-xs text-muted">{p.size}{showPrices && ` · ${inr(p.price)}`}</p>
                    <div className="mt-2 flex items-center justify-between">
                      {n === 0 ? <button type="button" className="btn btn-ghost !px-4 !py-1.5" onClick={() => bump(p.slug, 1)}>Add</button> : (
                        <div className="flex items-center border border-forest">
                          <button type="button" className="px-3 py-1" onClick={() => bump(p.slug, -1)} aria-label={`Less ${p.name}`}>−</button>
                          <span className="w-6 text-center text-sm font-semibold">{n}</span>
                          <button type="button" className="px-3 py-1" onClick={() => bump(p.slug, 1)} aria-label={`More ${p.name}`}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          {step(3, "Anything else?", "Not on our site? Tell us what else you would like in the kit and we will see what we can do.")}
          <textarea className="input" rows={3} placeholder="e.g. a small notebook, dry fruits, chocolates, a ceramic mug…" value={extra} onChange={(e) => setExtra(e.target.value)} />
        </section>

        <section>
          {step(4, "Make it personal")}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="lbl">Occasion</span><input className="input" placeholder="Diwali, client thank-you, wedding…" value={occasion} onChange={(e) => setOccasion(e.target.value)} /></label>
            <label className="flex items-end gap-2 pb-3 text-sm"><input type="checkbox" checked={branding} onChange={(e) => setBranding(e.target.checked)} /> I want my logo / custom branding on the box</label>
          </div>
          <label className="mt-4 block"><span className="lbl">Message for the card</span><textarea className="input" rows={2} maxLength={200} value={card} onChange={(e) => setCard(e.target.value)} placeholder="Wishing you a joyful Diwali…" /></label>
        </section>

        <section>
          {step(5, "How many, and by when?")}
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block"><span className="lbl">Number of kits</span><input className="input" inputMode="numeric" placeholder="e.g. 100" value={kits} onChange={(e) => setKits(e.target.value.replace(/\D/g, ""))} /></label>
            <label className="block"><span className="lbl">Budget per kit (₹)</span><input className="input" inputMode="numeric" placeholder="optional" value={budget} onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))} /></label>
            <label className="block"><span className="lbl">Needed by</span><input type="date" className="input" min={new Date().toISOString().slice(0, 10)} value={neededBy} onChange={(e) => setNeededBy(e.target.value)} /></label>
          </div>
        </section>

        <section>
          {step(6, "Your details")}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="lbl">Name *</span><input className="input" autoComplete="name" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></label>
            <label className="block"><span className="lbl">Company</span><input className="input" autoComplete="organization" value={c.company} onChange={(e) => setC({ ...c, company: e.target.value })} /></label>
            <label className="block"><span className="lbl">Email *</span><input type="email" className="input" autoComplete="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></label>
            <label className="block"><span className="lbl">Phone / WhatsApp *</span><input type="tel" className="input" autoComplete="tel" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} /></label>
            <label className="block sm:col-span-2"><span className="lbl">Delivery city</span><input className="input" value={c.city} onChange={(e) => setC({ ...c, city: e.target.value })} /></label>
          </div>
          <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden value={c.website} onChange={(e) => setC({ ...c, website: e.target.value })} />
        </section>
      </div>

      <aside className="h-fit border border-gold/60 bg-white p-6 lg:sticky lg:top-28">
        <p className="eyebrow">Your kit</p>
        <p className="font-display mt-1 text-2xl font-semibold text-forest">{boxes[box]?.name ?? "Gift kit"}</p>
        <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm">
          {chosen.map((p) => (<li key={p.slug} className="flex justify-between gap-2"><span>{qty[p.slug]} × {p.name}</span>{showPrices && <span className="text-muted">{inr(p.price * qty[p.slug])}</span>}</li>))}
          {extra.trim() && <li className="text-muted">+ {extra.trim().slice(0, 60)}{extra.length > 60 ? "…" : ""}</li>}
          {!chosen.length && !extra.trim() && <li className="text-muted">Nothing added yet.</li>}
        </ul>
        {count > 0 && <p className="mt-3 border-t border-line pt-3 text-sm">{count} item{count > 1 ? "s" : ""} per kit{showPrices && <> · products value <b>{inr(value)}</b></>}</p>}
        {showPrices && count > 0 && <p className="mt-1 text-xs text-muted">Indicative only. Box, branding and packing are extra; your quote may differ.</p>}
        {err && <p className="mt-3 bg-alert/10 p-2 text-sm text-alert">{err}</p>}
        <button type="button" className="btn btn-primary mt-4 w-full" disabled={busy} onClick={submit}>{busy ? "Sending…" : "Request a quote"}</button>
        <p className="mt-2 text-center text-xs text-muted">No payment now. We will send you a quote.</p>
      </aside>
    </div>
  );
}
