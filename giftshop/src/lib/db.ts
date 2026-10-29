// Tiny document store. Postgres when DATABASE_URL is set; otherwise a temp JSON file (demo only, not durable).
import { Pool } from "pg";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

const g = globalThis as unknown as { _pool?: Pool; _ready?: Promise<unknown> };
export const usingDb = () => !!process.env.DATABASE_URL;

async function pool() {
  if (!g._pool) {
    const url = process.env.DATABASE_URL!;
    g._pool = new Pool({ connectionString: url, ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false }, max: 3 });
    g._ready = (async () => {
      await g._pool!.query("CREATE TABLE IF NOT EXISTS docs (kind text NOT NULL, id text NOT NULL, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (kind, id))");
      await g._pool!.query("CREATE TABLE IF NOT EXISTS images (id text PRIMARY KEY, content_type text NOT NULL, data bytea NOT NULL, created_at timestamptz NOT NULL DEFAULT now())");
    })();
  }
  await g._ready;
  return g._pool;
}

const FILE = path.join(os.tmpdir(), "hml-docs.json");
type FileShape = Record<string, Record<string, unknown>>;
// File mode does read-modify-write on one JSON file, so writes must run one at a time.
let chain: Promise<unknown> = Promise.resolve();
const serial = <T>(fn: () => Promise<T>): Promise<T> => { const r = chain.then(fn); chain = r.catch(() => {}); return r; };
const readFile = async (): Promise<FileShape> => { try { return JSON.parse(await fs.readFile(FILE, "utf8")); } catch { return {}; } };

export async function dbList<T>(kind: string): Promise<T[]> {
  if (usingDb()) return (await (await pool()).query("SELECT data FROM docs WHERE kind=$1 ORDER BY updated_at DESC", [kind])).rows.map((r) => r.data as T);
  return Object.values((await readFile())[kind] ?? {}) as T[];
}

export async function dbGet<T>(kind: string, id: string): Promise<T | undefined> {
  if (usingDb()) return (await (await pool()).query("SELECT data FROM docs WHERE kind=$1 AND id=$2", [kind, id])).rows[0]?.data;
  return (await readFile())[kind]?.[id] as T | undefined;
}

export async function dbPut(kind: string, id: string, data: unknown, onlyIfMissing = false) {
  if (usingDb()) {
    await (await pool()).query(
      `INSERT INTO docs (kind,id,data) VALUES ($1,$2,$3) ON CONFLICT (kind,id) DO ${onlyIfMissing ? "NOTHING" : "UPDATE SET data=EXCLUDED.data, updated_at=now()"}`,
      [kind, id, JSON.stringify(data)],
    );
    return;
  }
  await serial(async () => {
    const all = await readFile();
    all[kind] ??= {};
    if (onlyIfMissing && id in all[kind]) return;
    all[kind][id] = data;
    await fs.writeFile(FILE, JSON.stringify(all));
  });
}

export async function dbDel(kind: string, id: string) {
  if (usingDb()) { await (await pool()).query("DELETE FROM docs WHERE kind=$1 AND id=$2", [kind, id]); return; }
  await serial(async () => {
    const all = await readFile();
    if (all[kind]) delete all[kind][id];
    await fs.writeFile(FILE, JSON.stringify(all));
  });
}

// ---- images (uploaded from the admin panel) ----
const IMG_DIR = path.join(os.tmpdir(), "hml-images");

export async function saveImage(id: string, type: string, data: Buffer) {
  if (usingDb()) { await (await pool()).query("INSERT INTO images (id, content_type, data) VALUES ($1,$2,$3)", [id, type, data]); return; }
  await fs.mkdir(IMG_DIR, { recursive: true });
  await fs.writeFile(path.join(IMG_DIR, id), data);
  await fs.writeFile(path.join(IMG_DIR, id + ".type"), type);
}

export async function loadImage(id: string): Promise<{ type: string; data: Buffer } | undefined> {
  if (!/^[a-f0-9]{16,40}$/.test(id)) return undefined;
  if (usingDb()) {
    const r = (await (await pool()).query("SELECT content_type, data FROM images WHERE id=$1", [id])).rows[0];
    return r && { type: r.content_type, data: r.data };
  }
  try { return { type: await fs.readFile(path.join(IMG_DIR, id + ".type"), "utf8"), data: await fs.readFile(path.join(IMG_DIR, id)) }; } catch { return undefined; }
}
