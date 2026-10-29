// Optional e-mail alerts to the owner via Resend (set RESEND_API_KEY + NOTIFY_EMAIL). Never throws.
export async function notifyOwner(subject: string, html: string) {
  const key = process.env.RESEND_API_KEY, to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.MAIL_FROM || "HML Gifting <onboarding@resend.dev>", to: to.split(",").map((s) => s.trim()), subject, html }),
    });
  } catch {}
}
export const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);
