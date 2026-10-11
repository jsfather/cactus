import type { Metadata } from "next";
import { ShopIndexPage } from "@/components/public/shop-index-page";
export const metadata: Metadata = { title: "فروشگاه" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; tag?: string }>;
}) {
  const { category, q, tag } = await searchParams;
  return <ShopIndexPage locale="fa" category={category} q={q} tag={tag} />;
}
