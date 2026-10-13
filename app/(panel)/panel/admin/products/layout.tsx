import { requireRole } from "@/lib/auth/session";

export default async function SectionLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin", "shop");
  return children;
}
