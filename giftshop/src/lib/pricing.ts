import { FREE_SHIPPING_ABOVE, GIFT_WRAP_FEE, SHIPPING_FEE } from "./site";

export type CouponDef = { code: string; label: string; pct?: number; flat?: number; min?: number; cap?: number };

export const COUPONS: CouponDef[] = [
  { code: "WELCOME10", label: "10% off your order", pct: 10 },
  { code: "GIFT200", label: "₹200 off orders above ₹1,999", flat: 200, min: 1999 },
  { code: "FESTIVE15", label: "15% off (max ₹500) above ₹2,499", pct: 15, min: 2499, cap: 500 },
];

export const findCoupon = (code?: string) => COUPONS.find((c) => c.code === code?.trim().toUpperCase());

export type Totals = { subtotal: number; discount: number; shipping: number; wrap: number; total: number };

export function computeTotals(subtotal: number, couponCode?: string, giftWrap = false): Totals {
  const c = findCoupon(couponCode);
  let discount = 0;
  if (c && subtotal >= (c.min ?? 0)) {
    discount = c.pct ? Math.round((subtotal * c.pct) / 100) : c.flat ?? 0;
    if (c.cap) discount = Math.min(discount, c.cap);
  }
  const after = subtotal - discount;
  const shipping = subtotal === 0 || after >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  const wrap = giftWrap && subtotal > 0 ? GIFT_WRAP_FEE : 0;
  return { subtotal, discount, shipping, wrap, total: after + shipping + wrap };
}
