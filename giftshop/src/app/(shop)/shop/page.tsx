import type { Metadata } from "next";
import Link from "next/link";
import { filterProducts, getCategories, getProducts, getSettings } from "@/lib/content";
import { ProductCard } from "@/components/ProductCard";

type SP = Promise<Record<string, string | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const cat = (await getCategories()).find((c) => c.slug === sp.category);
  const title = cat ? cat.name : sp.tag ? `${sp.tag.replace(/-/g, " ")} gifts` : "Shop All Gifts";
  const hasFilter = Object.keys(sp).some((k) => k !== "category" && k !== "tag") || (!!sp.category && !!sp.tag);
  return {
    title,
    description: cat?.blurb || `Browse ${title.toLowerCase()}: premium tea, coffee and spice gifts with corporate and bulk options.`,
    alternates: { canonical: cat ? `/shop?category=${cat.slug}` : sp.tag ? `/shop?tag=${sp.tag}` : "/shop" },
    robots: hasFilter ? { index: false, follow: true } : undefined,
  };
}

export default async function Shop({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const [all, cats, settings] = await Promise.all([getProducts(), getCategories(), getSettings()]);
  const list = filterProducts(all, { q: sp.q, category: sp.category, tag: sp.tag, max: sp.max ? Number(sp.max) : undefined, sort: sp.sort });
  const tags = [...new Set(all.flatMap((p) => p.tags))];
  const cat = cats.find((c) => c.slug === sp.category);

  const link = (patch: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...patch })) if (v) q.set(k, v);
    return `/shop?${q}`;
  };
  const group = (title: string, key: string, items: { slug: string; name: string }[]) => (
    <div>
      <p className="eyebrow mb-2 !text-forest">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (<Link key={i.slug} href={link({ [key]: sp[key] === i.slug ? undefined : i.slug })} className="chip" data-on={sp[key] === i.slug}>{i.name}</Link>))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="eyebrow">{cat ? "Collection" : "Shop"}</p>
      <h1 className="font-display mt-1 text-5xl font-semibold text-forest">{cat ? cat.name : sp.q ? `Results for “${sp.q}”` : sp.tag ? `${sp.tag.replace(/-/g, " ")} gifts` : "All gifts"}</h1>
      {cat?.blurb && <p className="mt-2 max-w-2xl text-muted">{cat.blurb}</p>}
      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit space-y-6">
          {group("Collection", "category", cats)}
          {tags.length > 0 && group("Occasion", "tag", tags.map((t) => ({ slug: t, name: t.replace(/-/g, " ") })))}
          {settings.showPrices && group("Budget", "max", [{ slug: "1000", name: "Under ₹1,000" }, { slug: "2500", name: "Under ₹2,500" }, { slug: "5000", name: "Under ₹5,000" }])}
          {settings.showPrices && group("Sort", "sort", [{ slug: "price-asc", name: "Price: low to high" }, { slug: "price-desc", name: "Price: high to low" }])}
          {Object.keys(sp).length > 0 && <Link href="/shop" className="block text-sm font-semibold text-gold">Clear filters</Link>}
          <div className="border border-gold/50 bg-white p-4 text-sm">
            <p className="font-semibold text-forest">Need bulk or custom?</p>
            <p className="mt-1 text-muted">Tell us what you need and we will send a quote.</p>
            <Link href="/enquiry" className="btn btn-gold mt-3 w-full !py-2">Enquire</Link>
          </div>
        </aside>
        {list.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        ) : (
          <div className="card p-12 text-center"><p className="font-display text-2xl text-forest">Nothing matches those filters.</p><p className="mt-1 text-sm text-muted">Can't find it? We can source or customise.</p>
            <div className="mt-4 flex justify-center gap-2"><Link href="/shop" className="btn btn-ghost">See all</Link><Link href="/enquiry" className="btn btn-primary">Send an enquiry</Link></div></div>
        )}
      </div>
    </div>
  );
}
