import Link from "next/link";
import { readPosts } from "@/lib/content";
import { F, Flash } from "@/components/AdminUI";
import { deletePost, savePost } from "../actions";

export default async function Guides({ searchParams }: { searchParams: Promise<{ saved?: string; edit?: string }> }) {
  const sp = await searchParams;
  const posts = await readPosts();
  if (sp.edit) {
    const p = posts.find((x) => x.id === sp.edit);
    return (
      <div className="max-w-3xl">
        <Link href="/admin/guides" className="eyebrow">← Gift guides</Link>
        <h1 className="font-display mt-2 text-4xl font-semibold text-forest">{p ? "Edit guide" : "New guide"}</h1>
        <form action={savePost} className="card mt-6 space-y-4 p-6">
          {p && <input type="hidden" name="id" value={p.id} />}
          <F label="Title *"><input name="title" required className="input" defaultValue={p?.title} /></F>
          <F label="Summary (shown in Google results)"><input name="description" className="input" defaultValue={p?.description} /></F>
          <F label="Article text" hint="Blank line = new paragraph. Start a line with “## ” for a heading, “- ” for a bullet."><textarea name="body" rows={14} className="input" defaultValue={p?.body} /></F>
          <div className="grid gap-4 sm:grid-cols-3">
            <F label="Date"><input type="date" name="date" className="input" defaultValue={p?.date} /></F>
            <F label="Button text"><input name="ctaLabel" className="input" defaultValue={p?.ctaLabel} /></F>
            <F label="Button link" hint="e.g. /shop?tag=diwali"><input name="ctaHref" className="input" defaultValue={p?.ctaHref} /></F>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={p?.published ?? true} /> Published</label>
          <div className="flex justify-between border-t border-line pt-4"><button className="btn btn-primary">Save guide</button>{p && <button formAction={deletePost} formNoValidate className="text-sm text-alert underline">Delete</button>}</div>
        </form>
      </div>
    );
  }
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between"><h1 className="font-display text-4xl font-semibold text-forest">Gift guides</h1><Link href="/admin/guides?edit=new" className="btn btn-gold">+ New guide</Link></div>
      <p className="mt-1 text-sm text-muted">Helpful articles bring visitors from Google. Write about occasions, corporate gifting, tea and coffee.</p>
      <div className="mt-5"><Flash saved={sp.saved} /></div>
      <div className="card divide-y divide-line">
        {posts.map((p) => (<Link key={p.id} href={`/admin/guides?edit=${p.id}`} className="flex justify-between p-4 hover:bg-ivory"><span>{p.title}</span><span className="text-xs text-muted">{p.published ? p.date : "Draft"}</span></Link>))}
      </div>
    </div>
  );
}
