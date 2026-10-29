import Link from "next/link";

export function BulkBox({ slug, name, bulkMin }: { slug: string; name: string; bulkMin: number }) {
  const q = (type: string) => `/enquiry?type=${encodeURIComponent(type)}&product=${encodeURIComponent(name)}&slug=${slug}`;
  return (
    <div className="mt-8 border border-gold/50 bg-gradient-to-br from-white to-[#f6efdd] p-5">
      <p className="eyebrow">Corporate · Festive · Bulk</p>
      <h2 className="font-display mt-1 text-2xl font-semibold text-forest">Looking for {bulkMin}+ units?</h2>
      <p className="mt-1 text-sm text-muted">Custom packaging, your logo or message, and bulk pricing for companies, weddings and festive gifting. Tell us what you need and we will send you a quote.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={q("Bulk order")} className="btn btn-gold !px-5 !py-2.5">Bulk quote</Link>
        <Link href={q("Corporate gifting")} className="btn btn-ghost !px-5 !py-2.5">Corporate gifting</Link>
        <Link href={q("Festive gifting")} className="btn btn-ghost !px-5 !py-2.5">Festive gifting</Link>
      </div>
    </div>
  );
}
