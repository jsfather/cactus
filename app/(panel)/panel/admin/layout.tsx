import { requireAdminWorkspace } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminWorkspace();
  return children;
}
