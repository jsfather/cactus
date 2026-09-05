import { CourseAdmin } from "@/components/workflows/course-admin";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <CourseAdmin id={(await params).id} />;
}
