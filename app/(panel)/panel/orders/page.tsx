import { OrdersPage } from "@/components/workflows/order-pages";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const s = await searchParams;
  return <OrdersPage query={s.q} status={s.status} page={Number(s.page ?? 1)} />;
}
