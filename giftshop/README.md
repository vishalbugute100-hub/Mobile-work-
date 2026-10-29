# Giftora – gifting e-commerce store (Next.js)

Storefront, cart, checkout (Razorpay / COD), orders, admin, SEO and ad-feed plumbing in one app.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000   (admin: /admin, dev password: admin123)
```
With no env vars it runs in **demo mode**: payments are simulated, orders go to a temp file.

## Go live (Vercel)
1. Import the GitHub repo in Vercel, set **Root Directory = `giftshop`**.
2. Add a Postgres DB (Vercel Marketplace → Neon, or Supabase) and set `DATABASE_URL`. The `orders` table is created automatically.
3. Set the env vars from `.env.example`: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_STORE_NAME`.
4. Add your domain in Vercel.

## Your content
- Products, categories, occasions: `src/lib/products.ts` (add an `image` URL per product).
- Gift guides (SEO): `src/lib/blog.ts`. Coupons: `src/lib/pricing.ts`. Shipping/wrap fees: `src/lib/site.ts`.
- Policies text in `src/app/policies/page.tsx` is a template; have it reviewed.

## Marketing (SEO + SEM)
- SEO: server-rendered pages, per-page metadata/canonicals, Product/Breadcrumb/Article JSON-LD, `/sitemap.xml`, `/robots.txt`.
- Google Merchant Center / Meta Catalog feed: `/feeds/google.xml` (needs real product images).
- Tracking: set `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`; add_to_cart / begin_checkout / purchase events fire automatically.

## Not yet included
Courier API (Shiprocket/Delhivery) for live rates and label creation (admin records AWB manually), email/WhatsApp notifications, customer accounts, product admin UI (catalog is a code file), GST invoices.
