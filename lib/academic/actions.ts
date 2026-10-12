"use server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  academicYears,
  academicSemesters,
  courseTemplates,
  terms,
  termEnrollments,
} from "@/lib/db/schema";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import {
  validationError,
  saved,
  failed,
  denied,
  type ActionState,
} from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
const kindSchema = z.enum(["years", "semesters", "templates"]);
const baseSchema = z.object({
  titleFa: z.string().trim().min(2).max(160),
  titleEn: z.string().trim().max(160),
});
const datesSchema = baseSchema
  .extend({ startDate: z.iso.date(), endDate: z.iso.date() })
  .refine((value) => value.endDate >= value.startDate, {
    path: ["endDate"],
    message: "Invalid date range",
  });
export async function saveAcademic(
  kind: string,
  id: string | null,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireRole("admin");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  if (
    !kindSchema.safeParse(kind).success ||
    (id && !z.uuid().safeParse(id).success)
  )
    return denied(locale);
  const schema =
    kind === "templates"
      ? baseSchema.extend({
          descriptionFa: z.string().max(4000),
          descriptionEn: z.string().max(4000),
          levelId: z.uuid(),
        })
      : kind === "semesters"
        ? datesSchema.safeExtend({ yearId: z.uuid() })
        : datesSchema;
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  try {
    const db = getDatabase();
    if (kind === "years") {
      const value = datesSchema.parse(parsed.data);
      if (id) {
        const valid = await db.transaction(async (tx) => {
          await tx.execute(sql`select pg_advisory_xact_lock(924017)`);
          const semesters = await tx
            .select()
            .from(academicSemesters)
            .where(eq(academicSemesters.yearId, id));
          if (
            semesters.some(
              (semester) =>
                semester.archivedAt ||
                semester.startDate < value.startDate ||
                semester.endDate > value.endDate,
            )
          )
            return false;
          await tx
            .update(academicYears)
            .set(value)
            .where(eq(academicYears.id, id));
          return true;
        });
        if (!valid)
          return {
            error:
              locale === "fa"
                ? "سال تحصیلی باید نیمسال‌ها را پوشش دهد؛ سال دارای آرشیو قابل تغییر نیست."
                : "The year must cover its semesters; years with archived semesters cannot be edited.",
          };
      } else await db.insert(academicYears).values(value);
    } else if (kind === "semesters") {
      const value = datesSchema
        .safeExtend({ yearId: z.uuid() })
        .parse(parsed.data);
      const result = await db.transaction(async (tx) => {
        await tx.execute(sql`select pg_advisory_xact_lock(924017)`);
        const [year] = await tx
          .select()
          .from(academicYears)
          .where(eq(academicYears.id, value.yearId))
          .for("update");
        if (
          !year ||
          value.startDate < year.startDate ||
          value.endDate > year.endDate
        )
          return false;
        if (id) {
          const [old] = await tx
            .select()
            .from(academicSemesters)
            .where(eq(academicSemesters.id, id))
            .for("update");
          if (!old || old.archivedAt) return false;
          const offers = await tx
            .select({ start: terms.startDate, end: terms.endDate })
            .from(terms)
            .where(eq(terms.semesterId, id));
          if (
            offers.some(
              (offer) =>
                offer.start < value.startDate || offer.end > value.endDate,
            )
          )
            return false;
          await tx
            .update(academicSemesters)
            .set(value)
            .where(eq(academicSemesters.id, id));
        } else await tx.insert(academicSemesters).values(value);
        return true;
      });
      if (!result)
        return {
          error:
            locale === "fa"
              ? "نیمسال باید در بازه سال تحصیلی باشد و ارائه‌ها را پوشش دهد؛ آرشیو قابل تغییر نیست."
              : "Semester dates must fit the year and cover its offerings; archived semesters cannot be edited.",
        };
    } else {
      const value = baseSchema
        .extend({
          descriptionFa: z.string().max(4000),
          descriptionEn: z.string().max(4000),
          levelId: z.uuid(),
        })
        .parse(parsed.data);
      if (id) {
        const valid = await db.transaction(async (tx) => {
          await tx.execute(sql`select pg_advisory_xact_lock(924017)`);
          const [old] = await tx
            .select()
            .from(courseTemplates)
            .where(eq(courseTemplates.id, id))
            .for("update");
          const [used] = await tx
            .select({ id: terms.id })
            .from(terms)
            .where(eq(terms.courseTemplateId, id))
            .limit(1);
          if (!old || (used && old.levelId !== value.levelId)) return false;
          await tx
            .update(courseTemplates)
            .set(value)
            .where(eq(courseTemplates.id, id));
          return true;
        });
        if (!valid)
          return {
            error:
              locale === "fa"
                ? "سطح الگوی استفاده‌شده قابل تغییر نیست؛ الگوی جدید بسازید."
                : "The level of a used template cannot change; create a new template.",
          };
      } else await db.insert(courseTemplates).values(value);
    }
    revalidatePath("/panel", "layout");
    return saved(locale);
  } catch {
    return failed(locale);
  }
}
export async function deleteAcademic(
  kind: string,
  id: string,
  locale: Locale,
): Promise<ActionState> {
  await requireRole("admin");
  if (!kindSchema.safeParse(kind).success || !z.uuid().safeParse(id).success)
    return denied(locale);
  try {
    const table =
      kind === "years"
        ? academicYears
        : kind === "semesters"
          ? academicSemesters
          : courseTemplates;
    if (kind === "semesters") {
      const [semester] = await getDatabase()
        .select()
        .from(academicSemesters)
        .where(eq(academicSemesters.id, id));
      if (semester?.archivedAt) return denied(locale);
    }
    await getDatabase().delete(table).where(eq(table.id, id));
    revalidatePath("/panel", "layout");
    return saved(locale);
  } catch (error) {
    if (hasPostgresErrorCode(error, "23503"))
      return {
        error:
          locale === "fa"
            ? "این مورد سابقه وابسته دارد؛ به‌جای حذف، آن را نگه دارید."
            : "This record has dependent history and cannot be deleted.",
      };
    return failed(locale);
  }
}
export async function archiveSemester(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  await requireRole("admin");
  if (!z.uuid().safeParse(id).success) return denied(locale);
  try {
    await getDatabase().transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(924017)`);
      const [semester] = await tx
        .select()
        .from(academicSemesters)
        .where(eq(academicSemesters.id, id))
        .for("update");
      if (!semester || semester.archivedAt) return;
      const offers = await tx
        .select({ id: terms.id })
        .from(terms)
        .where(eq(terms.semesterId, id))
        .for("update");
      const now = new Date();
      if (offers.length) {
        const ids = offers.map((offer) => offer.id);
        await tx
          .update(terms)
          .set({ archivedAt: now, status: "completed", updatedAt: now })
          .where(inArray(terms.id, ids));
        await tx
          .update(termEnrollments)
          .set({ status: "completed", updatedAt: now })
          .where(
            and(
              inArray(termEnrollments.termId, ids),
              eq(termEnrollments.status, "active"),
            ),
          );
      }
      await tx
        .update(academicSemesters)
        .set({ archivedAt: now })
        .where(eq(academicSemesters.id, id));
    });
    revalidatePath("/panel", "layout");
    revalidatePath("/", "layout");
    return saved(locale);
  } catch {
    return failed(locale);
  }
}
