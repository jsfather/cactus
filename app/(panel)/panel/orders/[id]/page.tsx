import { OrdersPage } from "@/components/workflows/order-pages";
export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string; payment?: string }> }) {
  const query = await searchParams;
  const paymentNotice = ["paid", "failed", "cancelled", "retry", "invalid"].includes(query.payment ?? "") ? query.payment : "";
  return <OrdersPage id={(await params).id} created={query.created === "1"} paymentNotice={paymentNotice} />;
}
