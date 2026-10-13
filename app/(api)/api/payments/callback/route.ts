import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/commerce/verification";
import { revalidatePath } from "next/cache";
export async function GET(request: NextRequest) {
  const authority = request.nextUrl.searchParams.get("Authority") ?? "";
  const callbackStatus = request.nextUrl.searchParams.get("Status");
  const origin = process.env.SITE_URL || request.nextUrl.origin;
  if (!/^A[\w-]{10,99}$/.test(authority))
    return NextResponse.redirect(
      new URL("/panel/orders?payment=invalid", origin),
    );
  try {
    const result = await verifyPayment(authority);
    revalidatePath("/panel", "layout");
    return NextResponse.redirect(
      new URL(
        result
          ? `/panel/orders/${result.orderId}?payment=${result.status === "paid" ? "paid" : result.status === "failed" ? (callbackStatus === "NOK" ? "cancelled" : "failed") : "retry"}`
          : "/panel/orders?payment=invalid",
        origin,
      ),
    );
  } catch {
    return NextResponse.redirect(
      new URL("/panel/orders?payment=retry", origin),
    );
  }
}
