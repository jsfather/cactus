"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { landingPages, attachments, users } from "@/lib/db/schema";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { landingSchema } from "./validation";
import {
  denied,
  failed,
  saved,
  text,
  validationError,
  type ActionState,
} from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
export async function saveLanding(
  id: string | null,
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireRole("admin", "content");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  if (id && !z.uuid().safeParse(id).success) return denied(locale);
  const keys = [
    "titleFa",
    "titleEn",
    "textFa",
    "textEn",
    "labelFa",
    "labelEn",
    "href",
  ];
  const parsed = landingSchema.safeParse({
    ...Object.fromEntries(form),
    cta: Object.fromEntries(keys.map((key) => [key, form.get(`cta-${key}`)])),
  });
  if (!parsed.success) {
    const state = validationError(locale, parsed.error);
    for (const issue of parsed.error.issues)
      if (issue.path[0] === "cta")
        state.fieldErrors![`cta-${String(issue.path[1] ?? "titleFa")}`] = [
          state.error!,
        ];
    return state;
  }
  const db = getDatabase();
  let previousSlug: string | undefined;
  try {
    if (parsed.data.videoUrl.startsWith("/api/attachments/")) {
      const videoId = z.uuid().safeParse(parsed.data.videoUrl.split("/").pop());
      const [video] = videoId.success
        ? await db
            .select({ id: attachments.id })
            .from(attachments)
            .innerJoin(users, eq(users.id, attachments.uploaderId))
            .where(
              and(
                eq(attachments.id, videoId.data),
                eq(attachments.mimeType, "video/mp4"),
                eq(users.role, "admin"),
              ),
            )
            .limit(1)
        : [];
      if (!video)
        return {
          error: text(
            locale,
            "ویدیوی معتبر بارگذاری‌شده توسط مدیر را انتخاب کنید.",
            "Choose a valid video uploaded by an administrator.",
          ),
          fieldErrors: {
            videoUrl: [
              text(
                locale,
                "فایل باید MP4 و متعلق به مدیر باشد.",
                "The file must be an administrator's MP4 video.",
              ),
            ],
          },
        };
    }
    if (id) {
      const [previous] = await db
        .select({ slug: landingPages.slug })
        .from(landingPages)
        .where(eq(landingPages.id, id));
      if (!previous) return denied(locale);
      previousSlug = previous.slug;
      const rows = await db
        .update(landingPages)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(eq(landingPages.id, id))
        .returning({ id: landingPages.id });
      if (!rows.length) return denied(locale);
    } else await db.insert(landingPages).values(parsed.data);
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505"))
      return {
        error: text(
          locale,
          "این نشانی قبلاً استفاده شده است.",
          "This address is already in use.",
        ),
        fieldErrors: {
          slug: [
            text(locale, "نشانی دیگری انتخاب کنید.", "Choose another address."),
          ],
        },
      };
    return failed(locale);
  }
  for (const slug of new Set(
    [parsed.data.slug, previousSlug].filter(Boolean),
  )) {
    revalidatePath(`/${slug}`);
    revalidatePath(`/en/${slug}`);
  }
  revalidatePath("/sitemap.xml");
  revalidatePath("/panel/admin/landings");
  redirect(`/panel/admin/landings?success=${id ? "updated" : "created"}`);
}
export async function deleteLanding(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  await requireRole("admin", "content");
  if (!z.uuid().safeParse(id).success) return denied(locale);
  try {
    const [row] = await getDatabase()
      .delete(landingPages)
      .where(eq(landingPages.id, id))
      .returning({ slug: landingPages.slug });
    if (!row) return denied(locale);
    revalidatePath(`/${row.slug}`);
    revalidatePath(`/en/${row.slug}`);
  } catch {
    return failed(locale);
  }
  revalidatePath("/sitemap.xml");
  revalidatePath("/panel/admin/landings");
  revalidatePath("/panel/admin/comments");
  return saved(locale);
}
