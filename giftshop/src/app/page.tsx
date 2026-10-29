import Link from "next/link";
import { CATEGORIES, OCCASIONS, PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { GiftFinder } from "@/components/GiftFinder";

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blush via-cream to-[#fff0c9]">
        <span className="float absolute left-[6%] top-[12%] text-6xl opacity-80" aria-hidden>🎈</span>
        <span className="float-2 absolute right-[8%] top-[18%] text-7xl opacity-80" aria-hidden>🎁</span>
        <span className="float absolute bottom-[10%] right-[30%] text-5xl opacity-70" aria-hidden>✨</span>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-3 inline-block rounded-full bg-white px-4 py-1 text-sm font-semibold text-berry shadow-sm">Personalised · Curated · Delivered</p>
            <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-7xl">
              Gifts that say it <span className="text-berry italic">better.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted">
              From engraved keepsakes to festive hampers, find the perfect gift for every person and every occasion, and have it delivered with a handwritten note.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">Shop all gifts</Link>
              <Link href="/shop?occasion=diwali" className="btn btn-ghost">🪔 Diwali edit</Link>
            </div>
          </div>
          <GiftFinder />
        </div>
      </section>

      <div className="overflow-hidden border-y border-black/5 bg-ink py-3 text-cream">
        <div className="marquee flex w-max gap-10 whitespace-nowrap text-sm font-medium">
          {[...OCCASIONS, ...OCCASIONS, ...OCCASIONS, ...OCCASIONS].map((o, i) => (<span key={i}>{o.emoji} {o.name} gifts</span>))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-16">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Shop by occasion</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {OCCASIONS.map((o) => (
            <Link key={o.slug} href={`/shop?occasion=${o.slug}`} className="card flex flex-col items-center gap-2 p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-5xl">{o.emoji}</span>
              <span className="font-semibold">{o.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Bestselling gifts</h2>
          <Link href="/shop" className="font-semibold text-berry hover:underline">View all →</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p) => (<ProductCard key={p.slug} p={p} />))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Shop by category</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (<Link key={c.slug} href={`/shop?category=${c.slug}`} className="chip !px-5 !py-3 !text-base">{c.emoji} {c.name}</Link>))}
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-7xl gap-4 px-4 md:grid-cols-3">
        {[
          ["✍️", "Made personal", "Names, initials and messages engraved or printed on selected gifts."],
          ["🔒", "Secure payments", "Pay by UPI, card or netbanking, or choose Cash on Delivery."],
          ["📦", "Delivered with care", "Gift-wrapped, tracked, and sent with your handwritten message."],
        ].map(([e, t, d]) => (
          <div key={t} className="card p-6"><div className="text-4xl">{e}</div><h3 className="mt-3 text-lg font-bold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div>
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="rounded-3xl bg-berry p-8 text-white md:flex md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="font-display text-3xl font-bold">Gifting for a team or a wedding?</h2>
            <p className="mt-2 max-w-xl text-white/80">Bulk orders get custom branding, volume pricing and one point of contact. Message us for a quote.</p>
          </div>
          <Link href="/shop?occasion=corporate" className="btn mt-5 bg-white text-berry hover:bg-gold md:mt-0">Explore corporate gifts</Link>
        </div>
      </section>
    </>
  );
}
