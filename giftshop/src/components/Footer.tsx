import Link from "next/link";
import type { Settings } from "@/lib/types";

export function Footer({ s, categories }: { s: Settings; categories: { slug: string; name: string }[] }) {
  return (
    <footer className="mt-24 bg-forest text-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-3xl font-bold">{s.name}</p>
          <p className="mt-2 text-sm italic text-gold-light">{s.tagline}</p>
          <p className="mt-3 text-sm text-ivory/60">{s.altTagline}</p>
          {s.parentLine && <p className="mt-4 text-xs uppercase tracking-widest text-gold-light">{s.parentLine}</p>}
        </div>
        <div>
          <p className="eyebrow mb-3">Shop</p>
          <ul className="space-y-1.5 text-sm text-ivory/75">
            {categories.map((c) => (<li key={c.slug}><Link href={`/shop?category=${c.slug}`} className="hover:text-gold-light">{c.name}</Link></li>))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Company</p>
          <ul className="space-y-1.5 text-sm text-ivory/75">
            <li><Link href="/enquiry" className="hover:text-gold-light">Bulk & corporate enquiry</Link></li>
            <li><Link href="/about" className="hover:text-gold-light">About us</Link></li>
            <li><Link href="/blog" className="hover:text-gold-light">Gift guides</Link></li>
            <li><Link href="/policies" className="hover:text-gold-light">Shipping, returns & privacy</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Contact</p>
          <ul className="space-y-1.5 text-sm text-ivory/75">
            {s.phone && <li><a href={`tel:${s.phone}`} className="hover:text-gold-light">{s.phone}</a></li>}
            {s.email && <li><a href={`mailto:${s.email}`} className="hover:text-gold-light">{s.email}</a></li>}
            {s.whatsapp && <li><a href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`} className="hover:text-gold-light">WhatsApp us</a></li>}
            {s.address && <li className="whitespace-pre-line">{s.address}</li>}
            {!s.phone && !s.email && !s.whatsapp && <li><Link href="/enquiry" className="hover:text-gold-light">Send an enquiry</Link></li>}
          </ul>
        </div>
      </div>
      {s.legalInfo && <p className="whitespace-pre-line border-t border-white/10 px-4 py-4 text-center text-xs leading-relaxed text-ivory/50">{s.legalInfo}</p>}
      <p className="border-t border-white/10 py-5 text-center text-xs text-ivory/50">© {new Date().getFullYear()} {s.name}. All rights reserved.</p>
    </footer>
  );
}
