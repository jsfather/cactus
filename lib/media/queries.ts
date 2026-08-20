import "server-only";

import { desc, eq, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { mediaAssets, users } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

export function getAdminMediaAssets(locale: Locale) {
  return getDatabase()
    .select({
      id: mediaAssets.id,
      url: mediaAssets.url,
      originalName: mediaAssets.originalName,
      mimeType: mediaAssets.mimeType,
      size: mediaAssets.size,
      kind: mediaAssets.kind,
      altFa: mediaAssets.altFa,
      altEn: mediaAssets.altEn,
      createdAt: mediaAssets.createdAt,
      uploaderName: locale === "fa"
        ? sql<string>`concat_ws(' ', ${users.firstNameFa}, ${users.lastNameFa})`
        : sql<string>`concat_ws(' ', ${users.firstNameEn}, ${users.lastNameEn})`,
    })
    .from(mediaAssets)
    .innerJoin(users, eq(mediaAssets.uploaderId, users.id))
    .orderBy(desc(mediaAssets.createdAt));
}

export async function getAdminMediaAsset(id: string) {
  const [asset] = await getDatabase().select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  return asset ?? null;
}
