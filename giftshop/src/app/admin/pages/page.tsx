import { readPage } from "@/lib/content";
import { F, Flash } from "@/components/AdminUI";
import { savePage } from "../actions";

export default async function Pages({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const sp = await searchParams;
  const pages = await Promise.all(["about", "policies"].map((id) => readPage(id)));
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl font-semibold text-forest">About & policies</h1>
      <p className="mt-1 text-sm text-muted">Blank line = new paragraph · “## ” starts a heading · “- ” starts a bullet. Have your policy text reviewed before going live.</p>
      <div className="mt-5"><Flash saved={sp.saved} /></div>
      <div className="space-y-6">
        {pages.map((p) => p && (
          <form key={p.id} action={savePage} className="card space-y-3 p-5">
            <input type="hidden" name="id" value={p.id} />
            <F label={`Page title (/${p.id})`}><input name="title" className="input" defaultValue={p.title} /></F>
            <F label="Text"><textarea name="body" rows={12} className="input" defaultValue={p.body} /></F>
            <button className="btn btn-primary !py-2">Save</button>
          </form>
        ))}
      </div>
    </div>
  );
}
