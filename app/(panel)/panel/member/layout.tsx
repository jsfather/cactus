import { requireRole } from "@/lib/auth/session";

export default async function MemberLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("member");
  return children;
}
