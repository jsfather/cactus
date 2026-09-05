import { PreviousCoursesPage } from "@/components/workflows/student-pages";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PreviousCoursesPage studentId={(await params).id} />;
}
