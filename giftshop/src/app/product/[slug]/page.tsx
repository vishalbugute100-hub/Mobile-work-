import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, PRODUCTS, discountPct, getProduct } from "@/lib/products";
import { inr } from "@/lib/format";
import { SITE } from "@/lib/site";
import { Art } from "@/components/Art";
import { ProductCard } from "@/components/ProductCard";
import { AddToCart } from "@/components/AddToCart";
import { PincodeCheck } from "@/components/PincodeCheck";

type P = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} - Buy Online`,
    description: `${p.short} ${inr(p.price)} with secure payment and delivery.`.slice(0, 160),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: p.name, description: p.short, type: "website", images: p.image ? [p.image] : undefined },
  };
}

export default async function ProductPage({ params }: { params: P }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const cat = CATEGORIES.find((c) => c.slug === p.category);
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && (x.category === p.category || x.occasions.some((o) => p.occasions.includes(o)))).slice(0, 4);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.slug,
    category: cat?.name,
    image: p.image ? [p.image] : undefined,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/product/${p.slug}`,
      priceCurrency: "INR",
      price: p.price,
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: cat?.name, item: `${SITE.url}/shop?category=${p.category}` },
      { "@type": "ListItem", position: 3, name: p.name },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([ld, crumbs]) }} />
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-berry">Home</Link> / <Link href={`/shop?category=${p.category}`} className="hover:text-berry">{cat?.name}</Link> / {p.name}
      </nav>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="card overflow-hidden"><Art p={p} big className="aspect-square w-full" /></div>
        <div>
          <h1 className="font-display text-4xl font-bold">{p.name}</h1>
          <p className="mt-2 text-muted">{p.short}</p>
          <p className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{inr(p.price)}</span>
            <span className="text-lg text-muted line-through">{inr(p.mrp)}</span>
            <span className="rounded-full bg-leaf px-2.5 py-0.5 text-sm font-bold text-white">{discountPct(p)}% off</span>
          </p>
          <p className="text-xs text-muted">Inclusive of all taxes</p>
          <AddToCart slug={p.slug} name={p.name} price={p.price} personalise={p.personalise} />
          <PincodeCheck />
          <div className="mt-8">
            <h2 className="font-semibold">About this gift</h2>
            <p className="mt-2 text-muted">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.occasions.map((o) => (<Link key={o} href={`/shop?occasion=${o}`} className="chip capitalize">{o}</Link>))}
            </div>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold">You may also like</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">{related.map((r) => (<ProductCard key={r.slug} p={r} />))}</div>
        </section>
      )}
    </div>
  );
}
