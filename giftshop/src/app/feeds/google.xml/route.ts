import { getCategories, getProducts, getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
const x = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);
const abs = (u: string) => (u.startsWith("http") ? u : siteUrl() + u);

// Product feed for Google Merchant Center and Meta Catalog: submit https://YOUR-DOMAIN/feeds/google.xml.
// Only products with at least one image are included (both platforms require an image).
export async function GET() {
  const [products, cats, s] = await Promise.all([getProducts(), getCategories(), getSettings()]);
  const items = products.filter((p) => p.images.length).map((p) => `<item>
<g:id>${x(p.slug)}</g:id><g:title>${x(p.name)}</g:title><g:description>${x(p.description)}</g:description>
<g:link>${siteUrl()}/product/${p.slug}</g:link><g:image_link>${x(abs(p.images[0]))}</g:image_link>
<g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability><g:condition>new</g:condition>
<g:price>${Math.max(p.mrp, p.price)}.00 INR</g:price>${p.mrp > p.price ? `<g:sale_price>${p.price}.00 INR</g:sale_price>` : ""}
<g:brand>${x(s.name)}</g:brand><g:identifier_exists>no</g:identifier_exists>
<g:product_type>${x(cats.find((c) => c.slug === p.category)?.name ?? "")}</g:product_type>
</item>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>${x(s.name)}</title><link>${siteUrl()}</link><description>${x(s.tagline)}</description>\n${items}\n</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "s-maxage=3600" } });
}
