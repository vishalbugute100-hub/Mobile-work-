"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { OCCASIONS } from "@/lib/products";

export function Header({ name }: { name: string }) {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="bg-ink px-4 py-1.5 text-center text-xs text-cream">
        Free shipping above ₹999 · Use code <b className="text-gold">WELCOME10</b> for 10% off your first order
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button className="md:hidden text-2xl" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
        <Link href="/" className="font-display text-2xl font-bold text-berry">🎁 {name}</Link>
        <nav className="ml-6 hidden gap-5 text-sm font-medium md:flex">
          <Link href="/shop" className="hover:text-berry">All Gifts</Link>
          {OCCASIONS.slice(0, 5).map((o) => (
            <Link key={o.slug} href={`/shop?occasion=${o.slug}`} className="hover:text-berry">{o.name}</Link>
          ))}
          <Link href="/blog" className="hover:text-berry">Gift Guides</Link>
        </nav>
        <form action="/shop" className="ml-auto hidden flex-1 max-w-xs md:block">
          <input name="q" className="input !py-2" placeholder="Search gifts…" aria-label="Search" />
        </form>
        <Link href="/cart" className="ml-auto md:ml-0 btn btn-ghost !px-4 !py-2 text-sm" aria-label="Cart">
          🛒 Cart{ready && count > 0 && <span className="rounded-full bg-berry px-2 text-xs text-white">{count}</span>}
        </Link>
      </div>
      {open && (
        <div className="border-t border-black/5 bg-white px-4 py-3 md:hidden">
          <form action="/shop" className="mb-3"><input name="q" className="input" placeholder="Search gifts…" /></form>
          <div className="flex flex-wrap gap-2">
            <Link className="chip" href="/shop" onClick={() => setOpen(false)}>All Gifts</Link>
            {OCCASIONS.map((o) => (
              <Link key={o.slug} className="chip" href={`/shop?occasion=${o.slug}`} onClick={() => setOpen(false)}>{o.emoji} {o.name}</Link>
            ))}
            <Link className="chip" href="/blog" onClick={() => setOpen(false)}>Gift Guides</Link>
          </div>
        </div>
      )}
    </header>
  );
}
