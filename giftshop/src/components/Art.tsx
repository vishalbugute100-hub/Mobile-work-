import type { Product } from "@/lib/types";

// Shows the first product photo; falls back to tasteful placeholder artwork until photos are uploaded.
export function Art({ p, className = "", big = false }: { p: { emoji: string; hue: number; name: string; images?: string[]; image?: string }; className?: string; big?: boolean }) {
  const src = p.image ?? p.images?.[0];
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={p.name} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  return (
    <div role="img" aria-label={p.name} className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(145deg, hsl(${p.hue} 35% 93%), hsl(${p.hue} 40% 80%))` }}>
      <div className="absolute inset-3 border border-white/60" />
      <span className={`relative ${big ? "text-[7rem]" : "text-5xl"} drop-shadow-sm`}>{p.emoji}</span>
    </div>
  );
}
export type { Product };
