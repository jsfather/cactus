import { LearningPage } from "@/components/workflows/learning-pages";
export default async function Page({
  params,
}: {
  params: Promise<{ kind: string; id?: string }>;
}) {
  return <LearningPage role="admin" {...await params} edit />;
}
