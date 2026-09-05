import { SearchPage } from "@/components/public/discovery-pages";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return <SearchPage locale="en" q={(await searchParams).q} />;
}
