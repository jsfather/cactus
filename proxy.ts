import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";

const cookieOptions = {
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  priority: "medium" as const,
};

export function proxy(request: NextRequest) {
  const locale: Locale = request.nextUrl.pathname === "/en" ||
    request.nextUrl.pathname.startsWith("/en/")
    ? "en"
    : "fa";

  if (request.cookies.get(LOCALE_COOKIE)?.value === locale) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, locale, cookieOptions);
  return response;
}

export const config = {
  matcher: ["/courses/:path*", "/search", "/requirements", "/teachers/:path*", "/honors/:path*", "/about", "/", "/blog/:path*", "/shop/:path*", "/en", "/en/:path*"],
};
