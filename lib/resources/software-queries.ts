import "server-only";
import { and, eq, like } from "drizzle-orm";
import { cache } from "react";
import { z } from "zod";
import { getDatabase } from "@/lib/db/client";
import { appSettings, resources } from "@/lib/db/schema";
import { parseSoftwareMetadata, softwareSettingKey } from "./software";

export const getSoftwareMetadata = cache(async (id: string) => {
  const [setting] = await getDatabase()
    .select()
    .from(appSettings)
    .where(eq(appSettings.key, softwareSettingKey(id)))
    .limit(1);
  return parseSoftwareMetadata(setting?.value);
});
export const getPublishedSoftware = cache(async (id: string) => {
  if (!z.uuid().safeParse(id).success) return null;
  const [item] = await getDatabase()
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.id, id),
        eq(resources.kind, "requirements"),
        eq(resources.status, "published"),
        eq(resources.audience, "all"),
      ),
    )
    .limit(1);
  return item ?? null;
});
export async function getSoftwareMetadataMap() {
  const settings = await getDatabase()
    .select()
    .from(appSettings)
    .where(like(appSettings.key, "software.%"));
  return new Map(
    settings.map((setting) => [
      setting.key.slice(9),
      parseSoftwareMetadata(setting.value),
    ]),
  );
}
