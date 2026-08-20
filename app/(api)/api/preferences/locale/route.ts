import { NextResponse, type NextRequest } from "next/server";
import { PANEL_LOCALE_COOKIE } from "@/lib/i18n/panel";

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "fa";
  const requestedReturn = request.nextUrl.searchParams.get("returnTo") || "/panel";
  const returnTo = requestedReturn.startsWith("/panel") ? requestedReturn : "/panel";
  const response = NextResponse.redirect(new URL(returnTo, request.url));

  response.cookies.set(PANEL_LOCALE_COOKIE, locale, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/panel",
    maxAge: 60 * 60 * 24 * 365,
    priority: "medium",
  });

  return response;
}
