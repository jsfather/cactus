import type { Locale } from "./config";
import { getPreferredLocale } from "./server";

export async function getPanelLocale(): Promise<Locale> {
  return getPreferredLocale();
}
