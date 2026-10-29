"use client";
import { useState } from "react";

// Uploads photos from the admin (resized in the browser first) and keeps a newline-separated list of URLs in a hidden input.
export function ImageUploader({ name, initial, multiple = true }: { name: string; initial: string[]; multiple?: boolean }) {
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [link, setLink] = useState("");

  async function shrink(file: File): Promise<Blob> {
    if (file.type === "image/gif") return file;
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise<Blob>((res) => c.toBlob((b) => res(b || file), "image/webp", 0.86));
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setErr("");
    try {
      const added: string[] = [];
      for (const f of Array.from(files)) {
        const blob = await shrink(f);
        const fd = new FormData(); fd.append("file", new File([blob], "img", { type: blob.type }));
        const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Upload failed");
        added.push(j.url);
      }
      setUrls((u) => (multiple ? [...u, ...added] : added.slice(0, 1)));
    } catch (e) { setErr(e instanceof Error ? e.message : "Upload failed"); }
    setBusy(false);
  }

  return (
    <div>
      <input type="hidden" name={name} value={urls.join("\n")} />
      <div className="flex flex-wrap gap-3">
        {urls.map((u, i) => (
          <div key={u + i} className="relative h-24 w-24 border border-line bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            {i === 0 && multiple && <span className="absolute left-0 top-0 bg-forest px-1 text-[10px] text-white">Main</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 px-1 text-[11px] text-white">
              {multiple && i > 0 ? <button type="button" onClick={() => setUrls((a) => [a[i], ...a.filter((_, k) => k !== i)])}>★ main</button> : <span />}
              <button type="button" onClick={() => setUrls((a) => a.filter((_, k) => k !== i))}>✕</button>
            </div>
          </div>
        ))}
        <label className="flex h-24 w-24 cursor-pointer items-center justify-center border border-dashed border-gold text-center text-xs text-gold">
          {busy ? "Uploading…" : "+ Upload"}
          <input type="file" accept="image/*" multiple={multiple} className="hidden" disabled={busy} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
        </label>
      </div>
      <div className="mt-2 flex gap-2">
        <input className="input !py-1.5 text-sm" placeholder="…or paste an image link" value={link} onChange={(e) => setLink(e.target.value)} />
        <button type="button" className="btn btn-ghost !px-4 !py-1.5" onClick={() => { if (link.trim()) { setUrls((u) => (multiple ? [...u, link.trim()] : [link.trim()])); setLink(""); } }}>Add</button>
      </div>
      {err && <p className="mt-1 text-sm text-alert">{err}</p>}
    </div>
  );
}
