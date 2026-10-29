export type CouponDef = { code: string; label: string; pct?: number; flat?: number; min?: number; cap?: number };
export type FeeCfg = { freeShipAbove: number; shippingFee: number; giftWrapFee: number };
export type Totals = { subtotal: number; discount: number; shipping: number; wrap: number; total: number };

export function computeTotals(subtotal: number, coupon: CouponDef | null | undefined, giftWrap: boolean, cfg: FeeCfg): Totals {
  let discount = 0;
  if (coupon && subtotal >= (coupon.min ?? 0)) {
    discount = coupon.pct ? Math.round((subtotal * coupon.pct) / 100) : coupon.flat ?? 0;
    if (coupon.cap) discount = Math.min(discount, coupon.cap);
    discount = Math.min(discount, subtotal);
  }
  const after = subtotal - discount;
  const shipping = subtotal === 0 || after >= cfg.freeShipAbove ? 0 : cfg.shippingFee;
  const wrap = giftWrap && subtotal > 0 ? cfg.giftWrapFee : 0;
  return { subtotal, discount, shipping, wrap, total: after + shipping + wrap };
}
