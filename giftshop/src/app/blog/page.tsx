import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/blog";

export const metadata: Metadata = { title: "Gift Guides & Ideas", description: "Gift ideas, occasion guides and gifting tips.", alternates: { canonical: "/blog" } };

export default function Blog() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Gift guides</h1>
      <div className="mt-8 space-y-4">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card block p-6 transition hover:-translate-y-0.5">
            <p className="text-xs text-muted">{new Date(p.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
            <h2 className="mt-1 text-xl font-bold">{p.title}</h2>
            <p className="mt-1 text-muted">{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
