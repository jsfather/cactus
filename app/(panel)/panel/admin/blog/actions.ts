"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";

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
  contentFa: z.string().trim().min(20),
  contentEn: z.string().trim(),
  coverImageUrl: z.union([z.literal(""), z.url()]),
  status: z.enum(["draft", "published"]),
});

export type CreatePostState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export type PostFormState = CreatePostState;

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
  });

  if (!parsed.success) {
    return {
      error: "لطفاً اطلاعات نوشته را بررسی کنید.",
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
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return { error: "این نشانی قبلاً برای نوشته دیگری استفاده شده است." };
    }

    throw error;
  }

  revalidateBlogPages();
  redirect("/panel/admin/blog");
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
  });

  if (!validPostId.success || !parsed.success) {
    return {
      error: "لطفاً اطلاعات نوشته را بررسی کنید.",
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
    return { error: "این نوشته دیگر وجود ندارد." };
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
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return { error: "این نشانی قبلاً برای نوشته دیگری استفاده شده است." };
    }

    throw error;
  }

  revalidateBlogPages();
  redirect("/panel/admin/blog");
}

export async function deletePost(formData: FormData) {
  await requireRole("admin");

  const postId = z.uuid().safeParse(formData.get("postId"));

  if (!postId.success) {
    return;
  }

  await getDatabase().delete(posts).where(eq(posts.id, postId.data));
  revalidateBlogPages();
}
