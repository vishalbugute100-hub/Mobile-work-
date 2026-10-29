import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/content";
import { RichText } from "@/components/RichText";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  const p = await getPage("about");
  return { title: p?.title, alternates: { canonical: "/about" } };
}

export default async function Page() {
  const p = await getPage("about");
  if (!p) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-5xl font-semibold text-forest">{p.title}</h1>
      <RichText text={p.body} className="mt-8 leading-relaxed text-muted" />
    </div>
  );
}
