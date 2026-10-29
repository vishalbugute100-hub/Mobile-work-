import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPct } from "@/lib/content";
import { inr } from "@/lib/format";
import { Art } from "./Art";

export function ProductCard({ p }: { p: Product }) {
  const off = discountPct(p);
  return (
    <Link href={`/product/${p.slug}`} className="group block">
      <div className="card relative aspect-square overflow-hidden">
        <Art p={p} className="h-full w-full transition duration-700 group-hover:scale-105" />
        {off > 0 && <span className="absolute left-3 top-3 bg-forest px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-ivory">{off}% off</span>}
        {p.personaliseLabel && <span className="absolute right-3 top-3 bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-forest">Customisable</span>}
      </div>
      <div className="pt-3">
        {p.size && <p className="eyebrow !text-[10px]">{p.size}</p>}
        <h3 className="font-display text-xl font-semibold leading-snug text-forest group-hover:text-gold">{p.name}</h3>
        <p className="mt-1 flex items-baseline gap-2 text-sm">
          <span className="font-semibold">{inr(p.price)}</span>
          {p.mrp > p.price && <span className="text-muted line-through">{inr(p.mrp)}</span>}
        </p>
      </div>
    </Link>
  );
}
