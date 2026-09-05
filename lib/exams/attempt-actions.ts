"use server";
import { randomInt } from "node:crypto";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  examAssignments,
  examAttempts,
  exams,
  examQuestions,
  examQuestionOptions,
  users,
  notifications,
} from "@/lib/db/schema";
import { scoreExam, validAnswers } from "./scoring";
import {
  validationError,
  saved,
  denied,
  failed,
  text,
  type ActionState,
} from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export async function assignExam(
  id: string | null,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireRole("admin");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = z
    .object({
      examId: z.uuid(),
      studentId: z.uuid(),
      availableAt: z
        .string()
        .refine((v) => !v || Number.isFinite(Date.parse(v))),
      dueAt: z.string().refine((v) => !v || Number.isFinite(Date.parse(v))),
      maxAttempts: z.coerce.number().int().min(1).max(20),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  const data = {
    ...parsed.data,
    availableAt: parsed.data.availableAt
      ? new Date(parsed.data.availableAt)
      : null,
    dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
  };
  if (data.availableAt && data.dueAt && data.availableAt >= data.dueAt)
    return failed(locale);
  const [student] = await getDatabase()
    .select()
    .from(users)
    .where(
      and(
        eq(users.id, data.studentId),
        eq(users.role, "student"),
        eq(users.isActive, true),
      ),
    );
  if (!student) return denied(locale);
  try {
    if (id) {
      if (!z.uuid().safeParse(id).success) return denied(locale);
      const changed = await getDatabase().transaction(async (tx) => {
        const [current] = await tx.select().from(examAssignments).where(eq(examAssignments.id, id)).for("update");
        if (!current) return false;
        const attempts = await tx.select({ id: examAttempts.id }).from(examAttempts).where(eq(examAttempts.assignmentId, id));
        if (attempts.length && (current.examId !== data.examId || current.studentId !== data.studentId || data.maxAttempts < attempts.length)) return false;
        await tx.update(examAssignments).set(data).where(eq(examAssignments.id, id));
        return true;
      });
      if (!changed) return { error: text(locale, "پس از شروع آزمون، دانش‌آموز و آزمون قابل تغییر نیستند و تعداد تلاش‌ها قابل کاهش نیست.", "Once started, keep the assigned student and exam, and allow at least the existing number of attempts.") };
    } else
      await getDatabase().transaction(async (tx) => {
        await tx.insert(examAssignments).values(data);
        await tx
          .insert(notifications)
          .values({
            userId: data.studentId,
            titleFa: "آزمون جدید",
            titleEn: "New exam assigned",
            bodyFa: "آزمون شما در پنل آماده است.",
            bodyEn: "Your exam is available in your workspace.",
            href: "/panel/student/exams",
          });
      });
  } catch {
    return failed(locale);
  }
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function deleteExamAssignment(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  await requireRole("admin");
  if (!z.uuid().safeParse(id).success) return denied(locale);
  await getDatabase().delete(examAssignments).where(eq(examAssignments.id, id));
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function startExam(
  assignmentId: string,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireRole("student");
  if (!z.uuid().safeParse(assignmentId).success) return denied(locale);
  const result = await getDatabase().transaction(async (tx) => {
    const [assignment] = await tx
      .select()
      .from(examAssignments)
      .where(
        and(
          eq(examAssignments.id, assignmentId),
          eq(examAssignments.studentId, user.id),
        ),
      )
      .for("update");
    if (!assignment) return denied(locale);
    const attempts = await tx
      .select()
      .from(examAttempts)
      .where(eq(examAttempts.assignmentId, assignmentId))
      .orderBy(asc(examAttempts.startedAt));
    const ongoing = attempts.find((a) => !a.finishedAt);
    if (ongoing) {
      if (!ongoing.expiresAt || ongoing.expiresAt > new Date())
        return { id: ongoing.id };
      await tx
        .update(examAttempts)
        .set({
          finishedAt: new Date(),
          score: scoreExam(ongoing.snapshot, ongoing.answers),
        })
        .where(eq(examAttempts.id, ongoing.id));
    }
    const now = new Date();
    if (
      (assignment.availableAt && now < assignment.availableAt) ||
      (assignment.dueAt && now >= assignment.dueAt) ||
      attempts.length >= assignment.maxAttempts
    )
      return {
        error: text(
          locale,
          "این آزمون در حال حاضر قابل شروع نیست.",
          "This exam cannot be started right now.",
        ),
      };
    const [exam] = await tx
      .select()
      .from(exams)
      .where(
        and(eq(exams.id, assignment.examId), eq(exams.status, "published")),
      );
    if (!exam) return denied(locale);
    const questions = await tx
      .select()
      .from(examQuestions)
      .where(eq(examQuestions.examId, exam.id))
      .orderBy(asc(examQuestions.sortOrder));
    if (!questions.length) return failed(locale);
    const options = await tx
      .select()
      .from(examQuestionOptions)
      .where(
        inArray(
          examQuestionOptions.questionId,
          questions.map((q) => q.id),
        ),
      )
      .orderBy(asc(examQuestionOptions.sortOrder));
    const snapshot = (
      exam.shuffleQuestions ? shuffle(questions) : questions
    ).map((q) => ({
      ...q,
      options: exam.shuffleOptions
        ? shuffle(options.filter((o) => o.questionId === q.id))
        : options.filter((o) => o.questionId === q.id),
    }));
    const expiry = exam.durationMinutes
      ? new Date(now.getTime() + exam.durationMinutes * 60000)
      : null;
    const expiresAt =
      assignment.dueAt && (!expiry || assignment.dueAt < expiry)
        ? assignment.dueAt
        : expiry;
    const [attempt] = await tx
      .insert(examAttempts)
      .values({
        assignmentId,
        studentId: user.id,
        snapshot,
        passingScore: exam.passingScore,
        expiresAt,
      })
      .returning({ id: examAttempts.id });
    return attempt;
  });
  if ("error" in result) return result;
  redirect(`/panel/student/exams/attempts/${result.id}`);
}
export async function saveExamAnswers(
  id: string,
  finish: boolean,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireRole("student");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  if (!z.uuid().safeParse(id).success) return denied(locale);
  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("answers")));
  } catch {
    return failed(locale);
  }
  const parsed = z
    .record(z.uuid(), z.array(z.string().max(5000)).max(100))
    .safeParse(raw);
  if (!parsed.success) return validationError(locale, parsed.error);
  const result = await getDatabase().transaction(async (tx) => {
    const [attempt] = await tx
      .select()
      .from(examAttempts)
      .where(and(eq(examAttempts.id, id), eq(examAttempts.studentId, user.id)))
      .for("update");
    if (!attempt || attempt.finishedAt) return denied(locale);
    if (!validAnswers(attempt.snapshot, parsed.data)) return failed(locale);
    const expired =
      attempt.expiresAt !== null && attempt.expiresAt <= new Date();
    const answers = expired ? attempt.answers : parsed.data;
    const complete = finish || expired;
    await tx
      .update(examAttempts)
      .set({
        answers,
        ...(complete
          ? {
              finishedAt: new Date(),
              score: scoreExam(attempt.snapshot, answers),
            }
          : {}),
      })
      .where(eq(examAttempts.id, id));
    return { ...saved(locale), complete };
  });
  if ("complete" in result && result.complete) {
    revalidatePath("/panel", "layout");
    redirect(`/panel/student/exams/attempts/${id}`);
  }
  return result;
}
export async function expireExam(id: string) {
  const user = await requireRole("student");
  if (!z.uuid().safeParse(id).success) return;
  await getDatabase().transaction(async (tx) => {
    const [a] = await tx
      .select()
      .from(examAttempts)
      .where(and(eq(examAttempts.id, id), eq(examAttempts.studentId, user.id)))
      .for("update");
    if (a && !a.finishedAt && a.expiresAt && a.expiresAt <= new Date())
      await tx
        .update(examAttempts)
        .set({
          finishedAt: new Date(),
          score: scoreExam(a.snapshot, a.answers),
        })
        .where(eq(examAttempts.id, id));
  });
  revalidatePath(`/panel/student/exams/attempts/${id}`);
}
export async function deleteExamAttempt(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  await requireRole("admin");
  if (!z.uuid().safeParse(id).success) return denied(locale);
  await getDatabase().delete(examAttempts).where(eq(examAttempts.id, id));
  revalidatePath("/panel", "layout");
  return saved(locale);
}
