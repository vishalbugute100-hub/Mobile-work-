// Cached readers for storefront content + admin readers. Edits in /admin call revalidateTag("content").
import { unstable_cache } from "next/cache";
import { dbGet, dbList, dbPut } from "./db";
import { DEFAULT_CATEGORIES, DEFAULT_COUPONS, DEFAULT_PAGES, DEFAULT_POSTS, DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from "./defaults";
import type { Category, Coupon, PageDoc, Post, Product, Settings } from "./types";

async function seeded<T extends { id: string }>(kind: string, defaults: T[]): Promise<T[]> {
  if (!(await dbGet("meta", "seeded:" + kind))) {
    for (const d of defaults) await dbPut(kind, d.id, d, true);
    await dbPut("meta", "seeded:" + kind, { at: new Date().toISOString() }, true);
  }
  return dbList<T>(kind);
}

export const readSettings = async (): Promise<Settings> => ({ ...DEFAULT_SETTINGS, ...((await dbGet<Partial<Settings>>("settings", "main")) ?? {}) });
export const readProducts = async () => (await seeded<Product>("product", DEFAULT_PRODUCTS)).sort((a, b) => a.name.localeCompare(b.name));
export const readCategories = async () => (await seeded<Category>("category", DEFAULT_CATEGORIES)).sort((a, b) => a.sort - b.sort);
export const readPosts = async () => (await seeded<Post>("post", DEFAULT_POSTS)).sort((a, b) => b.date.localeCompare(a.date));
export const readCoupons = async () => seeded<Coupon>("coupon", DEFAULT_COUPONS);
export const readPage = async (id: string): Promise<PageDoc | undefined> =>
  (await dbGet<PageDoc>("page", id)) ?? DEFAULT_PAGES.find((p) => p.id === id);

const opts = { tags: ["content"], revalidate: 300 };
export const getSettings = unstable_cache(readSettings, ["settings"], opts);
export const getCategories = unstable_cache(readCategories, ["categories"], opts);
export const getPage = unstable_cache(readPage, ["page"], opts);
const allProducts = unstable_cache(async () => (await readProducts()).filter((p) => p.visible), ["products"], opts);
const allPosts = unstable_cache(async () => (await readPosts()).filter((p) => p.published), ["posts"], opts);
export const getProducts = allProducts;
export const getPosts = allPosts;
export const getProduct = async (slug: string) => (await allProducts()).find((p) => p.slug === slug);

export const discountPct = (p: Pick<Product, "price" | "mrp">) => (p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0);

export type Filters = { q?: string; category?: string; tag?: string; max?: number; sort?: string };
export function filterProducts(all: Product[], f: Filters): Product[] {
  const q = f.q?.trim().toLowerCase();
  let list = all.filter(
    (p) =>
      (!f.category || p.category === f.category) &&
      (!f.tag || p.tags.includes(f.tag)) &&
      (!f.max || p.price <= f.max) &&
      (!q || `${p.name} ${p.short} ${p.category} ${p.tags.join(" ")}`.toLowerCase().includes(q)),
  );
  if (f.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  else if (f.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  else list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  return list;
}
