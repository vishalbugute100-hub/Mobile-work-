import Link from "next/link";
import { discountPct, type Product } from "@/lib/products";
import { inr } from "@/lib/format";
import { Art } from "./Art";

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.slug}`} className="card group block overflow-hidden transition hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <Art p={p} className="h-full w-full transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-berry px-2.5 py-1 text-xs font-bold text-white">{discountPct(p)}% off</span>
        {p.personalise && <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold">✍️ Personalise</span>}
      </div>
      <div className="p-4">
        <h3 className="font-semibold leading-snug">{p.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{p.short}</p>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold">{inr(p.price)}</span>
          <span className="text-sm text-muted line-through">{inr(p.mrp)}</span>
        </p>
      </div>
    </Link>
  );
}
