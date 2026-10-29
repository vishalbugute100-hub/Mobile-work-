import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Bulk, Corporate & Custom Gifting Enquiry",
  description: "Request a quote for bulk orders, corporate gifting, festive hampers or a custom gift. Custom packaging and branding available.",
  alternates: { canonical: "/enquiry" },
};

export default async function Enquiry({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const s = await getSettings();
  if (sp.sent)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="eyebrow">Enquiry received</p>
        <h1 className="font-display mt-2 text-5xl font-semibold text-forest">Thank you.</h1>
        <p className="mt-3 text-muted">Your request <b className="text-ink">{sp.sent.replace(/[^A-Za-z0-9]/g, "")}</b> has reached our team. We will review it and send you a quote.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">Continue browsing</Link>
          {s.whatsapp && <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`} className="btn btn-ghost">WhatsApp us</a>}
        </div>
      </div>
    );
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <p className="eyebrow">Corporate · Festive · Bulk</p>
        <h1 className="font-display mt-2 text-5xl font-semibold leading-tight text-forest">Gifting at scale, made personal.</h1>
        <p className="mt-4 text-muted">Whether it is 25 hampers for your clients, festive gifts for your team, wedding favours, or something you cannot find on our site, tell us what you have in mind. We will prepare a quote.</p>
        <ul className="mt-6 space-y-3 text-sm">
          {["Custom packaging, logo and message cards", "Bulk pricing on tea, coffee and spice collections", "Mix and match products into one tailored gift", "Delivery to multiple addresses on request"].map((t) => (
            <li key={t} className="flex gap-3"><span className="text-gold">◆</span>{t}</li>
          ))}
        </ul>
        {(s.phone || s.email || s.whatsapp) && (
          <div className="mt-8 border-t border-line pt-5 text-sm text-muted">
            Prefer to talk? {s.phone && <>Call <a className="text-forest underline" href={`tel:${s.phone}`}>{s.phone}</a>. </>}
            {s.email && <>Email <a className="text-forest underline" href={`mailto:${s.email}`}>{s.email}</a>.</>}
          </div>
        )}
      </div>
      <EnquiryForm type={sp.type ?? "Custom request"} product={sp.product ?? ""} slug={sp.slug ?? ""} />
    </div>
  );
}
