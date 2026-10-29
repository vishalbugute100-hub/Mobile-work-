import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { restoreAll, type Dump } from "@/lib/db";
import { saveOrder, type Order } from "@/lib/store";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const d = (await req.json().catch(() => null)) as Dump | null;
  if (!d || d.version !== 1 || !Array.isArray(d.docs)) return NextResponse.json({ error: "This is not a valid backup file." }, { status: 400 });
  const orders = d.docs.filter((x) => x.kind === "order");
  await restoreAll({ docs: d.docs.filter((x) => x.kind !== "order"), images: Array.isArray(d.images) ? d.images : [] });
  for (const o of orders) await saveOrder(o.data as Order);
  revalidateTag("content");
  revalidatePath("/", "layout");
  return NextResponse.json({ docs: d.docs.length - orders.length, orders: orders.length, images: d.images?.length ?? 0 });
}
