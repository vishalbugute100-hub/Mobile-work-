import type { MetadataRoute } from "next";
import { getCategories, getPosts, getProducts } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, products, posts] = await Promise.all([getCategories(), getProducts(), getPosts()]);
  const u = (p: string) => `${siteUrl()}${p}`;
  return [
    { url: u("/"), priority: 1 }, { url: u("/shop"), priority: 0.9 }, { url: u("/enquiry"), priority: 0.8 }, { url: u("/build-a-kit"), priority: 0.8 },
    ...cats.map((c) => ({ url: u(`/shop?category=${c.slug}`), priority: 0.8 })),
    ...products.map((p) => ({ url: u(`/product/${p.slug}`), priority: 0.7 })),
    { url: u("/blog"), priority: 0.6 }, ...posts.map((p) => ({ url: u(`/blog/${p.slug}`), lastModified: p.date, priority: 0.5 })),
    { url: u("/about"), priority: 0.4 }, { url: u("/policies"), priority: 0.2 },
  ];
}
