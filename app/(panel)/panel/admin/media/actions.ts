"use server";

import { unlink } from "node:fs/promises";
import { eq, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { honors, mediaAssets, posts, products, users } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { resolveUploadPath } from "@/lib/media/storage";

const updateSchema = z.object({
  id: z.uuid(),
  originalName: z.string().trim().min(1).max(255),
  altFa: z.string().trim().max(240),
  altEn: z.string().trim().max(240),
  locale: z.enum(["fa", "en"]),
});

export type MediaFormState = { error?: string; fieldErrors?: Record<string, string[]> };
export type DeleteMediaState = { error?: string; success?: string };

function revalidateMedia() {
  revalidatePath("/panel/admin/media");
  revalidatePath("/panel/admin");
}

export async function updateMediaAsset(assetId: string, _state: MediaFormState, formData: FormData): Promise<MediaFormState> {
  await requireRole("admin");
  const parsed = updateSchema.safeParse({ id: assetId, originalName: formData.get("originalName"), altFa: formData.get("altFa"), altEn: formData.get("altEn"), locale: formData.get("locale") });

  if (!parsed.success) {
    return { error: formData.get("locale") === "en" ? "Please review the media information." : "لطفاً اطلاعات رسانه را بررسی کنید.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const [updated] = await getDatabase().update(mediaAssets).set({
    originalName: parsed.data.originalName,
    altFa: parsed.data.altFa || null,
    altEn: parsed.data.altEn || null,
    updatedAt: new Date(),
  }).where(eq(mediaAssets.id, parsed.data.id)).returning({ id: mediaAssets.id });

  if (!updated) return { error: parsed.data.locale === "en" ? "This media item no longer exists." : "این رسانه دیگر وجود ندارد." };
  revalidateMedia();
  redirect("/panel/admin/media?toast=updated");
}

export async function deleteMediaAsset(assetIdValue: string, locale: Locale, redirectAfterDelete = false): Promise<DeleteMediaState> {
  await requireRole("admin");
  const assetId = z.uuid().safeParse(assetIdValue);
  if (!assetId.success) return { error: locale === "en" ? "The media identifier is invalid." : "شناسه رسانه معتبر نیست." };

  const database = getDatabase();
  const [asset] = await database.select({ id: mediaAssets.id, url: mediaAssets.url, pathname: mediaAssets.pathname }).from(mediaAssets).where(eq(mediaAssets.id, assetId.data)).limit(1);
  if (!asset) return { error: locale === "en" ? "This media item no longer exists." : "این رسانه دیگر وجود ندارد." };

  const pattern = `%${asset.url}%`;
  const [avatarUse, postUse, productUse, honorUse] = await Promise.all([
    database.select({ id: users.id }).from(users).where(like(users.avatarUrl, pattern)).limit(1),
    database.select({ id: posts.id }).from(posts).where(or(like(posts.coverImageUrl, pattern), like(posts.contentFa, pattern), like(posts.contentEn, pattern))).limit(1),
    database.select({ id: products.id }).from(products).where(or(like(products.coverImageUrl, pattern), like(products.contentFa, pattern), like(products.contentEn, pattern))).limit(1),
    database.select({ id: honors.id }).from(honors).where(like(honors.certificateImageUrl, pattern)).limit(1),
  ]);

  if (avatarUse.length || postUse.length || productUse.length || honorUse.length) {
    return { error: locale === "en" ? "This image is currently used by a profile or published content. Remove it there first." : "این تصویر در پروفایل یا محتوای سایت استفاده شده است. ابتدا آن را از محل استفاده حذف کنید." };
  }

  const absolutePath = resolveUploadPath(asset.pathname.split("/"));
  if (!absolutePath) {
    return { error: locale === "en" ? "The stored media path is invalid." : "مسیر ذخیره‌شده رسانه معتبر نیست." };
  }

  try {
    await unlink(absolutePath);
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
      return { error: locale === "en" ? "The media file could not be removed from storage." : "حذف فایل رسانه از فضای ذخیره‌سازی انجام نشد." };
    }
  }

  await database.delete(mediaAssets).where(eq(mediaAssets.id, asset.id));
  revalidateMedia();
  if (redirectAfterDelete) redirect("/panel/admin/media?toast=deleted");
  return { success: locale === "en" ? "Media deleted." : "رسانه حذف شد." };
}
