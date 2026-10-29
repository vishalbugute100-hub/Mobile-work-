import { readSettings } from "@/lib/content";
import { F, Flash } from "@/components/AdminUI";
import { ImageUploader } from "@/components/ImageUploader";
import { saveSettings } from "../actions";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const sp = await searchParams;
  const s = await readSettings();
  const t = (k: keyof typeof s, label: string, hint?: string) => (<F label={label} hint={hint}><input name={k} className="input" defaultValue={String(s[k] ?? "")} /></F>);
  const n = (k: keyof typeof s, label: string, hint?: string) => (<F label={label} hint={hint}><input name={k} type="number" min="0" className="input" defaultValue={Number(s[k])} /></F>);
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl font-semibold text-forest">Site settings</h1>
      <div className="mt-5"><Flash saved={sp.saved} /></div>
      <form action={saveSettings} className="space-y-6">
        <section className="card space-y-4 p-6"><h2 className="eyebrow !text-forest">How customers buy</h2>
          <F label="Mode" hint="Enquiry only: no cart or payment; visitors request a quote. Online ordering: cart, checkout and payments (needs Razorpay keys for online payment).">
            <select name="orderMode" className="input" defaultValue={s.orderMode}><option value="enquiry">Enquiry only (request a quote)</option><option value="shop">Online ordering (cart & checkout)</option></select>
          </F>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="showPrices" defaultChecked={s.showPrices} /> Show prices on the website (untick to show “Price on request”)</label>
        </section>
        <section className="card space-y-4 p-6"><h2 className="eyebrow !text-forest">Brand & home page</h2>
          {t("name", "Brand name")}{t("tagline", "Tagline", "Shown in the footer and search results.")}{t("altTagline", "Second tagline", "Shown on the home page and footer.")}
          {t("heroTitle", "Home page headline")}
          <F label="Home page sub-text"><textarea name="heroSub" rows={3} className="input" defaultValue={s.heroSub} /></F>
          <F label="Home page background photo (optional)"><ImageUploader name="heroImage" initial={s.heroImage ? [s.heroImage] : []} multiple={false} /></F>
          {t("announcement", "Top announcement bar", "Leave empty to hide. Clicking it opens the enquiry page.")}
        </section>
        <section className="card space-y-4 p-6"><h2 className="eyebrow !text-forest">Contact details</h2>
          <div className="grid gap-4 sm:grid-cols-2">{t("phone", "Phone")}{t("email", "Email")}{t("whatsapp", "WhatsApp number", "With country code, e.g. 919876543210")}</div>
          <F label="Address"><textarea name="address" rows={2} className="input" defaultValue={s.address} /></F>
        </section>
        <section className="card space-y-4 p-6"><h2 className="eyebrow !text-forest">Company & legal (footer)</h2>
          {t("parentLine", "Parent company line", "e.g. A Harrisons Malayalam Limited enterprise. Use group names/logos only with approval.")}
          <F label="Legal details" hint="Company name, CIN, GSTIN, FSSAI licence no., registered address. One per line."><textarea name="legalInfo" rows={4} className="input" defaultValue={s.legalInfo} /></F>
        </section>
        <section className="card space-y-4 p-6"><h2 className="eyebrow !text-forest">Shipping, fees & bulk</h2>
          <div className="grid gap-4 sm:grid-cols-2">{n("freeShipAbove", "Free shipping above (₹)")}{n("shippingFee", "Shipping fee (₹)")}{n("giftWrapFee", "Gift wrap fee (₹)")}{n("bulkMin", "“Bulk” starts at (units)", "Shown in the bulk-enquiry box on product pages.")}</div>
        </section>
        <section className="card space-y-4 p-6"><h2 className="eyebrow !text-forest">Marketing & tracking IDs</h2>
          <div className="grid gap-4 sm:grid-cols-3">{t("gaId", "Google Analytics ID", "G-XXXXXXX")}{t("adsId", "Google Ads conversion ID", "AW-XXXXXXX/abc")}{t("pixelId", "Meta Pixel ID")}</div>
        </section>
        <button className="btn btn-primary">Save settings</button>
      </form>
    </div>
  );
}
