// Order persistence. Uses Postgres when DATABASE_URL is set; otherwise a temp JSON file (demo only, not durable).
import { Pool } from "pg";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import type { Totals } from "./pricing";

export type OrderStatus = "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  payment: { method: "online" | "cod" | "demo"; status: "unpaid" | "paid" | "cod"; razorpayOrderId?: string; paymentId?: string };
  customer: { name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string };
  lines: { slug: string; name: string; qty: number; price: number; text?: string; packaging?: string }[];
  giftWrap: boolean;
  giftMessage?: string;
  deliveryDate?: string;
  coupon?: string;
  totals: Totals;
  tracking?: { carrier: string; awb: string };
};

const g = globalThis as unknown as { _pool?: Pool; _ready?: Promise<void> };
const useDb = () => !!process.env.DATABASE_URL;

function pool() {
  if (!g._pool) {
    const url = process.env.DATABASE_URL!;
    g._pool = new Pool({
      connectionString: url,
      ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
      max: 3,
    });
    g._ready = g._pool.query(
      "CREATE TABLE IF NOT EXISTS orders (id text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(), data jsonb NOT NULL)",
    ).then(() => undefined);
  }
  return g._pool;
}

const FILE = path.join(os.tmpdir(), "giftshop-orders.json");
async function readFile(): Promise<Order[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function saveOrder(o: Order) {
  if (useDb()) {
    const p = pool();
    await g._ready;
    await p.query(
      "INSERT INTO orders (id, created_at, data) VALUES ($1,$2,$3) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data",
      [o.id, o.createdAt, JSON.stringify(o)],
    );
  } else {
    const all = (await readFile()).filter((x) => x.id !== o.id);
    all.unshift(o);
    await fs.writeFile(FILE, JSON.stringify(all));
  }
}

export async function getOrder(id: string): Promise<Order | undefined> {
  if (useDb()) {
    const p = pool();
    await g._ready;
    const r = await p.query("SELECT data FROM orders WHERE id=$1", [id]);
    return r.rows[0]?.data;
  }
  return (await readFile()).find((o) => o.id === id);
}

export async function listOrders(limit = 200): Promise<Order[]> {
  if (useDb()) {
    const p = pool();
    await g._ready;
    const r = await p.query("SELECT data FROM orders ORDER BY created_at DESC LIMIT $1", [limit]);
    return r.rows.map((x) => x.data);
  }
  return (await readFile()).slice(0, limit);
}

export async function updateOrder(id: string, patch: (o: Order) => Order) {
  const o = await getOrder(id);
  if (o) await saveOrder(patch(o));
}

export const storageMode = () => (useDb() ? "postgres" : "temp-file (demo)");
