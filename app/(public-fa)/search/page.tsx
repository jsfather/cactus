import { SearchPage } from "@/components/public/discovery-pages";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return <SearchPage locale="fa" q={(await searchParams).q} />;
}
