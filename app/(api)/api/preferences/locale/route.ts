import { NextResponse, type NextRequest } from "next/server";
import {
  LEGACY_PANEL_LOCALE_COOKIE,
  LOCALE_COOKIE,
} from "@/lib/i18n/config";

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "fa";
  const requestedReturn = request.nextUrl.searchParams.get("returnTo") || "/";
  let returnUrl = new URL("/", request.url);

  try {
    const candidate = new URL(requestedReturn, request.url);
    if (candidate.origin === request.nextUrl.origin) {
      returnUrl = candidate;
    }
  } catch {}

  const response = NextResponse.redirect(returnUrl);

  response.cookies.set(LOCALE_COOKIE, locale, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    priority: "medium",
  });
  response.cookies.set(LEGACY_PANEL_LOCALE_COOKIE, "", {
    path: "/panel",
    maxAge: 0,
  });

  return response;
}
