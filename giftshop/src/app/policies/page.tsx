import type { Metadata } from "next";
export const metadata: Metadata = { title: "Shipping, Returns & Privacy", alternates: { canonical: "/policies" } };

// TEMPLATE TEXT: have these reviewed and adapted to your business before going live.
export default function Policies() {
  const S = ({ t, children }: { t: string; children: React.ReactNode }) => (<section className="mt-8"><h2 className="text-2xl font-bold">{t}</h2><div className="mt-2 space-y-2 text-muted">{children}</div></section>);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Policies</h1>
      <S t="Shipping"><p>Orders are processed within 1–2 business days (personalised items 2–4 days). Delivery typically takes 3–7 days depending on location. Free shipping above ₹999; otherwise ₹79.</p></S>
      <S t="Returns & refunds"><p>Damaged or wrong items can be reported within 48 hours of delivery with photos for a replacement or refund. Personalised and perishable items are non-returnable unless defective.</p></S>
      <S t="Privacy"><p>We collect your name, contact and address only to fulfil orders and send updates. Payments are handled by our payment partner; we do not store card details. We do not sell your data.</p></S>
      <S t="Terms"><p>Prices are in INR and inclusive of applicable taxes. Product images are indicative. We may cancel orders affected by stock or pricing errors with a full refund.</p></S>
    </div>
  );
}
