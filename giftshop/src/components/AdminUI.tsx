import Link from "next/link";

export const F = ({ label, hint, children, className = "" }: { label: string; hint?: string; children: React.ReactNode; className?: string }) => (
  <label className={`block ${className}`}><span className="lbl">{label}</span>{children}{hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}</label>
);
export const Flash = ({ saved, error }: { saved?: string; error?: string }) => (
  <>
    {saved && <p className="mb-4 border border-forest/30 bg-forest/10 p-3 text-sm text-forest">✓ Saved{saved !== "1" ? `: ${saved}` : ""}. Changes are live on your site.</p>}
    {error && <p className="mb-4 border border-alert/30 bg-alert/10 p-3 text-sm text-alert">{error}</p>}
  </>
);
export const Tabs = ({ base, current, items }: { base: string; current?: string; items: [string, string][] }) => (
  <div className="mb-5 flex flex-wrap gap-2">
    {items.map(([v, l]) => (<Link key={v} href={v ? `${base}?status=${v}` : base} className="chip" data-on={(current || "") === v}>{l}</Link>))}
  </div>
);
