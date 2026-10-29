import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts, getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import { RichText } from "@/components/RichText";

type P = Promise<{ slug: string }>;
export const revalidate = 300;

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getPosts()).find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.description, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: "article", title: p.title, description: p.description } } : {};
}

export default async function Post({ params }: { params: P }) {
  const { slug } = await params;
  const [posts, s] = await Promise.all([getPosts(), getSettings()]);
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.description, datePublished: p.date, author: { "@type": "Organization", name: s.name }, mainEntityOfPage: `${siteUrl()}/blog/${p.slug}` };
  return (
    <article className="mx-auto max-w-2xl px-4 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Link href="/blog" className="eyebrow">← Gift guides</Link>
      <h1 className="font-display mt-3 text-5xl font-semibold leading-tight text-forest">{p.title}</h1>
      <RichText text={p.body} className="mt-8 text-lg leading-relaxed" />
      {p.ctaHref && <Link href={p.ctaHref} className="btn btn-primary mt-10">{p.ctaLabel || "Learn more"}</Link>}
    </article>
  );
}
