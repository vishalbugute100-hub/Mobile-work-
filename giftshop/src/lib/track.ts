// Fire marketing events to GA4 / Meta Pixel / Google Ads when configured (IDs come from Admin > Settings).
type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; __hml?: { adsId?: string } };

export function track(event: "add_to_cart" | "begin_checkout" | "purchase" | "view_item" | "generate_lead", data: { value?: number; id?: string; name?: string; orderId?: string } = {}) {
  if (typeof window === "undefined") return;
  const w = window as W;
  const items = data.id ? [{ item_id: data.id, item_name: data.name }] : undefined;
  w.gtag?.("event", event, { currency: "INR", value: data.value, transaction_id: data.orderId, items });
  const adsId = w.__hml?.adsId;
  if (event === "purchase" && adsId) w.gtag?.("event", "conversion", { send_to: adsId, value: data.value, currency: "INR", transaction_id: data.orderId });
  const fb = { add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", purchase: "Purchase", view_item: "ViewContent", generate_lead: "Lead" }[event];
  w.fbq?.("track", fb, { value: data.value, currency: "INR", content_ids: data.id ? [data.id] : undefined });
}
