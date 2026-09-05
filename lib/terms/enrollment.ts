import { and, eq, ne, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { termEnrollments, termSchedules, terms, users } from "@/lib/db/schema";
import { schedulesOverlap } from "@/lib/terms/schedule";
import type { Locale } from "@/lib/i18n/config";
type Transaction = Parameters<Parameters<ReturnType<typeof getDatabase>["transaction"]>[0]>[0];
export async function enrollStudent(
  transaction: Transaction,
  termId: string,
  studentId: string,
  enrolledById: string | null,
  source: "direct" | "invitation",
  locale: Locale,
  dryRun = false,
) {
  await transaction.execute(sql`select id from terms where id = ${termId}::uuid for update`);
  const [[term], [student], [existing]] = await Promise.all([
    transaction.select().from(terms).where(eq(terms.id, termId)).limit(1),
    transaction.select({ id: users.id }).from(users).where(and(eq(users.id, studentId), eq(users.role, "student"), eq(users.isActive, true))).limit(1),
    transaction.select({ id: termEnrollments.id, status: termEnrollments.status }).from(termEnrollments).where(and(eq(termEnrollments.termId, termId), eq(termEnrollments.studentId, studentId))).limit(1),
  ]);
  if (!term) return { error: locale === "fa" ? "ترم پیدا نشد." : "The term was not found." };
  if (!student) return { error: locale === "fa" ? "دانش پژوه باید یک حساب فعال دانش پژوهی داشته باشد." : "The student must have an active student account." };
  if (term.status === "cancelled" || term.status === "completed" || (source === "invitation" && term.status !== "enrollment_open")) {
    return { error: locale === "fa" ? "ثبت‌نام در وضعیت فعلی این ترم امکان‌پذیر نیست." : "Enrollment is not available for this term right now." };
  }
  if (existing?.status === "active") return { error: locale === "fa" ? "این دانش پژوه قبلاً در ترم ثبت‌نام شده است." : "This student is already enrolled in the term." };
  if (existing?.status === "completed") return { error: locale === "fa" ? "این دانش پژوه قبلاً این ترم را تکمیل کرده است." : "This student has already completed this term." };

  const [missing] = await transaction.execute(sql`
    select count(*)::int as count
    from term_prerequisites prerequisite
    where prerequisite.term_id = ${termId}::uuid
      and not exists (
        select 1 from term_enrollments enrollment
        where enrollment.term_id = prerequisite.prerequisite_term_id
          and enrollment.student_id = ${studentId}::uuid
          and enrollment.status = 'completed'
      )
  `).then((result) => result.rows as Array<{ count: number }>);
  if (Number(missing?.count ?? 0) > 0) return { error: locale === "fa" ? "دانش پژوه هنوز همه پیش‌نیازهای این ترم را تکمیل نکرده است." : "The student has not completed every prerequisite for this term." };

  if (term.capacity !== null) {
    const [count] = await transaction.select({ value: sql<number>`count(*)::int` }).from(termEnrollments).where(and(eq(termEnrollments.termId, termId), eq(termEnrollments.status, "active")));
    const reserved = await transaction.execute(sql`select count(distinct o.user_id)::int as count from orders o join order_items i on i.order_id=o.id where i.term_id=${termId}::uuid and o.status='pending' and o.payment_status='pending' and o.user_id<>${studentId}::uuid`);
    if (count.value + Number(reserved.rows[0]?.count ?? 0) >= term.capacity) return { error: locale === "fa" ? "ظرفیت ترم تکمیل شده است." : "The term is at capacity." };
  }

  const [targetSchedules, conflicts] = await Promise.all([
    transaction.select({ dayOfWeek: termSchedules.dayOfWeek, startTime: termSchedules.startTime, endTime: termSchedules.endTime }).from(termSchedules).where(eq(termSchedules.termId, termId)),
    transaction.select({ titleFa: terms.titleFa, titleEn: terms.titleEn, dayOfWeek: termSchedules.dayOfWeek, startTime: termSchedules.startTime, endTime: termSchedules.endTime })
      .from(termEnrollments)
      .innerJoin(terms, eq(termEnrollments.termId, terms.id))
      .innerJoin(termSchedules, eq(termSchedules.termId, terms.id))
      .where(and(eq(termEnrollments.studentId, studentId), eq(termEnrollments.status, "active"), ne(terms.id, termId), ne(terms.status, "cancelled"), ne(terms.status, "completed"), sql`${terms.startDate} <= ${term.endDate}::date`, sql`${terms.endDate} >= ${term.startDate}::date`)),
  ]);
  const conflict = conflicts.find((item) => targetSchedules.some((target) => schedulesOverlap(item, target)));
  if (conflict) {
    const title = locale === "en" ? conflict.titleEn || conflict.titleFa : conflict.titleFa;
    return { error: locale === "fa" ? `برنامه دانش پژوه با ترم «${title}» تداخل دارد.` : `The student's schedule conflicts with “${title}”.` };
  }

  if (dryRun) return { success: true };

  if (existing) {
    await transaction.update(termEnrollments).set({ status: "active", source, enrolledById, enrolledAt: new Date(), updatedAt: new Date() }).where(eq(termEnrollments.id, existing.id));
  } else {
    await transaction.insert(termEnrollments).values({ termId, studentId, source, enrolledById });
  }
  return { success: true };
}

