"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct } from "./products";
import { computeTotals } from "./pricing";

export type CartItem = { slug: string; qty: number; text?: string };
type CartState = { items: CartItem[]; coupon: string; giftWrap: boolean; giftMessage: string };

const EMPTY: CartState = { items: [], coupon: "", giftWrap: false, giftMessage: "" };
const KEY = "giftshop-cart-v1";

type Ctx = CartState & {
  ready: boolean;
  count: number;
  subtotal: number;
  totals: ReturnType<typeof computeTotals>;
  add: (slug: string, qty?: number, text?: string) => void;
  setQty: (i: number, qty: number) => void;
  remove: (i: number) => void;
  set: (p: Partial<CartState>) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<CartState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  }, [s, ready]);

  const value = useMemo<Ctx>(() => {
    const items = s.items.filter((i) => getProduct(i.slug));
    const subtotal = items.reduce((t, i) => t + (getProduct(i.slug)!.price * i.qty), 0);
    return {
      ...s, items, ready, subtotal,
      count: items.reduce((t, i) => t + i.qty, 0),
      totals: computeTotals(subtotal, s.coupon, s.giftWrap),
      add: (slug, qty = 1, text) =>
        setS((p) => {
          const idx = p.items.findIndex((i) => i.slug === slug && (i.text || "") === (text || ""));
          const items = [...p.items];
          if (idx >= 0) items[idx] = { ...items[idx], qty: Math.min(10, items[idx].qty + qty) };
          else items.push({ slug, qty, text: text || undefined });
          return { ...p, items };
        }),
      setQty: (i, qty) => setS((p) => ({ ...p, items: p.items.map((it, k) => (k === i ? { ...it, qty: Math.max(1, Math.min(10, qty)) } : it)) })),
      remove: (i) => setS((p) => ({ ...p, items: p.items.filter((_, k) => k !== i) })),
      set: (patch) => setS((p) => ({ ...p, ...patch })),
      clear: () => setS(EMPTY),
    };
  }, [s, ready]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
