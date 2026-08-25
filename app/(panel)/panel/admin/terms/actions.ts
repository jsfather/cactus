"use server";

import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { termEnrollments, termLevels, termPrerequisites, termSchedules, termTeachers, terms, users } from "@/lib/db/schema";
import { schedulesOverlap } from "@/lib/terms/schedule";
import { readTermFormData, termSchema } from "@/lib/terms/validation";

export type TermFormState = { error?: string; fieldErrors?: Record<string, string[]> };
export type TermMutationState = { error?: string; success?: string };

function refreshTermPaths(termId?: string) {
  revalidatePath("/panel/admin/terms");
  revalidatePath("/panel/teacher/terms");
  revalidatePath("/panel/teacher/schedule");
  revalidatePath("/panel/student/schedule");
  if (termId) {
    revalidatePath(`/panel/admin/terms/${termId}/edit`);
    revalidatePath(`/panel/teacher/terms/${termId}`);
  }
}

async function validateRelations(
  transaction: Parameters<Parameters<ReturnType<typeof getDatabase>["transaction"]>[0]>[0],
  data: z.infer<typeof termSchema>,
  termId?: string,
) {
  const locale = data.locale;
  const [[level], teacherRows, prerequisiteRows] = await Promise.all([
    transaction.select({ id: termLevels.id }).from(termLevels).where(eq(termLevels.id, data.levelId)).limit(1),
    transaction.select({ id: users.id }).from(users).where(and(inArray(users.id, data.teacherIds), eq(users.role, "teacher"), eq(users.isActive, true))),
    data.prerequisiteIds.length ? transaction.select({ id: terms.id }).from(terms).where(inArray(terms.id, data.prerequisiteIds)) : Promise.resolve([]),
  ]);
  if (!level) return locale === "fa" ? "سطح انتخاب‌شده معتبر نیست." : "The selected level is invalid.";
  if (teacherRows.length !== data.teacherIds.length) return locale === "fa" ? "همه مدرس‌های انتخاب‌شده باید حساب فعال مدرسی داشته باشند." : "Every selected teacher must have an active teacher account.";
  if (prerequisiteRows.length !== data.prerequisiteIds.length) return locale === "fa" ? "یکی از ترم‌های پیش‌نیاز معتبر نیست." : "One of the prerequisite terms is invalid.";
  if (termId && data.prerequisiteIds.includes(termId)) return locale === "fa" ? "یک ترم نمی‌تواند پیش‌نیاز خودش باشد." : "A term cannot be its own prerequisite.";

  if (termId && data.prerequisiteIds.length) {
    const cycle = await transaction.execute(sql`
      with recursive prerequisite_chain(id) as (
        select prerequisite_term_id from term_prerequisites where term_id in (${sql.join(data.prerequisiteIds.map((id) => sql`${id}::uuid`), sql`, `)})
        union
        select tp.prerequisite_term_id from term_prerequisites tp join prerequisite_chain pc on tp.term_id = pc.id
      )
      select 1 from prerequisite_chain where id = ${termId}::uuid limit 1
    `);
    if (cycle.rows.length) return locale === "fa" ? "این انتخاب یک چرخه در پیش‌نیازها ایجاد می‌کند." : "This selection creates a prerequisite cycle.";
  }

  const conflicts = await transaction
    .select({ teacherId: termTeachers.teacherId, titleFa: terms.titleFa, titleEn: terms.titleEn, dayOfWeek: termSchedules.dayOfWeek, startTime: termSchedules.startTime, endTime: termSchedules.endTime })
    .from(termTeachers)
    .innerJoin(terms, eq(termTeachers.termId, terms.id))
    .innerJoin(termSchedules, eq(termSchedules.termId, terms.id))
    .where(and(
      inArray(termTeachers.teacherId, data.teacherIds),
      termId ? ne(terms.id, termId) : undefined,
      ne(terms.status, "cancelled"),
      ne(terms.status, "completed"),
      sql`${terms.startDate} <= ${data.endDate}::date`,
      sql`${terms.endDate} >= ${data.startDate}::date`,
    ));
  const conflict = conflicts.find((existing) => data.schedules.some((schedule) => schedulesOverlap(schedule, existing)));
  if (conflict) {
    const title = locale === "en" ? conflict.titleEn || conflict.titleFa : conflict.titleFa;
    return locale === "fa" ? `زمان یکی از مدرس‌ها با ترم «${title}» تداخل دارد.` : `A teacher's schedule conflicts with “${title}”.`;
  }

  if (termId) {
    const studentConflictRows = await transaction.execute(sql`
      select other_term.title_fa as "titleFa", other_term.title_en as "titleEn",
             other_schedule.day_of_week as "dayOfWeek", other_schedule.start_time as "startTime", other_schedule.end_time as "endTime"
      from term_enrollments current_enrollment
      join term_enrollments other_enrollment on other_enrollment.student_id = current_enrollment.student_id
        and other_enrollment.status = 'active' and other_enrollment.term_id <> ${termId}::uuid
      join terms other_term on other_term.id = other_enrollment.term_id
      join term_schedules other_schedule on other_schedule.term_id = other_term.id
      where current_enrollment.term_id = ${termId}::uuid and current_enrollment.status = 'active'
        and other_term.status not in ('cancelled', 'completed')
        and other_term.start_date <= ${data.endDate}::date and other_term.end_date >= ${data.startDate}::date
    `);
    const studentConflict = (studentConflictRows.rows as Array<{ titleFa: string; titleEn: string | null; dayOfWeek: number; startTime: string; endTime: string }>).find((existing) => data.schedules.some((schedule) => schedulesOverlap(schedule, existing)));
    if (studentConflict) {
      const title = locale === "en" ? studentConflict.titleEn || studentConflict.titleFa : studentConflict.titleFa;
      return locale === "fa" ? `برنامه یکی از دانش پژوهان با ترم «${title}» تداخل دارد.` : `A student's schedule conflicts with “${title}”.`;
    }
  }
  return null;
}

