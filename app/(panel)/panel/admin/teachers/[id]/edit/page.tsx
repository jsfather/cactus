import { EditUserPage } from "@/components/users/user-form-page";

export default async function EditTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditUserPage role="teacher" userId={id} />;
}
