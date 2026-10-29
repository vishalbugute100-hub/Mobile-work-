import { loadImage } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const img = await loadImage((await params).id);
  if (!img) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(img.data), { headers: { "Content-Type": img.type, "Cache-Control": "public, max-age=31536000, immutable" } });
}
