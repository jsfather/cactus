"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { richTextLength, sanitizeRichText } from "@/lib/content/rich-text";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { posts } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { isAllowedImageReference } from "@/lib/media/reference";

const slugPattern = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

const postSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .transform((value) => value.toLowerCase().replace(/\s+/g, "-"))
    .refine((value) => slugPattern.test(value)),
  titleFa: z.string().trim().min(3).max(240),
  titleEn: z.string().trim().max(240),
  excerptFa: z.string().trim().min(10).max(600),
  excerptEn: z.string().trim().max(600),
  contentFa: z.string().transform(sanitizeRichText).refine((value) => richTextLength(value) >= 20),
  contentEn: z.string().transform(sanitizeRichText),
  coverImageUrl: z.string().trim().max(2048).refine(isAllowedImageReference),
  status: z.enum(["draft", "published"]),
  locale: z.enum(["fa", "en"]),
});

export type CreatePostState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export type PostFormState = CreatePostState;
export type DeletePostState = { error?: string; success?: string };

function revalidateBlogPages() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/en");
  revalidatePath("/en/blog");
  revalidatePath("/panel/admin/blog");
}

export async function createPost(
  _previousState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const admin = await requireRole("admin");
  const parsed = postSchema.safeParse({
    slug: formData.get("slug"),
    titleFa: formData.get("titleFa"),
    titleEn: formData.get("titleEn"),
    excerptFa: formData.get("excerptFa"),
    excerptEn: formData.get("excerptEn"),
    contentFa: formData.get("contentFa"),
    contentEn: formData.get("contentEn"),
    coverImageUrl: formData.get("coverImageUrl"),
    status: formData.get("status"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    return {
      error: formData.get("locale") === "en" ? "Please review the post information." : "لطفاً اطلاعات نوشته را بررسی کنید.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await getDatabase().insert(posts).values({
      slug: data.slug,
      titleFa: data.titleFa,
      titleEn: data.titleEn || null,
      excerptFa: data.excerptFa,
      excerptEn: data.excerptEn || null,
      contentFa: data.contentFa,
      contentEn: data.contentEn || null,
      coverImageUrl: data.coverImageUrl || null,
      status: data.status,
      publishedAt: data.status === "published" ? new Date() : null,
      authorId: admin.id,
    });
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) {
      return { error: data.locale === "en" ? "This post URL is already in use." : "این نشانی قبلاً برای نوشته دیگری استفاده شده است." };
    }

    throw error;
  }

  revalidateBlogPages();
  redirect("/panel/admin/blog?toast=created");
}

export async function updatePost(
  postId: string,
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireRole("admin");

  const validPostId = z.uuid().safeParse(postId);
  const parsed = postSchema.safeParse({
    slug: formData.get("slug"),
    titleFa: formData.get("titleFa"),
    titleEn: formData.get("titleEn"),
    excerptFa: formData.get("excerptFa"),
    excerptEn: formData.get("excerptEn"),
    contentFa: formData.get("contentFa"),
    contentEn: formData.get("contentEn"),
    coverImageUrl: formData.get("coverImageUrl"),
    status: formData.get("status"),
    locale: formData.get("locale"),
  });

  if (!validPostId.success || !parsed.success) {
    return {
      error: formData.get("locale") === "en" ? "Please review the post information." : "لطفاً اطلاعات نوشته را بررسی کنید.",
      fieldErrors: parsed.success
        ? undefined
        : z.flattenError(parsed.error).fieldErrors,
    };
  }

  const database = getDatabase();
  const [existingPost] = await database
    .select({ publishedAt: posts.publishedAt })
    .from(posts)
    .where(eq(posts.id, validPostId.data))
    .limit(1);

  if (!existingPost) {
    return { error: formData.get("locale") === "en" ? "This post no longer exists." : "این نوشته دیگر وجود ندارد." };
  }

  const data = parsed.data;

  try {
    await database
      .update(posts)
      .set({
        slug: data.slug,
        titleFa: data.titleFa,
        titleEn: data.titleEn || null,
        excerptFa: data.excerptFa,
        excerptEn: data.excerptEn || null,
        contentFa: data.contentFa,
        contentEn: data.contentEn || null,
        coverImageUrl: data.coverImageUrl || null,
        status: data.status,
        publishedAt:
          data.status === "published"
            ? existingPost.publishedAt ?? new Date()
            : null,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, validPostId.data));
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) {
      return { error: data.locale === "en" ? "This post URL is already in use." : "این نشانی قبلاً برای نوشته دیگری استفاده شده است." };
    }

    throw error;
  }

  revalidateBlogPages();
  redirect("/panel/admin/blog?toast=updated");
}

export async function deletePost(postIdValue: string, locale: Locale): Promise<DeletePostState> {
  await requireRole("admin");

  const postId = z.uuid().safeParse(postIdValue);

  if (!postId.success) {
    return { error: locale === "fa" ? "شناسه نوشته معتبر نیست." : "The post identifier is invalid." };
  }

  try {
    await getDatabase().delete(posts).where(eq(posts.id, postId.data));
  } catch {
    return { error: locale === "fa" ? "حذف نوشته انجام نشد. دوباره تلاش کنید." : "The post could not be deleted. Please try again." };
  }
  revalidateBlogPages();
  return { success: locale === "fa" ? "نوشته حذف شد." : "Post deleted." };
}
