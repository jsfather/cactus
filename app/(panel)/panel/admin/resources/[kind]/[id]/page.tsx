import { ResourceAdmin } from "@/components/workflows/resource-pages";
export default async function Page({
  params,
}: {
  params: Promise<{ kind: string; id: string }>;
}) {
  return <ResourceAdmin {...await params} />;
}
