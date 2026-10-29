export const SITE = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "Giftora",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ).replace(/\/$/, ""),
  tagline: "Gifts that say it better",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
};

export const FREE_SHIPPING_ABOVE = 999;
export const SHIPPING_FEE = 79;
export const GIFT_WRAP_FEE = 99;
