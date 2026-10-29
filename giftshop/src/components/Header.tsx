"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export function Header({ name, categories, announcement, showCart }: { name: string; categories: { slug: string; name: string }[]; announcement: string; showCart: boolean }) {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const links = [
    ...categories.map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name })),
    { href: "/build-a-kit", label: "Build Your Kit" },
    { href: "/enquiry", label: "Bulk Enquiry" },
    { href: "/blog", label: "Gift Guides" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur">
      {announcement && (
        <Link href="/enquiry" className="block bg-forest px-4 py-2 text-center text-[11px] uppercase tracking-[0.16em] text-gold-light hover:text-white">{announcement}</Link>
      )}
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-4">
        <button className="text-xl lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
        <Link href="/" className="font-display text-2xl font-bold tracking-wide text-forest md:text-3xl">{name}</Link>
        <nav className="ml-8 hidden gap-6 text-[13px] font-medium uppercase tracking-[0.12em] lg:flex">
          {links.map((l) => (<Link key={l.href} href={l.href} className="text-forest hover:text-gold">{l.label}</Link>))}
        </nav>
        <form action="/shop" className="ml-auto hidden max-w-[200px] flex-1 xl:block"><input name="q" className="input !py-1.5 text-sm" placeholder="Search" aria-label="Search" /></form>
        {showCart ? (
          <Link href="/cart" className="ml-auto text-[13px] font-semibold uppercase tracking-[0.12em] text-forest xl:ml-0" aria-label="Cart">
            Cart{ready && count > 0 && <span className="ml-1.5 bg-gold px-1.5 py-0.5 text-[11px] text-white">{count}</span>}
          </Link>
        ) : (
          <Link href="/enquiry" className="btn btn-primary ml-auto !px-4 !py-2 xl:ml-0">Get a quote</Link>
        )}
      </div>
      {open && (
        <div className="border-t border-line bg-white px-4 py-4 lg:hidden">
          <form action="/shop" className="mb-3"><input name="q" className="input" placeholder="Search" /></form>
          <div className="flex flex-wrap gap-2">
            <Link className="chip" href="/shop" onClick={() => setOpen(false)}>All products</Link>
            {links.map((l) => (<Link key={l.href} className="chip" href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>))}
          </div>
        </div>
      )}
    </header>
  );
}
