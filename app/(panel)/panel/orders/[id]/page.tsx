import { OrdersPage } from "@/components/workflows/order-pages";
export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  return <OrdersPage id={(await params).id} created={(await searchParams).created === "1"} />;
}
