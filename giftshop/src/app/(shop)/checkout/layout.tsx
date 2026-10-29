import { redirect } from "next/navigation";
import { getSettings } from "@/lib/content";

export default async function Guard({ children }: { children: React.ReactNode }) {
  if ((await getSettings()).orderMode !== "shop") redirect("/enquiry");
  return children;
}
