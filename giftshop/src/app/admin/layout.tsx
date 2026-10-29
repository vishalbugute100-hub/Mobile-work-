import type { Metadata } from "next";
import Link from "next/link";
import { adminPassword, isAdmin } from "@/lib/auth";
import { login, logout } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NAV: [string, string][] = [
  ["/admin", "Dashboard"], ["/admin/orders", "Orders"], ["/admin/enquiries", "Enquiries & quotes"], ["/admin/products", "Products"],
  ["/admin/categories", "Categories"], ["/admin/coupons", "Coupons"], ["/admin/guides", "Gift guides"], ["/admin/pages", "About & policies"], ["/admin/settings", "Site settings"], ["/admin/backup", "Backup & move"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!adminPassword())
    return <div className="mx-auto max-w-lg p-16 text-center">
        <p className="font-display text-3xl font-semibold text-forest">Admin is switched off</p>
        <p className="mt-3 text-muted">Choose an admin password to turn it on.</p>
        <p className="mt-4 text-left text-sm"><b>On your computer:</b> create a file named <code>.env.local</code> in the <code>giftshop</code> folder containing <code>ADMIN_PASSWORD=YourPassword</code>, then restart the site.</p>
        <p className="mt-2 text-left text-sm"><b>On a live host (Render, Vercel…):</b> add an environment variable named <code>ADMIN_PASSWORD</code> in the host&apos;s settings and redeploy.</p>
      </div>;
  if (!(await isAdmin()))
    return (
      <form action={login} className="card mx-auto my-24 max-w-sm space-y-4 p-8">
        <p className="eyebrow">Admin</p>
        <h1 className="font-display text-3xl font-semibold text-forest">Sign in</h1>
        <input name="password" type="password" className="input" placeholder="Password" autoFocus required />
        <button className="btn btn-primary w-full">Sign in</button>
      </form>
    );
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-forest p-4 text-ivory md:min-h-screen md:w-60 md:shrink-0">
        <p className="font-display px-2 text-2xl font-bold">Admin</p>
        <nav className="mt-4 flex flex-wrap gap-1 md:block md:space-y-1">
          {NAV.map(([h, l]) => (<Link key={h} href={h} className="block px-3 py-2 text-sm hover:bg-white/10">{l}</Link>))}
          <Link href="/" target="_blank" className="block px-3 py-2 text-sm text-gold-light hover:bg-white/10">View website ↗</Link>
        </nav>
        <form action={logout} className="mt-4 px-3"><button className="text-xs uppercase tracking-wider text-ivory/60 hover:text-white">Sign out</button></form>
      </aside>
      <div className="min-w-0 flex-1 p-5 md:p-10">{children}</div>
    </div>
  );
}
