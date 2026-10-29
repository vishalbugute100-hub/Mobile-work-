import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = { title: "Gift Guides & Ideas", description: "Corporate gifting guides, festive gift ideas and tips.", alternates: { canonical: "/blog" } };

export default async function Blog() {
  const posts = await getPosts();
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <p className="eyebrow">Journal</p>
      <h1 className="font-display mt-1 text-5xl font-semibold text-forest">Gift guides</h1>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block py-6 transition hover:bg-white/60">
            <p className="text-xs uppercase tracking-widest text-muted">{new Date(p.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
            <h2 className="font-display mt-1 text-3xl font-semibold text-forest">{p.title}</h2>
            <p className="mt-1 text-muted">{p.description}</p>
          </Link>
        ))}
        {posts.length === 0 && <p className="py-10 text-muted">No guides yet.</p>}
      </div>
    </div>
  );
}
