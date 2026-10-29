"use client";
import { useState } from "react";

export function BackupImport() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function onFile(f: File | undefined) {
    if (!f) return;
    if (!confirm("Restore this backup? Items with the same name/ID will be overwritten.")) return;
    setBusy(true); setMsg("");
    try {
      const r = await fetch("/api/admin/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: await f.text() });
      const j = await r.json();
      setMsg(r.ok ? `✓ Restored ${j.docs} items, ${j.orders} orders, ${j.images} photos.` : j.error || "Restore failed.");
    } catch { setMsg("Restore failed. The file may be too large for this host."); }
    setBusy(false);
  }
  return (
    <div>
      <label className="btn btn-ghost cursor-pointer">{busy ? "Restoring…" : "Choose backup file"}<input type="file" accept="application/json,.json" className="hidden" disabled={busy} onChange={(e) => onFile(e.target.files?.[0])} /></label>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}