async function saveTerm(termId: string | null, creatorId: string, data: z.infer<typeof termSchema>) {
  return getDatabase().transaction(async (transaction) => {
    if (termId) await transaction.execute(sql`select id from terms where id = ${termId}::uuid for update`);
    const relationError = await validateRelations(transaction, data, termId ?? undefined);
    if (relationError) return { error: relationError };

    if (termId && data.capacity !== null) {
      const [count] = await transaction.select({ value: sql<number>`count(*)::int` }).from(termEnrollments).where(and(eq(termEnrollments.termId, termId), eq(termEnrollments.status, "active")));
      if (count.value > data.capacity) return { error: data.locale === "fa" ? "ظرفیت نمی‌تواند کمتر از تعداد دانش پژوهان فعال باشد." : "Capacity cannot be lower than the active enrollment count." };
    }

    const values = {
      titleFa: data.titleFa,
      titleEn: data.titleEn || null,
      descriptionFa: data.descriptionFa || null,
      descriptionEn: data.descriptionEn || null,
      levelId: data.levelId,
      status: data.status,
      deliveryMode: data.deliveryMode,
      startDate: data.startDate,
      endDate: data.endDate,
      capacity: data.capacity,
      tuitionToman: data.tuitionToman,
      locationFa: data.locationFa || null,
      locationEn: data.locationEn || null,
      meetingUrl: data.meetingUrl || null,
      updatedAt: new Date(),
    };
    let savedId = termId;
    if (termId) {
      const updated = await transaction.update(terms).set(values).where(eq(terms.id, termId)).returning({ id: terms.id });
      if (!updated.length) return { error: data.locale === "fa" ? "ترم پیدا نشد." : "The term was not found." };
      await Promise.all([
        transaction.delete(termTeachers).where(eq(termTeachers.termId, termId)),
        transaction.delete(termPrerequisites).where(eq(termPrerequisites.termId, termId)),
        transaction.delete(termSchedules).where(eq(termSchedules.termId, termId)),
      ]);
    } else {
      const [created] = await transaction.insert(terms).values({ ...values, creatorId }).returning({ id: terms.id });
      savedId = created.id;
    }
    if (!savedId) throw new Error("Term identifier was not created.");
    await transaction.insert(termTeachers).values(data.teacherIds.map((teacherId) => ({ termId: savedId!, teacherId, assignedById: creatorId })));
    if (data.prerequisiteIds.length) await transaction.insert(termPrerequisites).values(data.prerequisiteIds.map((prerequisiteTermId) => ({ termId: savedId!, prerequisiteTermId })));
    await transaction.insert(termSchedules).values(data.schedules.map((schedule) => ({ termId: savedId!, ...schedule })));
    return { id: savedId };
  });
}

