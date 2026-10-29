import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS } from "@/lib/blog";
import { SITE } from "@/lib/site";

type P = Promise<{ slug: string }>;
export const generateStaticParams = () => POSTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.description, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: "article", title: p.title, description: p.description } } : {};
}

export default async function Post({ params }: { params: P }) {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.description, datePublished: p.date, author: { "@type": "Organization", name: SITE.name }, mainEntityOfPage: `${SITE.url}/blog/${p.slug}` };
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Link href="/blog" className="text-sm text-berry">← Gift guides</Link>
      <h1 className="font-display mt-3 text-4xl font-bold leading-tight">{p.title}</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed">{p.body.map((t, i) => (<p key={i}>{t}</p>))}</div>
      <Link href={p.link.href} className="btn btn-primary mt-8">{p.link.label} →</Link>
    </article>
  );
}
