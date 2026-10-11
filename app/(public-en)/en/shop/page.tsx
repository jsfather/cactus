import type { Metadata } from "next";
import { ShopIndexPage } from "@/components/public/shop-index-page";
export const metadata: Metadata = { title: "Shop" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; tag?: string }>;
}) {
  const { category, q, tag } = await searchParams;
  return <ShopIndexPage locale="en" category={category} q={q} tag={tag} />;
}
