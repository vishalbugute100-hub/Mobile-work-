import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} - Personalised Gifts & Hampers Online`, template: `%s | ${SITE.name}` },
  description: "Buy personalised gifts, hampers, sweets, flowers and decor online for birthdays, anniversaries, Diwali, Rakhi and weddings. Secure payments and doorstep delivery.",
  openGraph: { type: "website", siteName: SITE.name, locale: "en_IN" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#b4234f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE.name,
    url: SITE.url,
    potentialAction: { "@type": "SearchAction", target: `${SITE.url}/shop?q={q}`, "query-input": "required name=q" },
  };
  return (
    <html lang="en-IN">
      <body>
        <CartProvider>
          <Header name={SITE.name} />
          <main>{children}</main>
          <Footer />
        </CartProvider>
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      </body>
    </html>
  );
}
