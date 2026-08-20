import { requireRole } from "@/lib/auth/session";

export default async function TeacherLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireRole("teacher");
  return children;
}
