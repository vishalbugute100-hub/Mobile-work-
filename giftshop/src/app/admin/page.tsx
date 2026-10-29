import Link from "next/link";
import { listOrders } from "@/lib/store";
import { dbList, usingDb } from "@/lib/db";
import { readProducts, readSettings } from "@/lib/content";
import { inr } from "@/lib/format";
import type { Enquiry } from "@/lib/types";

export default async function Dashboard() {
  const [orders, enquiries, products, settings] = await Promise.all([listOrders(), dbList<Enquiry>("enquiry"), readProducts(), readSettings()]);
  const paid = orders.filter((o) => o.status !== "cancelled" && o.status !== "pending");
  const stat = (n: string | number, l: string, href: string) => (<Link href={href} className="card block p-5 hover:border-gold"><p className="font-display text-4xl font-semibold text-forest">{n}</p><p className="text-xs uppercase tracking-widest text-muted">{l}</p></Link>);
  const check = (ok: boolean, label: string, fix: string) => (<li className="flex gap-3 py-2"><span className={ok ? "text-forest" : "text-alert"}>{ok ? "✓" : "✕"}</span><span><b>{label}</b>{!ok && <span className="block text-muted">{fix}</span>}</span></li>);
  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-4xl font-semibold text-forest">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stat(enquiries.filter((e) => e.status === "new").length, "New enquiries", "/admin/enquiries?status=new")}
        {stat(orders.filter((o) => o.status === "confirmed").length, "Orders to pack", "/admin/orders?status=confirmed")}
        {stat(inr(paid.reduce((t, o) => t + o.totals.total, 0)), "Revenue", "/admin/orders")}
        {stat(products.length, "Products", "/admin/products")}
      </div>
      <div className="card mt-8 p-6">
        <h2 className="eyebrow !text-forest">Setup checklist</h2>
        <ul className="mt-2 divide-y divide-line text-sm">
          {check(usingDb(), "Database connected", "Add DATABASE_URL in Vercel (Neon/Postgres). Until then, edits are temporary and will be lost.")}
          {settings.orderMode === "shop" ? check(!!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET, "Online payments (Razorpay)", "Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET. Until then, checkout runs in demo mode.") : check(true, "Enquiry-only mode: no payment setup needed", "")}
          {check(!!process.env.RESEND_API_KEY && !!process.env.NOTIFY_EMAIL, "E-mail alerts for new orders & enquiries", "Optional: add RESEND_API_KEY and NOTIFY_EMAIL in Vercel.")}
          {check(!!process.env.ADMIN_PASSWORD, "Admin password set", "Set ADMIN_PASSWORD in Vercel to a strong password.")}
          {check(products.some((p) => p.images.length), "Product photos added", "Open Products and upload real photos (needed for Google/Meta feeds too).")}
        </ul>
      </div>
      <div className="card mt-6 p-6 text-sm text-muted">
        <h2 className="eyebrow !text-forest">Quick links</h2>
        <p className="mt-2">Add a product → <Link className="text-gold underline" href="/admin/products/new">New product</Link> · Change homepage text, contact details, fees, tracking IDs → <Link className="text-gold underline" href="/admin/settings">Site settings</Link> · Google/Meta product feed: <code>/feeds/google.xml</code></p>
      </div>
    </div>
  );
}
