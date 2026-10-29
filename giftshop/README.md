# HML Gifting – premium tea, coffee & spice gifting store (Next.js)

Storefront, bulk/corporate enquiry system, cart & checkout (Razorpay / COD), orders and a no-code admin panel.

## Run locally
```bash
npm install
npm run dev     # http://localhost:3000  ·  admin: /admin  (dev password: admin123)
```
With no env vars it runs in **demo mode** (simulated payments, temporary storage).

## Deploy (Vercel)
1. Import the repo, **Root Directory = `giftshop`**.
2. Add a Postgres database (Vercel Marketplace → Neon) so `DATABASE_URL` is set. Tables are created automatically and starter content is loaded on first visit.
3. Set the variables in `.env.example` (at least `ADMIN_PASSWORD`, `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`; add Razorpay keys to take payments).
4. Add your domain in Vercel.

## Running the site yourself: /admin
Products (photos, price, box options, tags, stock, hide/show) · Categories · Orders (status, courier, AWB) ·
Enquiries & quotes (status, quote, WhatsApp/email reply) · Coupons · Gift guides (SEO articles) ·
About & policies text · Site settings (brand, taglines, hero text/photo, announcement bar, contact, fees, Google Analytics / Ads / Meta Pixel IDs).
The dashboard shows a setup checklist.

## Marketing
SEO: server-rendered pages, canonicals, Product/Breadcrumb/Article JSON-LD, `/sitemap.xml`, `/robots.txt`.
Google Merchant Center / Meta catalog feed: `/feeds/google.xml` (products with photos only).
Conversion events (add_to_cart, begin_checkout, purchase, generate_lead) fire automatically once IDs are saved in Site settings.

## Not included yet
Live courier API (Shiprocket etc.; admin records AWB manually), GST invoices, customer accounts, multi-user admin roles.
