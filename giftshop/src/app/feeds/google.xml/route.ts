import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { SITE } from "@/lib/site";

const x = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

// Product feed for Google Merchant Center (Shopping ads / free listings) and Meta Catalog.
// Submit https://YOUR-DOMAIN/feeds/google.xml as a scheduled fetch.
export async function GET() {
  const items = PRODUCTS.map((p) => {
    const img = p.image ?? `${SITE.url}/feeds/placeholder.png`;
    return `<item>
<g:id>${x(p.slug)}</g:id><g:title>${x(p.name)}</g:title><g:description>${x(p.description)}</g:description>
<g:link>${SITE.url}/product/${p.slug}</g:link><g:image_link>${x(img)}</g:image_link>
<g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability><g:condition>new</g:condition>
<g:price>${p.mrp}.00 INR</g:price><g:sale_price>${p.price}.00 INR</g:sale_price>
<g:brand>${x(SITE.name)}</g:brand><g:identifier_exists>no</g:identifier_exists>
<g:product_type>${x(CATEGORIES.find((c) => c.slug === p.category)?.name ?? "")}</g:product_type>
</item>`;
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>${x(SITE.name)}</title><link>${SITE.url}</link><description>${x(SITE.tagline)}</description>\n${items}\n</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "s-maxage=3600" } });
}
