import "server-only";

import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE, type Locale } from "./config";

export async function getPreferredLocale(): Promise<Locale> {
  const locale = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(locale) ? locale : "fa";
}
