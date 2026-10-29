import Link from "next/link";
import { listOrders } from "@/lib/store";
import { inr } from "@/lib/format";
import { Tabs } from "@/components/AdminUI";
import { saveOrder } from "../actions";

const STATUSES = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

export default async function Orders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const all = await listOrders();
  const orders = status ? all.filter((o) => o.status === status) : all;
  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-4xl font-semibold text-forest">Orders</h1>
      <div className="mt-5"><Tabs base="/admin/orders" current={status} items={[["", "All"], ...STATUSES.map((s): [string, string] => [s, s])]} /></div>
      <div className="space-y-4">
        {orders.length === 0 && <p className="card p-8 text-center text-muted">No orders here yet.</p>}
        {orders.map((o) => (
          <div key={o.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Link href={`/order/${o.id}`} target="_blank" className="font-semibold text-gold hover:underline">{o.id}</Link>
                <span className="ml-2 text-xs text-muted">{new Date(o.createdAt).toLocaleString("en-IN")}</span>
                <p className="text-sm">{o.customer.name} · {o.customer.phone} · {o.customer.email}</p>
                <p className="text-sm text-muted">{o.customer.address}, {o.customer.city}, {o.customer.state} {o.customer.pincode}</p>
              </div>
              <div className="text-right"><p className="text-lg font-bold">{inr(o.totals.total)}</p><p className="text-xs uppercase text-muted">{o.payment.method} · {o.payment.status}</p></div>
            </div>
            <ul className="mt-3 text-sm">{o.lines.map((l, i) => (<li key={i}>{l.qty} × {l.name}{l.packaging && <span className="text-muted"> ({l.packaging})</span>}{l.text && <b className="text-gold"> — “{l.text}”</b>}</li>))}</ul>
            {(o.giftWrap || o.deliveryDate) && <p className="mt-1 text-sm">{o.giftWrap && <>Gift wrap{o.giftMessage && <>: “{o.giftMessage}”</>}. </>}{o.deliveryDate && <>Deliver by {o.deliveryDate}</>}</p>}
            <form action={saveOrder} className="mt-3 flex flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className="input !w-auto !py-1.5">{STATUSES.map((s) => (<option key={s}>{s}</option>))}</select>
              <input name="carrier" defaultValue={o.tracking?.carrier} placeholder="Courier" className="input !w-36 !py-1.5" />
              <input name="awb" defaultValue={o.tracking?.awb} placeholder="AWB / tracking no." className="input !w-44 !py-1.5" />
              <button className="btn btn-primary !py-2">Save</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
