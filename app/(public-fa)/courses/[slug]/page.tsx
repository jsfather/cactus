import { CourseDetail } from "@/components/public/discovery-pages";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <CourseDetail locale="fa" slug={(await params).slug} />;
}
