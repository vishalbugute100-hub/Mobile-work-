import Link from "next/link";
import { CATEGORIES } from "@/lib/products";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold">🎁 {SITE.name}</p>
          <p className="mt-2 text-sm text-cream/70">{SITE.tagline}. Curated and personalised gifts for every occasion.</p>
        </div>
        <div>
          <p className="mb-2 font-semibold">Shop</p>
          <ul className="space-y-1 text-sm text-cream/70">
            {CATEGORIES.map((c) => (<li key={c.slug}><Link href={`/shop?category=${c.slug}`} className="hover:text-gold">{c.name}</Link></li>))}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold">Help</p>
          <ul className="space-y-1 text-sm text-cream/70">
            <li><Link href="/blog" className="hover:text-gold">Gift guides</Link></li>
            <li><Link href="/policies" className="hover:text-gold">Shipping, returns & privacy</Link></li>
            {SITE.whatsapp && <li><a href={`https://wa.me/${SITE.whatsapp}`} className="hover:text-gold">WhatsApp us</a></li>}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold">Secure checkout</p>
          <p className="text-sm text-cream/70">UPI · Cards · Netbanking · Cash on Delivery</p>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-cream/50">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
    </footer>
  );
}
