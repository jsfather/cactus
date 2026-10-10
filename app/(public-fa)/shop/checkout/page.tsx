import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import { connection } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { CartCheckout } from "@/components/workflows/cart";
import { PublicShell } from "@/components/public/discovery-pages";
export const metadata: Metadata = {
  title: "سبد خرید",
  robots: { index: false, follow: false },
};
export default async function Page() {
  await connection();
  await requireUser("/shop/checkout");
  return (
    <PublicShell locale="fa" path="/shop/checkout" heading="سبد خرید">
      <CartCheckout locale="fa" requestKey={randomUUID()} />
    </PublicShell>
  );
}
