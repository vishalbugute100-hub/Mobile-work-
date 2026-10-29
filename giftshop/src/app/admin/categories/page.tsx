import { readCategories } from "@/lib/content";
import { F, Flash } from "@/components/AdminUI";
import { ImageUploader } from "@/components/ImageUploader";
import { deleteCategory, saveCategory } from "../actions";

export default async function Categories({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const sp = await searchParams;
  const cats = await readCategories();
  const form = (c?: (typeof cats)[number]) => (
    <form action={saveCategory} className="card space-y-3 p-5">
      {c && <input type="hidden" name="id" value={c.id} />}
      <div className="grid gap-3 sm:grid-cols-[1fr_80px_80px]">
        <F label="Name"><input name="name" required className="input" defaultValue={c?.name} /></F>
        <F label="Emoji"><input name="emoji" className="input" defaultValue={c?.emoji} /></F>
        <F label="Order"><input name="sort" type="number" className="input" defaultValue={c?.sort ?? cats.length + 1} /></F>
      </div>
      <F label="Short description"><input name="blurb" className="input" defaultValue={c?.blurb} /></F>
      <F label="Cover photo (optional)"><ImageUploader name="image" initial={c?.image ? [c.image] : []} multiple={false} /></F>
      <div className="flex justify-between"><button className="btn btn-primary !py-2">{c ? "Save" : "Add category"}</button>{c && <button formAction={deleteCategory} formNoValidate className="text-sm text-alert underline">Delete</button>}</div>
    </form>
  );
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl font-semibold text-forest">Categories</h1>
      <p className="mt-1 text-sm text-muted">These appear in the menu and on the home page. Products are assigned a category in the product editor.</p>
      <div className="mt-5"><Flash saved={sp.saved} /></div>
      <div className="space-y-4">{cats.map((c) => <div key={c.id}>{form(c)}</div>)}</div>
      <h2 className="eyebrow mt-10 !text-forest">Add a category</h2><div className="mt-3">{form()}</div>
    </div>
  );
}
