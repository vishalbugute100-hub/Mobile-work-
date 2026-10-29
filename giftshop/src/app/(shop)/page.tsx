import Link from "next/link";
import { getCategories, getProducts, getSettings } from "@/lib/content";
import { ProductCard } from "@/components/ProductCard";
import { Art } from "@/components/Art";

export default async function Home() {
  const [s, cats, products] = await Promise.all([getSettings(), getCategories(), getProducts()]);
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const tags = [...new Set(products.flatMap((p) => p.tags))].slice(0, 10);
  const first = (slug: string) => products.find((p) => p.category === slug);
  return (
    <>
      <section className="relative overflow-hidden bg-forest text-ivory">
        {s.heroImage && /* eslint-disable-next-line @next/next/no-img-element */ <img src={s.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-gold/30" />
        <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full border border-gold/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-36">
          <p className="eyebrow">{s.name}</p>
          <h1 className="font-display mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] md:text-7xl">{s.heroTitle}</h1>
          <p className="mt-6 max-w-xl text-lg text-ivory/75">{s.heroSub}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-gold">Shop the collection</Link>
            <Link href="/enquiry" className="btn btn-light">Corporate & bulk enquiry</Link>
          </div>
          <p className="mt-10 font-display text-xl italic text-gold-light">{s.altTagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <p className="eyebrow text-center">Collections</p>
        <h2 className="font-display mt-2 text-center text-4xl font-semibold text-forest md:text-5xl">Curated with care</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cats.map((c) => {
            const p = first(c.slug);
            return (
              <Link key={c.slug} href={`/shop?category=${c.slug}`} className="group card overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden">
                  {c.image ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.image} alt={c.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    : p ? <Art p={p} big className="h-full w-full transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center bg-line text-6xl">{c.emoji}</div>}
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-display text-2xl font-semibold text-forest">{c.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{c.blurb}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-24">
          <div className="flex items-end justify-between">
            <div><p className="eyebrow">Signature</p><h2 className="font-display mt-2 text-4xl font-semibold text-forest md:text-5xl">Our most gifted</h2></div>
            <Link href="/shop" className="text-sm font-semibold uppercase tracking-widest text-gold hover:underline">View all →</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">{featured.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        </section>
      )}

      <section className="mt-24 bg-forest text-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="eyebrow">Corporate · Festive · Bulk</p>
            <h2 className="font-display mt-2 text-4xl font-semibold leading-tight md:text-5xl">Gifts your clients and teams will remember.</h2>
            <p className="mt-4 max-w-xl text-ivory/75">Custom packaging, your logo, handwritten-style cards and volume pricing. Choose from our collections or tell us exactly what you need, and we will send a quote.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/enquiry?type=Corporate%20gifting" className="btn btn-gold">Request a quote</Link>
              <Link href="/shop?category=corporate-gifting" className="btn btn-light">Corporate gifts</Link>
            </div>
          </div>
          <ol className="space-y-4">
            {[["01", "Choose", "Pick from our range or describe your own idea."], ["02", "Customise", "Packaging, branding, messages and quantities."], ["03", "Quote", "We send you a clear quote for approval."], ["04", "Deliver", "Packed with care and delivered on your date."]].map(([n, t, d]) => (
              <li key={n} className="flex gap-4 border-b border-white/10 pb-4"><span className="font-display text-3xl text-gold">{n}</span><div><p className="font-semibold">{t}</p><p className="text-sm text-ivory/65">{d}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      {tags.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-20 text-center">
          <p className="eyebrow">Shop by occasion</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {tags.map((t) => (<Link key={t} href={`/shop?tag=${t}`} className="chip capitalize">{t.replace(/-/g, " ")}</Link>))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-20 grid max-w-7xl gap-6 px-4 md:grid-cols-3">
        {[["Premium sourcing", "Single-estate teas, fresh-roasted coffee and carefully graded spices."], ["Presented beautifully", "Choose kraft, rigid magnetic or wooden keepsake boxes for every product."], ["Made personal", "Add cards, messages and logos. Ask us about anything not listed."]].map(([t, d]) => (
          <div key={t} className="border-t-2 border-gold pt-4"><h3 className="font-display text-2xl font-semibold text-forest">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div>
        ))}
      </section>
    </>
  );
}
