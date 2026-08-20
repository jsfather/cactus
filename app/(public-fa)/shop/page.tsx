import type { Metadata } from "next";
import { ShopIndexPage } from "@/components/public/shop-index-page";
export const metadata: Metadata = { title: "فروشگاه" };
export default function Page() { return <ShopIndexPage locale="fa" />; }
