import { NextResponse, type NextRequest } from "next/server";
import {
  LEGACY_PANEL_LOCALE_COOKIE,
  LOCALE_COOKIE,
} from "@/lib/i18n/config";

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "fa";
  const requestedReturn = request.nextUrl.searchParams.get("returnTo") || "/";
  let returnPath = "/";

  try {
    const safeOrigin = "https://cactus.local";
    const candidate = new URL(requestedReturn, safeOrigin);

    if (requestedReturn.startsWith("/") && candidate.origin === safeOrigin) {
      returnPath = `${candidate.pathname}${candidate.search}${candidate.hash}`;
    }
  } catch {}

  // Keep the redirect relative. In Docker, request.url can contain the
  // container address (0.0.0.0:3000) even when a reverse proxy provides the
  // public domain, which would otherwise leak that internal origin.
  const response = new NextResponse(null, {
    status: 307,
    headers: { Location: returnPath },
  });

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
