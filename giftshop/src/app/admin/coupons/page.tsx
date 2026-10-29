import { readCoupons } from "@/lib/content";
import { F, Flash } from "@/components/AdminUI";
import { deleteCoupon, saveCoupon } from "../actions";

export default async function Coupons({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const sp = await searchParams;
  const coupons = await readCoupons();
  const form = (c?: (typeof coupons)[number]) => (
    <form action={saveCoupon} className="card grid gap-3 p-5 sm:grid-cols-4">
      <F label="Code"><input name="code" required className="input uppercase" defaultValue={c?.code} readOnly={!!c} /></F>
      <F label="Type"><select name="type" className="input" defaultValue={c?.flat ? "flat" : "pct"}><option value="pct">Percent off</option><option value="flat">Flat ₹ off</option></select></F>
      <F label="Value"><input name="value" type="number" min="0" required className="input" defaultValue={c?.pct ?? c?.flat} /></F>
      <F label="Min order (₹)"><input name="min" type="number" min="0" className="input" defaultValue={c?.min} /></F>
      <F label="Max discount (₹, percent only)"><input name="cap" type="number" min="0" className="input" defaultValue={c?.cap} /></F>
      <F label="Description" className="sm:col-span-2"><input name="label" className="input" defaultValue={c?.label} /></F>
      <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" name="active" defaultChecked={c?.active ?? true} /> Active</label>
      <div className="flex items-center justify-between sm:col-span-4"><button className="btn btn-primary !py-2">{c ? "Save" : "Add coupon"}</button>{c && <button formAction={deleteCoupon} formNoValidate className="text-sm text-alert underline">Delete</button>}</div>
      {c && <input type="hidden" name="id" value={c.id} />}
    </form>
  );
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl font-semibold text-forest">Coupons</h1>
      <div className="mt-5"><Flash saved={sp.saved} /></div>
      <div className="space-y-4">{coupons.map((c) => <div key={c.id}>{form(c)}</div>)}</div>
      <h2 className="eyebrow mt-10 !text-forest">Add a coupon</h2><div className="mt-3">{form()}</div>
    </div>
  );
}
