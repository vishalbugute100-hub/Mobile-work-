import Link from "next/link";
import { readCategories, readProducts } from "@/lib/content";
import { inr } from "@/lib/format";
import { Art } from "@/components/Art";
import { Flash } from "@/components/AdminUI";

export default async function Products({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const sp = await searchParams;
  const [products, cats] = await Promise.all([readProducts(), readCategories()]);
  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between"><h1 className="font-display text-4xl font-semibold text-forest">Products</h1><Link href="/admin/products/new" className="btn btn-gold">+ New product</Link></div>
      <div className="mt-5"><Flash saved={sp.saved} error={sp.error} /></div>
      <div className="card divide-y divide-line">
        {products.map((p) => (
          <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center gap-4 p-3 hover:bg-ivory">
            <div className="h-14 w-14 shrink-0 overflow-hidden"><Art p={p} className="h-full w-full" /></div>
            <div className="min-w-0 flex-1"><p className="truncate font-medium">{p.name}</p><p className="text-xs text-muted">{cats.find((c) => c.slug === p.category)?.name ?? p.category} · stock {p.stock}</p></div>
            {!p.visible && <span className="chip !py-0.5 !text-xs">Hidden</span>}
            {p.featured && <span className="chip !py-0.5 !text-xs">Featured</span>}
            <span className="font-semibold">{inr(p.price)}</span>
          </Link>
        ))}
        {products.length === 0 && <p className="p-8 text-center text-muted">No products yet.</p>}
      </div>
    </div>
  );
}
