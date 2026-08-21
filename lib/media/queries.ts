import "server-only";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { mediaAssets, users } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import type { MediaKind } from "@/lib/db/schema";
import {
  ADMIN_PAGE_SIZE,
  escapeLikePattern,
  normalizePage,
  type AdminListQuery,
  type PaginatedResult,
} from "@/lib/panel/pagination";

export async function getAdminMediaAssets(
  locale: Locale,
  query: AdminListQuery & { kind: "all" | MediaKind },
): Promise<PaginatedResult<{
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  kind: MediaKind;
  altFa: string | null;
  altEn: string | null;
  createdAt: Date;
  uploaderName: string;
}>> {
  const database = getDatabase();
  const pattern = `%${escapeLikePattern(query.q)}%`;
  const where = and(
    query.kind === "all" ? undefined : eq(mediaAssets.kind, query.kind),
    query.q
      ? or(
          ilike(mediaAssets.originalName, pattern),
          ilike(mediaAssets.mimeType, pattern),
          ilike(mediaAssets.altFa, pattern),
          ilike(mediaAssets.altEn, pattern),
          sql`concat_ws(' ', ${users.firstNameFa}, ${users.lastNameFa}) ILIKE ${pattern}`,
          sql`concat_ws(' ', ${users.firstNameEn}, ${users.lastNameEn}) ILIKE ${pattern}`,
        )
      : undefined,
  );
  const [{ total }] = await database
    .select({ total: sql<number>`count(*)::int` })
    .from(mediaAssets)
    .innerJoin(users, eq(mediaAssets.uploaderId, users.id))
    .where(where);
  const { page, pageCount } = normalizePage(query.page, total);
  const items = await database
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
    .where(where)
    .orderBy(desc(mediaAssets.createdAt))
    .limit(ADMIN_PAGE_SIZE)
    .offset((page - 1) * ADMIN_PAGE_SIZE);

  return { items, page, pageCount, pageSize: ADMIN_PAGE_SIZE, total };
}

export async function getAdminMediaAsset(id: string) {
  const [asset] = await getDatabase().select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  return asset ?? null;
}
