import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, OCCASIONS, RECIPIENTS, filterProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

type SP = Promise<Record<string, string | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const occ = OCCASIONS.find((o) => o.slug === sp.occasion);
  const cat = CATEGORIES.find((c) => c.slug === sp.category);
  const title = occ ? `${occ.name} Gifts` : cat ? cat.name : "Shop All Gifts";
  const hasFilter = Object.keys(sp).some((k) => k !== "occasion" && k !== "category");
  return {
    title,
    description: `Browse ${title.toLowerCase()} online: personalised and curated options with secure payment and doorstep delivery.`,
    alternates: { canonical: occ ? `/shop?occasion=${occ.slug}` : cat ? `/shop?category=${cat.slug}` : "/shop" },
    robots: hasFilter ? { index: false, follow: true } : undefined,
  };
}

export default async function Shop({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const list = filterProducts({ q: sp.q, category: sp.category, occasion: sp.occasion, for: sp.for, max: sp.max ? Number(sp.max) : undefined, sort: sp.sort });

  const link = (patch: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    const merged = { ...sp, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) q.set(k, v);
    return `/shop?${q}`;
  };
  const group = (title: string, key: string, items: { slug: string; name: string }[]) => (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (<Link key={i.slug} href={link({ [key]: sp[key] === i.slug ? undefined : i.slug })} className="chip" data-on={sp[key] === i.slug}>{i.name}</Link>))}
      </div>
    </div>
  );

  const occ = OCCASIONS.find((o) => o.slug === sp.occasion);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">{occ ? `${occ.emoji} ${occ.name} gifts` : sp.q ? `Results for “${sp.q}”` : "All gifts"}</h1>
      <p className="mt-1 text-muted">{list.length} gift{list.length === 1 ? "" : "s"}</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="card h-fit space-y-5 p-5">
          {group("Category", "category", CATEGORIES)}
          {group("Occasion", "occasion", OCCASIONS)}
          {group("For", "for", RECIPIENTS)}
          {group("Budget", "max", [{ slug: "500", name: "Under ₹500" }, { slug: "1000", name: "Under ₹1,000" }, { slug: "2500", name: "Under ₹2,500" }])}
          {group("Sort", "sort", [{ slug: "price-asc", name: "Price: low to high" }, { slug: "price-desc", name: "Price: high to low" }])}
          {Object.keys(sp).length > 0 && <Link href="/shop" className="block text-sm font-semibold text-berry">Clear all filters</Link>}
        </aside>
        {list.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{list.map((p) => (<ProductCard key={p.slug} p={p} />))}</div>
        ) : (
          <div className="card p-10 text-center"><p className="text-5xl">🔍</p><p className="mt-3 font-semibold">No gifts match those filters.</p><Link href="/shop" className="btn btn-primary mt-4">See all gifts</Link></div>
        )}
      </div>
    </div>
  );
}
