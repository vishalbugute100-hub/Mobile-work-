import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { dbPut } from "@/lib/db";
import { esc, notifyOwner } from "@/lib/notify";
import type { Enquiry } from "@/lib/types";

const s = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  if (s(b.website)) return NextResponse.json({ id: "OK" }); // honeypot: bots fill the hidden field
  const e: Enquiry = {
    id: "EQ" + randomBytes(4).toString("hex").toUpperCase(),
    createdAt: new Date().toISOString(), status: "new",
    type: s(b.type, 60) || "Custom request", name: s(b.name, 80), company: s(b.company, 100), email: s(b.email, 120), phone: s(b.phone, 20), city: s(b.city, 60),
    product: s(b.product, 300), productSlug: s(b.productSlug, 80), quantity: s(b.quantity, 30), budget: s(b.budget, 30), neededBy: s(b.neededBy, 12),
    branding: !!b.branding, message: s(b.message, 2000),
  };
  if (!e.name || !/^\S+@\S+\.\S+$/.test(e.email) || e.phone.replace(/\D/g, "").length < 8) return NextResponse.json({ error: "Please enter your name, a valid email and phone number." }, { status: 400 });
  await dbPut("enquiry", e.id, e);
  await notifyOwner(`New enquiry ${e.id}: ${e.type} from ${e.name}`,
    `<h3>${esc(e.type)}</h3><p><b>${esc(e.name)}</b> ${esc(e.company)}<br>${esc(e.email)} · ${esc(e.phone)}</p><p>Product: ${esc(e.product)}<br>Qty: ${esc(e.quantity)} · Budget: ${esc(e.budget)} · Needed by: ${esc(e.neededBy)}</p><p>${esc(e.message)}</p>`);
  return NextResponse.json({ id: e.id });
}
