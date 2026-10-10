import type { Metadata } from "next";
import { SearchPage } from "@/components/public/discovery-pages";
export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return <SearchPage locale="en" q={(await searchParams).q} />;
}
