"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminCookie, passwordMatches, requireAdmin, setAdminCookie } from "@/lib/auth";
import { dbDel, dbGet, dbPut } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { readCategories, readCoupons, readPosts, readProducts } from "@/lib/content";
import { updateOrder as patchOrder, type OrderStatus } from "@/lib/store";
import type { Category, Coupon, Enquiry, EnquiryStatus, PageDoc, Post, Product, Settings } from "@/lib/types";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string, d = 0) => { const n = Number(str(fd, k).replace(/,/g, "")); return Number.isFinite(n) ? n : d; };
const lines = (fd: FormData, k: string) => str(fd, k).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

function refresh(path?: string) {
  revalidateTag("content");
  revalidatePath("/", "layout");
  if (path) revalidatePath(path);
}

export async function login(fd: FormData) {
  if (passwordMatches(str(fd, "password"))) { await setAdminCookie(); redirect("/admin"); }
  redirect("/admin?error=1");
}
export async function logout() { await clearAdminCookie(); redirect("/admin"); }

// ---- products ----
export async function saveProduct(fd: FormData) {
  await requireAdmin();
  const existing = await readProducts(); // also makes sure starter content is seeded first
  const isNew = str(fd, "isNew") === "1";
  const name = str(fd, "name");
  const slug = isNew ? slugify(str(fd, "slug") || name) : str(fd, "id");
  if (!name || !slug) redirect("/admin/products?error=Name%20is%20required");
  if (isNew && existing.some((p) => p.id === slug)) redirect(`/admin/products?error=${encodeURIComponent("A product with that URL name already exists")}`);
  const old = existing.find((p) => p.id === slug);
  const p: Product = {
    id: slug, slug, name,
    category: str(fd, "category"),
    price: Math.max(0, Math.round(num(fd, "price"))), mrp: Math.max(0, Math.round(num(fd, "mrp") || num(fd, "price"))),
    short: str(fd, "short"), description: str(fd, "description"), highlights: lines(fd, "highlights"),
    images: lines(fd, "images"), emoji: str(fd, "emoji") || old?.emoji || "🎁", hue: old?.hue ?? 40,
    packaging: lines(fd, "packaging").map((l) => { const [n, e] = l.split("|"); return { name: n.trim(), extra: Math.max(0, Math.round(Number((e || "0").replace(/[^\d.]/g, "")) || 0)) }; }).filter((x) => x.name),
    tags: str(fd, "tags").split(",").map(slugify).filter(Boolean),
    size: str(fd, "size") || undefined, stock: Math.max(0, Math.round(num(fd, "stock", 0))),
    featured: fd.get("featured") === "on", visible: fd.get("visible") === "on",
    personaliseLabel: str(fd, "personaliseLabel") || undefined, personaliseMax: Math.round(num(fd, "personaliseMax", 100)) || 100,
    bulkMin: Math.round(num(fd, "bulkMin")) || undefined,
  };
  await dbPut("product", slug, p);
  refresh();
  redirect("/admin/products?saved=" + encodeURIComponent(name));
}
export async function deleteProduct(fd: FormData) { await requireAdmin(); await dbDel("product", str(fd, "id")); refresh(); redirect("/admin/products?saved=Deleted"); }

// ---- categories ----
export async function saveCategory(fd: FormData) {
  await requireAdmin(); await readCategories();
  const name = str(fd, "name"); const slug = str(fd, "id") || slugify(name);
  if (!name || !slug) return;
  const c: Category = { id: slug, slug, name, emoji: str(fd, "emoji") || "🎁", blurb: str(fd, "blurb"), image: str(fd, "image") || undefined, sort: num(fd, "sort", 99) };
  await dbPut("category", slug, c); refresh(); redirect("/admin/categories?saved=" + encodeURIComponent(name));
}
export async function deleteCategory(fd: FormData) { await requireAdmin(); await dbDel("category", str(fd, "id")); refresh(); redirect("/admin/categories?saved=Deleted"); }

