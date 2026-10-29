import type { Product } from "@/lib/products";

// Placeholder artwork. If a product has an `image`, it is used instead.
export function Art({ p, className = "", big = false }: { p: Pick<Product, "emoji" | "hue" | "name" | "image">; className?: string; big?: boolean }) {
  if (p.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.image} alt={p.name} className={`object-cover w-full h-full ${className}`} loading="lazy" />;
  }
  return (
    <div
      role="img"
      aria-label={p.name}
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, hsl(${p.hue} 85% 92%), hsl(${(p.hue + 40) % 360} 80% 82%))` }}
    >
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-40" style={{ background: `hsl(${p.hue} 90% 75%)` }} />
      <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full opacity-30" style={{ background: `hsl(${(p.hue + 60) % 360} 90% 70%)` }} />
      <span className={`relative drop-shadow-md ${big ? "text-[8rem]" : "text-6xl"}`}>{p.emoji}</span>
    </div>
  );
}
