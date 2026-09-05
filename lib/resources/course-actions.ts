"use server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { coursePages } from "@/lib/db/schema";
import { sanitizeRichText } from "@/lib/content/rich-text";
import {
  optionalUrl,
  validationError,
  saved,
  failed,
  type ActionState,
} from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
const short = z.string().trim().max(240);
const long = z.string().max(100000);
const sectionsSchema = z.object({
  syllabus: z
    .array(
      z.object({
        titleFa: short.min(1),
        titleEn: short,
        itemsFa: long,
        itemsEn: long,
      }),
    )
    .max(100),
  faqs: z
    .array(
      z.object({
        questionFa: short.min(1),
        questionEn: short,
        answerFa: long,
        answerEn: long,
      }),
    )
    .max(100),
  tools: z
    .array(z.object({ nameFa: short.min(1), nameEn: short, url: optionalUrl }))
    .max(100),
  testimonials: z
    .array(z.object({ name: short.min(1), videoUrl: optionalUrl }))
    .max(100),
  blogIds: z.array(z.uuid()).max(50),
});
const schema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  termId: z.union([z.uuid(), z.literal("")]),
  titleFa: short.min(2),
  titleEn: short,
  summaryFa: long.min(2),
  summaryEn: long,
  contentFa: long.min(2),
  contentEn: long,
  topic: short.min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  ageGroup: short.min(1),
  duration: short.min(1),
  coverImageUrl: optionalUrl,
  videoUrl: optionalUrl,
  certificateImageUrl: optionalUrl,
  status: z.enum(["draft", "published"]),
  isFeatured: z.enum(["true", "false"]).transform((v) => v === "true"),
  sections: sectionsSchema,
});
export async function saveCourse(
  id: string | null,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireRole("admin");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  let sections: unknown;
  try {
    sections = JSON.parse(String(form.get("sections")));
  } catch {
    return failed(locale);
  }
  const parsed = schema.safeParse({ ...Object.fromEntries(form), sections });
  if (!parsed.success) return validationError(locale, parsed.error);
  if (id && !z.uuid().safeParse(id).success) return failed(locale);
  const data = {
    ...parsed.data,
    termId: parsed.data.termId || null,
    contentFa: sanitizeRichText(parsed.data.contentFa),
    contentEn: sanitizeRichText(parsed.data.contentEn),
    updatedAt: new Date(),
  };
  try {
    if (id)
      await getDatabase()
        .update(coursePages)
        .set(data)
        .where(eq(coursePages.id, id));
    else await getDatabase().insert(coursePages).values(data);
  } catch {
    return failed(locale);
  }
  revalidatePath("/", "layout");
  redirect("/panel/admin/courses?saved=1");
}
export async function deleteCourse(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  await requireRole("admin");
  if (!z.uuid().safeParse(id).success) return failed(locale);
  await getDatabase().delete(coursePages).where(eq(coursePages.id, id));
  revalidatePath("/", "layout");
  return saved(locale);
}
