import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { discountPct, getCategories, getProduct, getProducts, getSettings } from "@/lib/content";
import { inr } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import { Art } from "@/components/Art";
import { ProductCard } from "@/components/ProductCard";
import { AddToCart } from "@/components/AddToCart";
import { PincodeCheck } from "@/components/PincodeCheck";
import { BulkBox } from "@/components/BulkBox";

type P = Promise<{ slug: string }>;
export const revalidate = 300;

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} - Buy Online`,
    description: `${p.short} ${inr(p.price)}. Bulk and corporate gifting available.`.slice(0, 160),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: p.name, description: p.short, type: "website", images: p.images[0] ? [p.images[0]] : undefined },
  };
}

export default async function ProductPage({ params }: { params: P }) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const [all, cats, s] = await Promise.all([getProducts(), getCategories(), getSettings()]);
  const cat = cats.find((c) => c.slug === p.category);
  const related = all.filter((x) => x.slug !== p.slug && (x.category === p.category || x.tags.some((t) => p.tags.includes(t)))).slice(0, 4);
  const abs = (u: string) => (u.startsWith("http") ? u : siteUrl() + u);
  const off = discountPct(p);

  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, sku: p.slug, category: cat?.name,
    image: p.images.length ? p.images.map(abs) : undefined, brand: { "@type": "Brand", name: s.name },
    offers: { "@type": "Offer", url: `${siteUrl()}/product/${p.slug}`, priceCurrency: "INR", price: p.price, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: "https://schema.org/NewCondition" },
  };
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
    { "@type": "ListItem", position: 2, name: cat?.name ?? "Shop", item: `${siteUrl()}/shop?category=${p.category}` },
    { "@type": "ListItem", position: 3, name: p.name } ] };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([ld, crumbs]) }} />
      <nav className="mb-6 text-xs uppercase tracking-widest text-muted">
        <Link href="/" className="hover:text-gold">Home</Link> / <Link href={`/shop?category=${p.category}`} className="hover:text-gold">{cat?.name ?? "Shop"}</Link> / <span className="text-forest">{p.name}</span>
      </nav>
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-3">
          <div className="card aspect-square overflow-hidden"><Art p={p} big className="h-full w-full" /></div>
          {p.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {p.images.slice(1, 5).map((src, i) => (<div key={i} className="card aspect-square overflow-hidden">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src} alt={`${p.name} ${i + 2}`} className="h-full w-full object-cover" loading="lazy" /></div>))}
            </div>
          )}
        </div>
        <div>
          {p.size && <p className="eyebrow">{p.size}</p>}
          <h1 className="font-display mt-1 text-5xl font-semibold leading-tight text-forest">{p.name}</h1>
          <p className="mt-3 text-muted">{p.short}</p>
          <p className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{inr(p.price)}</span>
            {p.mrp > p.price && <><span className="text-lg text-muted line-through">{inr(p.mrp)}</span><span className="bg-forest px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-ivory">{off}% off</span></>}
          </p>
          <p className="text-xs text-muted">Inclusive of all taxes · base price with the standard box</p>
          <AddToCart p={{ slug: p.slug, name: p.name, price: p.price, emoji: p.emoji, hue: p.hue, image: p.images[0], packaging: p.packaging, personaliseLabel: p.personaliseLabel, personaliseMax: p.personaliseMax, inStock: p.stock > 0 }} />
          <BulkBox slug={p.slug} name={p.name} bulkMin={p.bulkMin || s.bulkMin} />
          <PincodeCheck />
          <div className="mt-10">
            <h2 className="eyebrow !text-forest">About this gift</h2>
            <p className="mt-3 leading-relaxed text-muted">{p.description}</p>
            {p.highlights.length > 0 && <ul className="mt-4 space-y-1.5 text-sm">{p.highlights.map((h) => (<li key={h} className="flex gap-2"><span className="text-gold">◆</span>{h}</li>))}</ul>}
            {p.tags.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{p.tags.map((t) => (<Link key={t} href={`/shop?tag=${t}`} className="chip capitalize">{t.replace(/-/g, " ")}</Link>))}</div>}
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl font-semibold text-forest">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
