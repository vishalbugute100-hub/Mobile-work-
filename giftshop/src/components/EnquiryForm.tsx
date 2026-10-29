"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/track";

const TYPES = ["Bulk order", "Corporate gifting", "Festive gifting", "Wedding / event favours", "Custom request"];

export function EnquiryForm({ type, product, slug }: { type: string; product: string; slug: string }) {
  const r = useRouter();
  const [f, setF] = useState({ type: TYPES.includes(type) ? type : type || "Custom request", name: "", company: "", email: "", phone: "", city: "", product, productSlug: slug, quantity: "", budget: "", neededBy: "", branding: false, message: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });
  const types = TYPES.includes(f.type) ? TYPES : [f.type, ...TYPES];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { setErr(j.error || "Could not send your enquiry. Please try again."); setBusy(false); return; }
    track("generate_lead");
    r.push(`/enquiry?sent=${j.id}`);
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-6 md:p-8">
      <label className="block"><span className="lbl">What do you need?</span>
        <select className="input" value={f.type} onChange={set("type")}>{types.map((t) => <option key={t}>{t}</option>)}</select></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="lbl">Your name *</span><input required className="input" value={f.name} onChange={set("name")} autoComplete="name" /></label>
        <label className="block"><span className="lbl">Company (if any)</span><input className="input" value={f.company} onChange={set("company")} autoComplete="organization" /></label>
        <label className="block"><span className="lbl">Email *</span><input required type="email" className="input" value={f.email} onChange={set("email")} autoComplete="email" /></label>
        <label className="block"><span className="lbl">Phone / WhatsApp *</span><input required type="tel" className="input" value={f.phone} onChange={set("phone")} autoComplete="tel" /></label>
      </div>
      <label className="block"><span className="lbl">Product(s) you are interested in</span><input className="input" value={f.product} onChange={set("product")} placeholder="e.g. Tea Connoisseur Gift Box, or describe something we don't list" /></label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block"><span className="lbl">Quantity</span><input className="input" value={f.quantity} onChange={set("quantity")} placeholder="e.g. 100" /></label>
        <label className="block"><span className="lbl">Budget per unit (₹)</span><input className="input" value={f.budget} onChange={set("budget")} placeholder="e.g. 1500" /></label>
        <label className="block"><span className="lbl">Needed by</span><input type="date" className="input" value={f.neededBy} onChange={set("neededBy")} min={new Date().toISOString().slice(0, 10)} /></label>
      </div>
      <label className="block"><span className="lbl">Delivery city</span><input className="input" value={f.city} onChange={set("city")} /></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.branding} onChange={set("branding")} /> I need custom branding / logo / packaging</label>
      <label className="block"><span className="lbl">Tell us more</span><textarea rows={4} className="input" value={f.message} onChange={set("message")} placeholder="Occasion, recipients, preferences, anything else we should know" /></label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} className="hidden" aria-hidden />
      {err && <p className="bg-alert/10 p-3 text-sm text-alert">{err}</p>}
      <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Sending…" : "Request a quote"}</button>
      <p className="text-center text-xs text-muted">We will review your request and send you a quote.</p>
    </form>
  );
}
