import { EditUserPage } from "@/components/users/user-form-page";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditUserPage role="student" userId={id} />;
}
