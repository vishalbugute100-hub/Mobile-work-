import { dbList } from "@/lib/db";
import { getSettings } from "@/lib/content";
import { Tabs } from "@/components/AdminUI";
import type { Enquiry } from "@/lib/types";
import { saveEnquiry } from "../actions";

export default async function Enquiries({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const s = await getSettings();
  const all = (await dbList<Enquiry>("enquiry")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const list = status ? all.filter((e) => e.status === status) : all;
  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-4xl font-semibold text-forest">Enquiries & quotes</h1>
      <p className="mt-1 text-sm text-muted">Bulk, corporate, festive and custom requests. Record your quote here, then reply by email or WhatsApp.</p>
      <div className="mt-5"><Tabs base="/admin/enquiries" current={status} items={[["", "All"], ["new", "New"], ["quoted", "Quoted"], ["won", "Won"], ["lost", "Lost"]]} /></div>
      <div className="space-y-4">
        {list.length === 0 && <p className="card p-8 text-center text-muted">No enquiries here yet.</p>}
        {list.map((e) => {
          const wa = `https://wa.me/${e.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}?text=${encodeURIComponent(`Hello ${e.name}, thank you for your enquiry (${e.id}) with ${s.name}.${e.quoteAmount ? ` Our quote: ${e.quoteAmount}. ${e.quoteNote || ""}` : ""}`)}`;
          const mail = `mailto:${e.email}?subject=${encodeURIComponent(`Your enquiry ${e.id} - ${s.name}`)}&body=${encodeURIComponent(`Hello ${e.name},\n\nThank you for your enquiry.\n${e.quoteAmount ? `\nQuote: ${e.quoteAmount}\n${e.quoteNote || ""}\n` : ""}\nRegards,\n${s.name}`)}`;
          return (
            <div key={e.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="font-semibold text-gold">{e.id}</span> <span className="chip !py-0.5 !text-xs">{e.type}</span>
                  <span className="ml-2 text-xs text-muted">{new Date(e.createdAt).toLocaleString("en-IN")}</span>
                  <p className="mt-1 font-medium">{e.name}{e.company && ` · ${e.company}`}</p>
                  <p className="text-sm text-muted">{e.email} · {e.phone}{e.city && ` · ${e.city}`}</p>
                </div>
                <div className="flex gap-2"><a href={wa} target="_blank" className="btn btn-ghost !px-4 !py-1.5">WhatsApp</a><a href={mail} className="btn btn-ghost !px-4 !py-1.5">Email</a></div>
              </div>
              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {e.product && <div><dt className="inline text-muted">Product: </dt><dd className="inline">{e.product}</dd></div>}
                {e.quantity && <div><dt className="inline text-muted">Quantity: </dt><dd className="inline">{e.quantity}</dd></div>}
                {e.budget && <div><dt className="inline text-muted">Budget/unit: </dt><dd className="inline">₹{e.budget}</dd></div>}
                {e.neededBy && <div><dt className="inline text-muted">Needed by: </dt><dd className="inline">{e.neededBy}</dd></div>}
                {e.branding && <div className="text-gold">Needs custom branding / packaging</div>}
              </dl>
              {e.message && <p className="mt-3 whitespace-pre-line border-l-2 border-gold bg-ivory p-3 text-sm">{e.message}</p>}
              <form action={saveEnquiry} className="mt-4 grid gap-2 sm:grid-cols-[140px_160px_1fr]">
                <input type="hidden" name="id" value={e.id} />
                <select name="status" defaultValue={e.status} className="input">{["new", "quoted", "won", "lost"].map((x) => <option key={x}>{x}</option>)}</select>
                <input name="quoteAmount" defaultValue={e.quoteAmount} placeholder="Quote amount" className="input" />
                <input name="quoteNote" defaultValue={e.quoteNote} placeholder="Quote details / terms" className="input" />
                <textarea name="adminNote" defaultValue={e.adminNote} placeholder="Internal notes (not shown to customer)" rows={2} className="input sm:col-span-3" />
                <button className="btn btn-primary sm:col-span-3 sm:w-40">Save</button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
