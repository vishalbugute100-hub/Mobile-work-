import type { MetadataRoute } from "next";
import { CATEGORIES, OCCASIONS, PRODUCTS } from "@/lib/products";
import { POSTS } from "@/lib/blog";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`;
  return [
    { url: u("/"), priority: 1 },
    { url: u("/shop"), priority: 0.9 },
    ...CATEGORIES.map((c) => ({ url: u(`/shop?category=${c.slug}`), priority: 0.8 })),
    ...OCCASIONS.map((o) => ({ url: u(`/shop?occasion=${o.slug}`), priority: 0.8 })),
    ...PRODUCTS.map((p) => ({ url: u(`/product/${p.slug}`), priority: 0.7 })),
    { url: u("/blog"), priority: 0.6 },
    ...POSTS.map((p) => ({ url: u(`/blog/${p.slug}`), lastModified: p.date, priority: 0.5 })),
    { url: u("/policies"), priority: 0.2 },
  ];
}
