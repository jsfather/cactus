import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { appSettings } from "@/lib/db/schema";
import { defaultNavigation, navigationSchema } from "./navigation";

export const getSiteNavigation = cache(async () => {
  const [setting] = await getDatabase()
    .select({ value: appSettings.value })
    .from(appSettings)
    .where(eq(appSettings.key, "site.navigation"));
  try {
    const parsed = navigationSchema.safeParse(
      JSON.parse(setting?.value ?? "null"),
    );
    return parsed.success ? parsed.data : defaultNavigation;
  } catch {
    return defaultNavigation;
  }
});
