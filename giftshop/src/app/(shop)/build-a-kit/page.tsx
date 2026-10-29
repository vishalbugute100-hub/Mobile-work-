import type { Metadata } from "next";
import { getCategories, getProducts, getSettings } from "@/lib/content";
import { KitBuilder } from "@/components/KitBuilder";

export const metadata: Metadata = {
  title: "Build Your Own Gift Kit",
  description: "Design a custom gift kit: choose the box, pick premium teas, coffees and spices, add your branding and message, and request a quote.",
  alternates: { canonical: "/build-a-kit" },
};
export const revalidate = 300;

export default async function BuildKit() {
  const [products, cats, s] = await Promise.all([getProducts(), getCategories(), getSettings()]);
  const boxes = s.kitBoxes.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => { const [name, note] = l.split("|"); return { name: name.trim(), note: (note || "").trim() }; });
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <p className="eyebrow">Corporate · Festive · Personal</p>
      <h1 className="font-display mt-1 max-w-3xl text-5xl font-semibold leading-tight text-forest">Build your own gift kit</h1>
      <p className="mt-3 max-w-2xl text-muted">Choose a box, pick what goes inside, add your own touch. We will review your design and send you a quote.</p>
      <div className="mt-10">
        <KitBuilder products={products.map((p) => ({ slug: p.slug, name: p.name, price: p.price, category: p.category, emoji: p.emoji, hue: p.hue, image: p.images[0], size: p.size }))} cats={cats.map((c) => ({ slug: c.slug, name: c.name }))} boxes={boxes} showPrices={s.showPrices} />
      </div>
    </div>
  );
}
