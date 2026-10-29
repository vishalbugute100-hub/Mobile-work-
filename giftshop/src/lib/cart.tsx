"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { computeTotals, type CouponDef, type FeeCfg } from "./pricing";

// A cart line is a snapshot taken when the item was added. The server re-prices every line at checkout.
export type CartItem = { slug: string; name: string; price: number; qty: number; image?: string; emoji: string; hue: number; text?: string; packaging?: string };
type CartState = { items: CartItem[]; coupon: CouponDef | null; giftWrap: boolean; giftMessage: string };

const EMPTY: CartState = { items: [], coupon: null, giftWrap: false, giftMessage: "" };
const KEY = "hml-cart-v2";

type Ctx = CartState & {
  ready: boolean; count: number; subtotal: number; cfg: FeeCfg;
  totals: ReturnType<typeof computeTotals>;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (i: number, qty: number) => void;
  remove: (i: number) => void;
  set: (p: Partial<CartState>) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);
const sameLine = (a: CartItem, b: Omit<CartItem, "qty">) => a.slug === b.slug && (a.text || "") === (b.text || "") && (a.packaging || "") === (b.packaging || "");

export function CartProvider({ cfg, children }: { cfg: FeeCfg; children: ReactNode }) {
  const [s, setS] = useState<CartState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...EMPTY, ...JSON.parse(raw) }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }, [s, ready]);

  const value = useMemo<Ctx>(() => {
    const subtotal = s.items.reduce((t, i) => t + i.price * i.qty, 0);
    return {
      ...s, ready, subtotal, cfg,
      count: s.items.reduce((t, i) => t + i.qty, 0),
      totals: computeTotals(subtotal, s.coupon, s.giftWrap, cfg),
      add: (item, qty = 1) => setS((p) => {
        const items = [...p.items];
        const idx = items.findIndex((i) => sameLine(i, item));
        if (idx >= 0) items[idx] = { ...items[idx], qty: Math.min(999, items[idx].qty + qty) };
        else items.push({ ...item, qty });
        return { ...p, items };
      }),
      setQty: (i, qty) => setS((p) => ({ ...p, items: p.items.map((it, k) => (k === i ? { ...it, qty: Math.max(1, Math.min(999, qty || 1)) } : it)) })),
      remove: (i) => setS((p) => ({ ...p, items: p.items.filter((_, k) => k !== i) })),
      set: (patch) => setS((p) => ({ ...p, ...patch })),
      clear: () => setS(EMPTY),
    };
  }, [s, ready, cfg]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
