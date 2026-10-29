import Link from "next/link";
import { notFound } from "next/navigation";
import { readCategories, readProducts } from "@/lib/content";
import { F } from "@/components/AdminUI";
import { ImageUploader } from "@/components/ImageUploader";
import { deleteProduct, saveProduct } from "../../actions";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const [products, cats] = await Promise.all([readProducts(), readCategories()]);
  const p = isNew ? undefined : products.find((x) => x.id === id);
  if (!isNew && !p) notFound();
  return (
    <div className="max-w-3xl">
      <Link href="/admin/products" className="eyebrow">← Products</Link>
      <h1 className="font-display mt-2 text-4xl font-semibold text-forest">{isNew ? "New product" : p!.name}</h1>
      <form action={saveProduct} className="card mt-6 space-y-5 p-6">
        <input type="hidden" name="isNew" value={isNew ? "1" : "0"} />
        {!isNew && <input type="hidden" name="id" value={p!.id} />}
        <F label="Product name *"><input name="name" required className="input" defaultValue={p?.name} /></F>
        {isNew && <F label="Web address name (optional)" hint="Used in the page link, e.g. darjeeling-first-flush. Created from the name if left empty. Can't be changed later."><input name="slug" className="input" /></F>}
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Category"><select name="category" className="input" defaultValue={p?.category}>{cats.map((c) => (<option key={c.slug} value={c.slug}>{c.name}</option>))}</select></F>
          <F label="Size / weight" hint="e.g. 100 g, 4 teas + infuser"><input name="size" className="input" defaultValue={p?.size} /></F>
          <F label="Selling price (₹) *"><input name="price" type="number" min="0" required className="input" defaultValue={p?.price} /></F>
          <F label="MRP / original price (₹)" hint="Shown struck through if higher than the selling price."><input name="mrp" type="number" min="0" className="input" defaultValue={p?.mrp} /></F>
        </div>
        <F label="Photos" hint="First photo is the main one. Upload from your computer or paste links."><ImageUploader name="images" initial={p?.images ?? []} /></F>
        <F label="Short description" hint="One or two lines shown on cards and in search results."><input name="short" className="input" defaultValue={p?.short} /></F>
        <F label="Full description"><textarea name="description" rows={5} className="input" defaultValue={p?.description} /></F>
        <F label="Highlights (one per line)" hint="e.g. Origin: Darjeeling"><textarea name="highlights" rows={3} className="input" defaultValue={p?.highlights.join("\n")} /></F>
        <F label="Box / presentation options (one per line)" hint="Format: Name | extra price. Example: Wooden Keepsake Box | 600. Leave empty for no options."><textarea name="packaging" rows={3} className="input" defaultValue={p?.packaging.map((x) => `${x.name} | ${x.extra}`).join("\n")} /></F>
        <F label="Occasions / tags (comma separated)" hint="Used for “Shop by occasion”. e.g. diwali, corporate, wedding, thank-you"><input name="tags" className="input" defaultValue={p?.tags.join(", ")} /></F>
        <div className="grid gap-4 sm:grid-cols-3">
          <F label="Stock quantity"><input name="stock" type="number" min="0" className="input" defaultValue={p?.stock ?? 100} /></F>
          <F label="Bulk enquiry from (units)" hint="Blank = site default"><input name="bulkMin" type="number" min="1" className="input" defaultValue={p?.bulkMin} /></F>
          <F label="Placeholder emoji" hint="Only until a photo is added"><input name="emoji" className="input" defaultValue={p?.emoji ?? "🎁"} /></F>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Customer text field label (optional)" hint="e.g. Name / logo notes. Leave empty if not needed."><input name="personaliseLabel" className="input" defaultValue={p?.personaliseLabel} /></F>
          <F label="Max characters"><input name="personaliseMax" type="number" min="1" className="input" defaultValue={p?.personaliseMax ?? 100} /></F>
        </div>
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="visible" defaultChecked={p?.visible ?? true} /> Visible on website</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={p?.featured} /> Featured on home page</label>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4">
          <button className="btn btn-primary">Save product</button>
          {!isNew && <button formAction={deleteProduct} className="text-sm text-alert underline" formNoValidate>Delete product</button>}
        </div>
      </form>
    </div>
  );
}
