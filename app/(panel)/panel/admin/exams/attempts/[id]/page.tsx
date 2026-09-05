import { ExamAttemptPage } from "@/components/workflows/exam-pages";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ExamAttemptPage id={(await params).id} admin={true} />;
}
