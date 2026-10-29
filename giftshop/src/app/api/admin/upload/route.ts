import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { isAdmin } from "@/lib/auth";
import { saveImage } from "@/lib/db";

const OK = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const file = (await req.formData()).get("file");
  if (!(file instanceof File) || !OK.includes(file.type)) return NextResponse.json({ error: "Upload a JPG, PNG, WebP or GIF image." }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Image is larger than 4 MB." }, { status: 400 });
  const id = randomBytes(12).toString("hex");
  await saveImage(id, file.type, Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/api/img/${id}` });
}
