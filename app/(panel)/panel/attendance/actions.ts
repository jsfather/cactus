"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  sessionStudentRecords,
  termEnrollments,
  termSessions,
  termTeachers,
  terms,
} from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

export type SessionRecordActionState = {
  error?: string;
  success?: string;
  revision?: number;
};

const attendanceSchema = z.enum(["present", "absent", "late", "excused"]);
const recordSchema = z.object({
  studentId: z.uuid(),
  attendance: attendanceSchema.nullable(),
  grade: z.number().min(0).max(1000).nullable(),
  note: z.string().trim().max(500).nullable(),
});
const payloadSchema = z.object({
  sessionId: z.uuid(),
  locale: z.enum(["fa", "en"]),
  gradeMax: z.coerce.number().positive().max(1000),
  records: z.array(recordSchema).max(1000),
}).superRefine((value, context) => {
  const seen = new Set<string>();
  for (const [index, record] of value.records.entries()) {
    if (seen.has(record.studentId)) {
      context.addIssue({ code: "custom", path: ["records", index, "studentId"], message: "Duplicate student." });
    }
    seen.add(record.studentId);
    if (record.grade !== null && record.grade > value.gradeMax) {
      context.addIssue({ code: "custom", path: ["records", index, "grade"], message: "Grade exceeds the session maximum." });
    }
  }
});

async function getManagedSession(sessionId: string) {
  const user = await requireUser();
  if (user.role === "admin") {
    const [session] = await getDatabase()
      .select({ id: termSessions.id, termId: termSessions.termId, sessionDate: termSessions.sessionDate, termStatus: terms.status })
      .from(termSessions)
      .innerJoin(terms, eq(termSessions.termId, terms.id))
      .where(eq(termSessions.id, sessionId))
      .limit(1);
    return session ? { ...session, user } : null;
  }
  if (user.role !== "teacher") return null;
  const [session] = await getDatabase()
    .select({ id: termSessions.id, termId: termSessions.termId, sessionDate: termSessions.sessionDate, termStatus: terms.status })
    .from(termSessions)
    .innerJoin(terms, eq(termSessions.termId, terms.id))
    .innerJoin(
      termTeachers,
      and(eq(termTeachers.termId, termSessions.termId), eq(termTeachers.teacherId, user.id)),
    )
    .where(eq(termSessions.id, sessionId))
    .limit(1);
  return session ? { ...session, user } : null;
}

function localizedError(locale: Locale, fa: string, en: string) {
  return locale === "fa" ? fa : en;
}

export async function saveSessionRecords(
  sessionIdValue: string,
  _state: SessionRecordActionState,
  formData: FormData,
): Promise<SessionRecordActionState> {
  const locale: Locale = formData.get("locale") === "en" ? "en" : "fa";
  let records: unknown;
  try {
    records = JSON.parse(String(formData.get("records") ?? "[]"));
  } catch {
    return { error: localizedError(locale, "اطلاعات حضور و نمره معتبر نیست.", "The attendance and grade data is invalid.") };
  }
  const parsed = payloadSchema.safeParse({
    sessionId: sessionIdValue,
    locale,
    gradeMax: formData.get("gradeMax"),
    records,
  });
  if (!parsed.success) {
    const gradeIssue = parsed.error.issues.some((issue) => issue.path.at(-1) === "grade");
    return {
      error: gradeIssue
        ? localizedError(locale, "نمره هر دانش پژوه باید بین صفر و سقف نمره جلسه باشد.", "Every grade must be between zero and the session maximum.")
        : localizedError(locale, "اطلاعات جلسه را بررسی کنید.", "Review the session information."),
    };
  }

  const managed = await getManagedSession(parsed.data.sessionId);
  if (!managed) return { error: localizedError(locale, "اجازه مدیریت این جلسه را ندارید.", "You cannot manage this session.") };
  if (managed.termStatus === "cancelled") return { error: localizedError(locale, "برای ترم لغوشده نمی‌توان سابقه ثبت کرد.", "Records cannot be saved for a cancelled term.") };

  try {
    await getDatabase().transaction(async (transaction) => {
      await transaction
        .select({ id: termSessions.id })
        .from(termSessions)
        .where(eq(termSessions.id, managed.id))
        .for("update");

      const studentIds = parsed.data.records.map((record) => record.studentId);
      const enrolled = studentIds.length
        ? await transaction
            .select({ studentId: termEnrollments.studentId })
            .from(termEnrollments)
            .where(and(
              eq(termEnrollments.termId, managed.termId),
              inArray(termEnrollments.studentId, studentIds),
              sql`${termEnrollments.enrolledAt}::date <= ${managed.sessionDate}::date`,
            ))
        : [];
      if (enrolled.length !== new Set(studentIds).size) {
        throw new Error("SESSION_ROSTER_MISMATCH");
      }

      await transaction
        .update(termSessions)
        .set({ gradeMax: String(parsed.data.gradeMax), updatedAt: new Date() })
        .where(eq(termSessions.id, managed.id));

      const emptyStudentIds = parsed.data.records
        .filter((record) => record.attendance === null && record.grade === null && !record.note)
        .map((record) => record.studentId);
      if (emptyStudentIds.length) {
        await transaction.delete(sessionStudentRecords).where(and(
          eq(sessionStudentRecords.sessionId, managed.id),
          inArray(sessionStudentRecords.studentId, emptyStudentIds),
        ));
      }

      const populated = parsed.data.records.filter((record) => record.attendance !== null || record.grade !== null || record.note);
      if (populated.length) {
        await transaction
          .insert(sessionStudentRecords)
          .values(populated.map((record) => ({
            sessionId: managed.id,
            studentId: record.studentId,
            attendance: record.attendance,
            grade: record.grade === null ? null : String(record.grade),
            note: record.note || null,
            recordedById: managed.user.id,
          })))
          .onConflictDoNothing({ target: [sessionStudentRecords.sessionId, sessionStudentRecords.studentId] });

        for (const record of populated) {
          await transaction
            .update(sessionStudentRecords)
            .set({
              attendance: record.attendance,
              grade: record.grade === null ? null : String(record.grade),
              note: record.note || null,
              recordedById: managed.user.id,
              updatedAt: new Date(),
            })
            .where(and(
              eq(sessionStudentRecords.sessionId, managed.id),
              eq(sessionStudentRecords.studentId, record.studentId),
            ));
        }
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_ROSTER_MISMATCH") {
      return { error: localizedError(locale, "فهرست دانش پژوهان تغییر کرده است؛ صفحه را تازه‌سازی کنید.", "The roster changed. Refresh the page and try again.") };
    }
    return { error: localizedError(locale, "حضور و نمره‌ها ذخیره نشدند.", "Attendance and grades could not be saved.") };
  }

  revalidatePath(`/panel/admin/terms/${managed.termId}/edit`);
  revalidatePath("/panel/admin/attendance");
  revalidatePath(`/panel/admin/attendance/${managed.id}`);
  revalidatePath(`/panel/teacher/terms/${managed.termId}`);
  revalidatePath("/panel/teacher");
  revalidatePath("/panel/teacher/attendance");
  revalidatePath(`/panel/teacher/attendance/${managed.id}`);
  return {
    success: localizedError(locale, "حضور و نمره‌های جلسه ذخیره شد.", "Session attendance and grades were saved."),
    revision: Date.now(),
  };
}
