import { ResourceAdmin } from "@/components/workflows/resource-pages";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  return (
    <ResourceAdmin
      kind={(await params).kind}
      saved={(await searchParams).saved === "1"}
    />
  );
}
