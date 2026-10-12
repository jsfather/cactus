import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { appSettings } from "@/lib/db/schema";
import { getDatabase } from "@/lib/db/client";
import { appearanceSchema, defaultAppearance } from "./appearance";
export const getSiteAppearance = cache(async () => {
  const [row] = await getDatabase()
    .select()
    .from(appSettings)
    .where(eq(appSettings.key, "site.appearance"));
  try {
    const parsed = appearanceSchema.safeParse(JSON.parse(row?.value ?? "null"));
    return parsed.success ? parsed.data : defaultAppearance;
  } catch {
    return defaultAppearance;
  }
});
