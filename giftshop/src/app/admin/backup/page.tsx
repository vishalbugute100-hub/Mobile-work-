import { storageLabel } from "@/lib/db";
import { BackupImport } from "@/components/BackupImport";

export default async function Backup() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl font-semibold text-forest">Backup & move</h1>
      <p className="mt-1 text-sm text-muted">Data is currently stored in: <b>{await storageLabel()}</b></p>
      <section className="card mt-6 space-y-3 p-6">
        <h2 className="eyebrow !text-forest">Download a backup</h2>
        <p className="text-sm text-muted">One file with all products, categories, text, settings, enquiries, orders and uploaded photos. Keep it safe: it contains customer details.</p>
        <div className="flex flex-wrap gap-2"><a href="/api/admin/export" className="btn btn-primary">Download full backup</a><a href="/api/admin/export?images=0" className="btn btn-ghost">Without photos (smaller)</a></div>
      </section>
      <section className="card mt-6 space-y-3 p-6">
        <h2 className="eyebrow !text-forest">Restore / move to a new site</h2>
        <p className="text-sm text-muted">Use this on the new website (for example the company's live deployment) to load everything from a backup file.</p>
        <BackupImport />
      </section>
    </div>
  );
}