// ---- coupons ----
export async function saveCoupon(fd: FormData) {
  await requireAdmin(); await readCoupons();
  const code = str(fd, "code").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!code) return;
  const type = str(fd, "type");
  const c: Coupon = { id: code, code, label: str(fd, "label") || code, active: fd.get("active") === "on",
    pct: type === "pct" ? Math.min(100, num(fd, "value")) : undefined, flat: type === "flat" ? num(fd, "value") : undefined,
    min: num(fd, "min") || undefined, cap: type === "pct" ? num(fd, "cap") || undefined : undefined };
  await dbPut("coupon", code, c); refresh(); redirect("/admin/coupons?saved=" + code);
}
export async function deleteCoupon(fd: FormData) { await requireAdmin(); await dbDel("coupon", str(fd, "id")); refresh(); redirect("/admin/coupons?saved=Deleted"); }

// ---- guides (blog) ----
export async function savePost(fd: FormData) {
  await requireAdmin(); await readPosts();
  const title = str(fd, "title"); const slug = str(fd, "id") || slugify(str(fd, "slug") || title);
  if (!title || !slug) return;
  const p: Post = { id: slug, slug, title, description: str(fd, "description"), date: str(fd, "date") || new Date().toISOString().slice(0, 10), body: str(fd, "body"),
    published: fd.get("published") === "on", ctaHref: str(fd, "ctaHref") || undefined, ctaLabel: str(fd, "ctaLabel") || undefined };
  await dbPut("post", slug, p); refresh(); redirect("/admin/guides?saved=" + encodeURIComponent(title));
}
export async function deletePost(fd: FormData) { await requireAdmin(); await dbDel("post", str(fd, "id")); refresh(); redirect("/admin/guides?saved=Deleted"); }

// ---- pages ----
export async function savePage(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  if (!["about", "policies"].includes(id)) return;
  const p: PageDoc = { id, title: str(fd, "title"), body: str(fd, "body") };
  await dbPut("page", id, p); refresh(); redirect("/admin/pages?saved=" + id);
}

// ---- settings ----
export async function saveSettings(fd: FormData) {
  await requireAdmin();
  const s: Settings = {
    name: str(fd, "name") || "HML Gifting", tagline: str(fd, "tagline"), altTagline: str(fd, "altTagline"),
    heroTitle: str(fd, "heroTitle"), heroSub: str(fd, "heroSub"), heroImage: str(fd, "heroImage"), announcement: str(fd, "announcement"),
    phone: str(fd, "phone"), email: str(fd, "email"), whatsapp: str(fd, "whatsapp"), address: str(fd, "address"),
    parentLine: str(fd, "parentLine"), legalInfo: str(fd, "legalInfo"),
    freeShipAbove: num(fd, "freeShipAbove"), shippingFee: num(fd, "shippingFee"), giftWrapFee: num(fd, "giftWrapFee"), bulkMin: Math.max(1, num(fd, "bulkMin", 25)),
    orderMode: str(fd, "orderMode") === "shop" ? "shop" : "enquiry", showPrices: fd.get("showPrices") === "on", kitBoxes: str(fd, "kitBoxes"),
    gaId: str(fd, "gaId"), pixelId: str(fd, "pixelId"), adsId: str(fd, "adsId"),
  };
  await dbPut("settings", "main", s); refresh(); redirect("/admin/settings?saved=1");
}

// ---- orders & enquiries ----
export async function saveOrder(fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status") as OrderStatus; const carrier = str(fd, "carrier"), awb = str(fd, "awb");
  if (!["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"].includes(status)) return;
  await patchOrder(str(fd, "id"), (o) => ({ ...o, status, tracking: carrier && awb ? { carrier, awb } : o.tracking,
    payment: status === "delivered" && o.payment.status === "cod" ? { ...o.payment, status: "paid" } : o.payment }));
  revalidatePath("/admin/orders");
}
export async function saveEnquiry(fd: FormData) {
  await requireAdmin();
  const e = await dbGet<Enquiry>("enquiry", str(fd, "id"));
  const status = str(fd, "status") as EnquiryStatus;
  if (!e || !["new", "quoted", "won", "lost"].includes(status)) return;
  await dbPut("enquiry", e.id, { ...e, status, quoteAmount: str(fd, "quoteAmount"), quoteNote: str(fd, "quoteNote"), adminNote: str(fd, "adminNote") });
  revalidatePath("/admin/enquiries");
}
