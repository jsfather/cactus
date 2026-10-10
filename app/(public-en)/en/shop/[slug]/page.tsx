import type { Metadata } from "next";
import { getProductMetadata } from "@/lib/products/seo";
import { ProductPage } from "@/components/public/product-page";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return getProductMetadata("en", (await params).slug);
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ProductPage locale="en" slug={(await params).slug} />;
}
