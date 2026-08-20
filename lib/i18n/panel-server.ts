import "server-only";

import { cookies } from "next/headers";
import type { Locale } from "./config";
import { PANEL_LOCALE_COOKIE } from "./panel";

export async function getPanelLocale(): Promise<Locale> {
  return (await cookies()).get(PANEL_LOCALE_COOKIE)?.value === "en" ? "en" : "fa";
}