export async function createTerm(_state: TermFormState, formData: FormData): Promise<TermFormState> {
  const admin = await requireRole("admin");
  const parsed = termSchema.safeParse(readTermFormData(formData));
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  if (!parsed.success) return { error: locale === "fa" ? "اطلاعات ترم، مدرس‌ها و برنامه هفتگی را بررسی کنید." : "Review the term, teachers, and weekly schedule.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  try {
    const result = await saveTerm(null, admin.id, parsed.data);
    if (result.error) return { error: result.error };
    refreshTermPaths(result.id);
    redirect(`/panel/admin/terms/${result.id}/edit?toast=created`);
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: locale === "fa" ? "یکی از زمان‌های هفتگی تکراری است." : "One of the weekly meeting times is duplicated." };
    return { error: locale === "fa" ? "ترم ذخیره نشد." : "The term could not be saved." };
  }
}

export async function updateTerm(termIdValue: string, _state: TermFormState, formData: FormData): Promise<TermFormState> {
  const admin = await requireRole("admin");
  const termId = z.uuid().safeParse(termIdValue);
  const parsed = termSchema.safeParse(readTermFormData(formData));
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  if (!termId.success || !parsed.success) return { error: locale === "fa" ? "اطلاعات ترم، مدرس‌ها و برنامه هفتگی را بررسی کنید." : "Review the term, teachers, and weekly schedule.", fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  try {
    const result = await saveTerm(termId.data, admin.id, parsed.data);
    if (result.error) return { error: result.error };
    refreshTermPaths(termId.data);
    redirect(`/panel/admin/terms/${termId.data}/edit?toast=updated`);
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) return { error: locale === "fa" ? "یکی از زمان‌های هفتگی تکراری است." : "One of the weekly meeting times is duplicated." };
    return { error: locale === "fa" ? "ترم به‌روزرسانی نشد." : "The term could not be updated." };
  }
}

export async function deleteTerm(termIdValue: string, locale: "fa" | "en"): Promise<TermMutationState> {
  await requireRole("admin");
  const termId = z.uuid().safeParse(termIdValue);
  if (!termId.success) return { error: locale === "fa" ? "شناسه ترم معتبر نیست." : "The term identifier is invalid." };
  try {
    const removed = await getDatabase().delete(terms).where(eq(terms.id, termId.data)).returning({ id: terms.id });
    if (!removed.length) return { error: locale === "fa" ? "ترم پیدا نشد." : "The term was not found." };
  } catch (error) {
    if (hasPostgresErrorCode(error, "23503")) return { error: locale === "fa" ? "این ترم پیش‌نیاز ترم دیگری است و فعلاً قابل حذف نیست." : "This term is a prerequisite for another term and cannot be deleted." };
    return { error: locale === "fa" ? "ترم حذف نشد." : "The term could not be deleted." };
  }
  refreshTermPaths(termId.data);
  return { success: locale === "fa" ? "ترم حذف شد." : "Term deleted." };
}
