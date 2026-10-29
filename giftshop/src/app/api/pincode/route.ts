import { NextResponse } from "next/server";

// Prototype estimate. Replace with a courier serviceability API (e.g. Shiprocket) for real pincode coverage.
export async function GET(req: Request) {
  const pin = new URL(req.url).searchParams.get("pin") || "";
  if (!/^[1-9]\d{5}$/.test(pin)) return NextResponse.json({ ok: false, message: "Enter a valid 6-digit pincode." });
  const zone = Number(pin[0]);
  const days = [0, 2, 3, 3, 4, 3, 4, 3, 5, 5][zone] ?? 4;
  return NextResponse.json({ ok: true, message: `Delivery available. Estimated ${days}–${days + 2} days. Cash on Delivery available.` });
}
