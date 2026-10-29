import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { getCategories, getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [s, cats] = await Promise.all([getSettings(), getCategories()]);
  const org = {
    "@context": "https://schema.org", "@type": "Store", name: s.name, url: siteUrl(), slogan: s.tagline,
    telephone: s.phone || undefined, parentOrganization: s.parentLine ? { "@type": "Organization", name: s.parentLine.replace(/^an? /i, "").replace(/ enterprise.*$/i, "") } : undefined, email: s.email || undefined,
    potentialAction: { "@type": "SearchAction", target: `${siteUrl()}/shop?q={q}`, "query-input": "required name=q" },
  };
  return (
    <>
      <CartProvider cfg={{ freeShipAbove: s.freeShipAbove, shippingFee: s.shippingFee, giftWrapFee: s.giftWrapFee }}>
        <Header name={s.name} categories={cats.map((c) => ({ slug: c.slug, name: c.name }))} announcement={s.announcement} showCart={s.orderMode === "shop"} />
        <main>{children}</main>
        <Footer s={s} categories={cats} />
      </CartProvider>
      <Analytics s={s} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
    </>
  );
}
