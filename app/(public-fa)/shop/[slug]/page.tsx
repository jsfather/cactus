import { ProductPage } from "@/components/public/product-page";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <ProductPage locale="fa" slug={(await params).slug} />; }
