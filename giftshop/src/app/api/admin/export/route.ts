import { isAdmin } from "@/lib/auth";
import { dumpAll } from "@/lib/db";
import { listOrders } from "@/lib/store";

// Full backup as one JSON file: all content, enquiries, orders and (optionally) uploaded photos.
export async function GET(req: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const withImages = new URL(req.url).searchParams.get("images") !== "0";
  const { docs, images } = await dumpAll(withImages);
  for (const o of await listOrders(100000)) docs.push({ kind: "order", id: o.id, data: o });
  const body = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), docs, images });
  return new Response(body, { headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="hml-backup-${new Date().toISOString().slice(0, 10)}.json"` } });
}
