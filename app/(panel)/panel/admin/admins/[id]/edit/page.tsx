import { EditUserPage } from "@/components/users/user-form-page";

export default async function EditAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditUserPage role="admin" userId={id} />;
}
