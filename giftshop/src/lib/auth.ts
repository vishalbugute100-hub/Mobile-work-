import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

export const adminPassword = () => process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "admin123");
const token = () => createHash("sha256").update("hml-admin:" + adminPassword()).digest("hex");

export async function isAdmin() {
  const pw = adminPassword();
  if (!pw) return false;
  const v = (await cookies()).get("hml_admin")?.value ?? "";
  return v.length === token().length && timingSafeEqual(Buffer.from(v), Buffer.from(token()));
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

export async function setAdminCookie() {
  (await cookies()).set("hml_admin", token(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 12, path: "/" });
}
export async function clearAdminCookie() { (await cookies()).delete({ name: "hml_admin", path: "/" }); }
export const passwordMatches = (given: string) => {
  const a = Buffer.from(given), b = Buffer.from(adminPassword());
  return a.length === b.length && timingSafeEqual(a, b);
};
