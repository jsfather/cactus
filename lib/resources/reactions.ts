"use server";
import { and, eq, lte } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser, requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  contentReactions,
  posts,
  coursePages,
  comments,
} from "@/lib/db/schema";
import {
  saved,
  denied,
  validationError,
  type ActionState,
} from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
export async function reactToContent(
  kind: "post" | "course",
  id: string,
  value: number,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireUser();
  if (
    !z.enum(["post", "course"]).safeParse(kind).success ||
    !z.uuid().safeParse(id).success ||
    !z
      .number()
      .int()
      .min(0)
      .max(kind === "post" ? 2 : 5)
      .safeParse(value).success
  )
    return denied(locale);
  const db = getDatabase();
  const [target] =
    kind === "post"
      ? await db
          .select({ id: posts.id })
          .from(posts)
          .where(
            and(
              eq(posts.id, id),
              eq(posts.status, "published"),
              lte(posts.publishedAt, new Date()),
            ),
          )
      : await db
          .select({ id: coursePages.id })
          .from(coursePages)
          .where(
            and(eq(coursePages.id, id), eq(coursePages.status, "published")),
          );
  if (!target) return denied(locale);
  const column =
    kind === "post" ? contentReactions.postId : contentReactions.courseId;
  if (!value)
    await db
      .delete(contentReactions)
      .where(and(eq(contentReactions.userId, user.id), eq(column, id)));
  else
    await db
      .insert(contentReactions)
      .values({
        userId: user.id,
        postId: kind === "post" ? id : null,
        courseId: kind === "course" ? id : null,
        value,
      })
      .onConflictDoUpdate({
        target: [contentReactions.userId, column],
        set: { value },
      });
  revalidatePath("/", "layout");
  return saved(locale);
}
export async function replyToComment(
  id: string,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireRole("admin");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  if (!z.uuid().safeParse(id).success) return denied(locale);
  const parsed = z
    .object({ replyFa: z.string().max(10000), replyEn: z.string().max(10000) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  await getDatabase()
    .update(comments)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(comments.id, id));
  revalidatePath("/", "layout");
  return saved(locale);
}
