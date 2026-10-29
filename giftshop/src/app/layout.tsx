import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${s.name} - Premium Tea, Coffee & Spice Gifting | Corporate & Bulk Gifts`, template: `%s | ${s.name}` },
    description: `${s.tagline}. Premium tea, coffee and spice gift boxes for corporate gifting, festivals and special occasions, with bulk orders and custom branding.`,
    openGraph: { type: "website", siteName: s.name, locale: "en_IN" },
    alternates: { canonical: "/" },
  };
}
export const viewport: Viewport = { themeColor: "#12332b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
