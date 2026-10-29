// Tiny document store. Postgres when DATABASE_URL is set; otherwise files in ./.data (persistent on your own machine).
import { Pool } from "pg";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

const g = globalThis as unknown as { _pool?: Pool; _ready?: Promise<unknown>; _dir?: Promise<string> };
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

// Folder for file-mode data. ./.data (or DATA_DIR); falls back to the OS temp folder if that is read-only (e.g. serverless).
export function dataDir(): Promise<string> {
  g._dir ??= (async () => {
    for (const d of [process.env.DATA_DIR, path.join(process.cwd(), ".data"), path.join(os.tmpdir(), "hml-data")]) {
      if (!d) continue;
      try { await fs.mkdir(d, { recursive: true }); await fs.access(d, 2); return d; } catch {}
    }
    return os.tmpdir();
  })();
  return g._dir;
}
export const storageLabel = async () => (usingDb() ? "Postgres database" : `local files (${await dataDir()})`);

// File mode does read-modify-write on one JSON file, so writes must run one at a time.
let chain: Promise<unknown> = Promise.resolve();
const serial = <T>(fn: () => Promise<T>): Promise<T> => { const r = chain.then(fn); chain = r.catch(() => {}); return r; };
type FileShape = Record<string, Record<string, unknown>>;
const docFile = async () => path.join(await dataDir(), "docs.json");
const readFile = async (): Promise<FileShape> => { try { return JSON.parse(await fs.readFile(await docFile(), "utf8")); } catch { return {}; } };
const writeFile = async (all: FileShape) => fs.writeFile(await docFile(), JSON.stringify(all));

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
    await writeFile(all);
  });
}

export async function dbDel(kind: string, id: string) {
  if (usingDb()) { await (await pool()).query("DELETE FROM docs WHERE kind=$1 AND id=$2", [kind, id]); return; }
  await serial(async () => {
    const all = await readFile();
    if (all[kind]) delete all[kind][id];
    await writeFile(all);
  });
}

// ---- images (uploaded from the admin panel) ----
const imgDir = async () => path.join(await dataDir(), "images");

export async function saveImage(id: string, type: string, data: Buffer) {
  if (usingDb()) { await (await pool()).query("INSERT INTO images (id, content_type, data) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING", [id, type, data]); return; }
  const d = await imgDir();
  await fs.mkdir(d, { recursive: true });
  await fs.writeFile(path.join(d, id), data);
  await fs.writeFile(path.join(d, id + ".type"), type);
}

export async function loadImage(id: string): Promise<{ type: string; data: Buffer } | undefined> {
  if (!/^[a-f0-9]{16,40}$/.test(id)) return undefined;
  if (usingDb()) {
    const r = (await (await pool()).query("SELECT content_type, data FROM images WHERE id=$1", [id])).rows[0];
    return r && { type: r.content_type, data: r.data };
  }
  try { const d = await imgDir(); return { type: await fs.readFile(path.join(d, id + ".type"), "utf8"), data: await fs.readFile(path.join(d, id)) }; } catch { return undefined; }
}

// ---- backup / restore ----
export type Dump = { version: 1; exportedAt: string; docs: { kind: string; id: string; data: unknown }[]; images: { id: string; type: string; b64: string }[] };

export async function dumpAll(withImages: boolean): Promise<Pick<Dump, "docs" | "images">> {
  const docs: Dump["docs"] = [];
  const images: Dump["images"] = [];
  if (usingDb()) {
    const p = await pool();
    for (const r of (await p.query("SELECT kind, id, data FROM docs")).rows) docs.push({ kind: r.kind, id: r.id, data: r.data });
    if (withImages) for (const r of (await p.query("SELECT id, content_type, encode(data,'base64') AS b64 FROM images")).rows) images.push({ id: r.id, type: r.content_type, b64: r.b64 });
  } else {
    for (const [kind, m] of Object.entries(await readFile())) for (const [id, data] of Object.entries(m)) docs.push({ kind, id, data });
    if (withImages) {
      const d = await imgDir();
      for (const f of await fs.readdir(d).catch(() => [] as string[])) {
        if (f.endsWith(".type")) continue;
        images.push({ id: f, type: await fs.readFile(path.join(d, f + ".type"), "utf8"), b64: (await fs.readFile(path.join(d, f))).toString("base64") });
      }
    }
  }
  return { docs, images };
}

export async function restoreAll(dump: Pick<Dump, "docs" | "images">) {
  for (const d of dump.docs) await dbPut(d.kind, d.id, d.data);
  for (const i of dump.images) if (/^[a-f0-9]{16,40}$/.test(i.id)) await saveImage(i.id, i.type, Buffer.from(i.b64, "base64"));
}
