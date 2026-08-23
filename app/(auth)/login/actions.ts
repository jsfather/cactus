"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/auth/session";
import { localizePath } from "@/lib/i18n/config";
import { getPreferredLocale } from "@/lib/i18n/server";

export async function logout() {
  const locale = await getPreferredLocale();
  await deleteSession();
  redirect(localizePath(locale, "/"));
}
