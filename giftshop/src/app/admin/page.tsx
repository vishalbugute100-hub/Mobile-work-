import type { Metadata } from "next";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import Link from "next/link";
import { listOrders, updateOrder, storageMode, type OrderStatus } from "@/lib/store";
import { inr } from "@/lib/format";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const password = () => process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "admin123");
const token = () => createHash("sha256").update("gs-admin:" + password()).digest("hex");
const STATUSES: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

async function login(fd: FormData) {
  "use server";
  if (password() && fd.get("password") === password()) {
    (await cookies()).set("gs_admin", token(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 12, path: "/admin" });
  }
  redirect("/admin");
}
async function logout() {
  "use server";
  (await cookies()).delete({ name: "gs_admin", path: "/admin" });
  redirect("/admin");
}
async function update(fd: FormData) {
  "use server";
  if (!password() || (await cookies()).get("gs_admin")?.value !== token()) return;
  const id = String(fd.get("id")), status = String(fd.get("status")) as OrderStatus;
  const carrier = String(fd.get("carrier") || "").trim(), awb = String(fd.get("awb") || "").trim();
  if (!STATUSES.includes(status)) return;
  await updateOrder(id, (o) => ({ ...o, status, tracking: carrier && awb ? { carrier, awb } : o.tracking, payment: status === "delivered" && o.payment.status === "cod" ? { ...o.payment, status: "paid" } : o.payment }));
  revalidatePath("/admin");
}

export default async function Admin() {
  if (!password()) return <div className="mx-auto max-w-md p-12 text-center">Admin is disabled. Set the <code>ADMIN_PASSWORD</code> environment variable.</div>;
  if ((await cookies()).get("gs_admin")?.value !== token())
    return (
      <form action={login} className="card mx-auto my-20 max-w-sm space-y-3 p-6">
        <h1 className="text-xl font-bold">Admin login</h1>
        <input name="password" type="password" className="input" placeholder="Password" autoFocus />
        <button className="btn btn-primary w-full">Sign in</button>
      </form>
    );

  const orders = await listOrders();
  const live = orders.filter((o) => o.status !== "cancelled" && o.status !== "pending");
  const revenue = live.reduce((t, o) => t + o.totals.total, 0);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Orders</h1>
        <form action={logout}><button className="btn btn-ghost !py-1.5 text-sm">Sign out</button></form>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="card p-4"><p className="text-2xl font-bold">{orders.length}</p><p className="text-xs text-muted">Total orders</p></div>
        <div className="card p-4"><p className="text-2xl font-bold">{orders.filter((o) => o.status === "confirmed").length}</p><p className="text-xs text-muted">To pack</p></div>
        <div className="card p-4"><p className="text-2xl font-bold">{inr(revenue)}</p><p className="text-xs text-muted">Revenue</p></div>
      </div>
      <p className="mt-2 text-xs text-muted">Storage: {storageMode()}{storageMode().startsWith("temp") && " - set DATABASE_URL to persist orders."}</p>
      <div className="mt-6 space-y-4">
        {orders.length === 0 && <p className="card p-8 text-center text-muted">No orders yet.</p>}
        {orders.map((o) => (
          <div key={o.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Link href={`/order/${o.id}`} className="font-bold text-berry hover:underline">{o.id}</Link>
                <span className="ml-2 text-xs text-muted">{new Date(o.createdAt).toLocaleString("en-IN")}</span>
                <p className="text-sm">{o.customer.name} · {o.customer.phone} · {o.customer.email}</p>
                <p className="text-sm text-muted">{o.customer.address}, {o.customer.city}, {o.customer.state} {o.customer.pincode}</p>
              </div>
              <div className="text-right"><p className="text-lg font-bold">{inr(o.totals.total)}</p><p className="text-xs uppercase text-muted">{o.payment.method} · {o.payment.status}</p></div>
            </div>
            <ul className="mt-3 text-sm">{o.lines.map((l, i) => (<li key={i}>{l.qty} × {l.name}{l.text && <b className="text-berry"> — engrave: “{l.text}”</b>}</li>))}</ul>
            {(o.giftWrap || o.deliveryDate) && <p className="mt-1 text-sm">{o.giftWrap && <>🎀 Gift wrap{o.giftMessage && <>: “{o.giftMessage}”</>} </>}{o.deliveryDate && <>📅 {o.deliveryDate}</>}</p>}
            <form action={update} className="mt-3 flex flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className="input !w-auto !py-1.5">{STATUSES.map((s) => (<option key={s}>{s}</option>))}</select>
              <input name="carrier" defaultValue={o.tracking?.carrier} placeholder="Courier" className="input !w-36 !py-1.5" />
              <input name="awb" defaultValue={o.tracking?.awb} placeholder="AWB / tracking no." className="input !w-44 !py-1.5" />
              <button className="btn btn-primary !py-1.5 text-sm">Save</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
