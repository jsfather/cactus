import { TeacherStudentsPage } from "@/components/workflows/student-pages";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <TeacherStudentsPage id={(await params).id} />;
}
