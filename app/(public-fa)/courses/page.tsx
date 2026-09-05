import { CourseIndex } from "@/components/public/discovery-pages";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return <CourseIndex locale="fa" params={await searchParams} />;
}
