import { NextResponse } from "next/server";
import { readCoupons } from "@/lib/content";

export async function GET(req: Request) {
  const code = (new URL(req.url).searchParams.get("code") || "").trim().toUpperCase();
  const c = (await readCoupons()).find((x) => x.active && x.code === code);
  if (!c) return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
  return NextResponse.json({ coupon: { code: c.code, label: c.label, pct: c.pct, flat: c.flat, min: c.min, cap: c.cap } });
}
