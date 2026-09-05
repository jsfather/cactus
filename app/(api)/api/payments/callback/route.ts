import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/commerce/verification";
export async function GET(request: NextRequest) {
  const authority = request.nextUrl.searchParams.get("Authority") ?? "";
  const origin = process.env.SITE_URL || request.nextUrl.origin;
  if (!/^A[\w-]{10,99}$/.test(authority))
    return NextResponse.redirect(
      new URL("/panel/orders?payment=invalid", origin),
    );
  try {
    const id = await verifyPayment(authority);
    return NextResponse.redirect(
      new URL(
        id
          ? `/panel/orders/${id}?payment=checked`
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
