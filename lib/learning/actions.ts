"use server";
import { ownsAttachment } from "@/lib/attachments/storage";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  learningActivities,
  homeworkSubmissions,
  homeworkMessages,
  termSessions,
  notifications,
  previousCourses,
  users,
} from "@/lib/db/schema";
import { sanitizeRichText } from "@/lib/content/rich-text";
import { canAccessTerm, getActivity } from "./queries";
import { activityKind } from "@/lib/resources/config";
import {
  optionalUrl,
  validationError,
  saved,
  denied,
  failed,
  type ActionState,
} from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
const activitySchema = z.object({
  kind: activityKind,
  termId: z.uuid(),
  sessionId: z.union([z.uuid(), z.literal("")]),
  titleFa: z.string().trim().min(2).max(240),
  titleEn: z.string().max(240),
  contentFa: z.string().min(2).max(100000),
  contentEn: z.string().max(100000),
  attachmentUrl: optionalUrl,
  videoUrl: optionalUrl,
  dueAt: z.string().refine((v) => !v || Number.isFinite(Date.parse(v))),
  status: z.enum(["draft", "published"]),
});
export async function saveActivity(
  id: string | null,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireRole(["admin", "teacher"]);
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = activitySchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  const input = parsed.data;
  if (!(await ownsAttachment(user, input.attachmentUrl))) return denied(locale);
  if (!(await canAccessTerm(user, input.termId, true))) return denied(locale);
  if (id) {
    if (!z.uuid().safeParse(id).success) return denied(locale);
    const existing = await getActivity(user, id, true);
    if (!existing) return denied(locale);
    // Keep submissions and conversations within their original class.
    if (existing.termId !== input.termId || existing.kind !== input.kind) return denied(locale);
  }
  if (input.sessionId) {
    const [session] = await getDatabase()
      .select()
      .from(termSessions)
      .where(
        and(
          eq(termSessions.id, input.sessionId),
          eq(termSessions.termId, input.termId),
        ),
      );
    if (!session) return denied(locale);
  }
  const data = {
    ...input,
    sessionId: input.sessionId || null,
    dueAt: input.dueAt ? new Date(input.dueAt) : null,
    contentFa: sanitizeRichText(input.contentFa),
    contentEn: sanitizeRichText(input.contentEn),
    updatedAt: new Date(),
  };
  try {
    if (id)
      await getDatabase()
        .update(learningActivities)
        .set(data)
        .where(eq(learningActivities.id, id));
    else
      await getDatabase()
        .insert(learningActivities)
        .values({ ...data, creatorId: user.id });
  } catch {
    return failed(locale);
  }
  revalidatePath("/panel", "layout");
  redirect(`/panel/${user.role}/learning/${input.kind}?saved=1`);
}
export async function deleteActivity(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireRole(["admin", "teacher"]);
  if (!z.uuid().safeParse(id).success || !(await getActivity(user, id, true)))
    return denied(locale);
  await getDatabase()
    .delete(learningActivities)
    .where(eq(learningActivities.id, id));
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function submitHomework(
  activityId: string,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireRole(["student", "admin"]);
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = z
    .object({
      body: z.string().trim().min(1).max(10000),
      attachmentUrl: optionalUrl,
      studentId: z.uuid().optional(),
    })
    .safeParse({
      ...Object.fromEntries(form),
      studentId: user.role === "admin" ? form.get("studentId") : user.id,
    });
  if (!parsed.success) return validationError(locale, parsed.error);
  if (!z.uuid().safeParse(activityId).success) return denied(locale);
  const activity = await getActivity(user, activityId);
  if (!activity || activity.kind !== "homework") return denied(locale);
  if (!(await ownsAttachment(user, parsed.data.attachmentUrl)))
    return denied(locale);
  const studentId = parsed.data.studentId!;
  if (user.role === "admin") {
    const [student] = await getDatabase()
      .select()
      .from(users)
      .where(and(eq(users.id, studentId), eq(users.role, "student")));
    if (
      !student ||
      !(await canAccessTerm(
        { ...user, id: studentId, role: "student" },
        activity.termId,
      ))
    )
      return denied(locale);
  }
  await getDatabase()
    .insert(homeworkSubmissions)
    .values({
      activityId,
      studentId,
      body: parsed.data.body,
      attachmentUrl: parsed.data.attachmentUrl,
    })
    .onConflictDoUpdate({
      target: [homeworkSubmissions.activityId, homeworkSubmissions.studentId],
      set: {
        body: parsed.data.body,
        attachmentUrl: parsed.data.attachmentUrl,
        grade: null,
        feedback: null,
        reviewedById: null,
        updatedAt: new Date(),
      },
    });
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function reviewHomework(
  id: string,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireRole(["admin", "teacher"]);
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = z
    .object({
      grade: z.coerce.number().int().min(0).max(100),
      feedback: z.string().max(10000),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  if (!z.uuid().safeParse(id).success) return denied(locale);
  const [submission] = await getDatabase()
    .select()
    .from(homeworkSubmissions)
    .where(eq(homeworkSubmissions.id, id));
  if (!submission || !(await getActivity(user, submission.activityId, true)))
    return denied(locale);
  await getDatabase().transaction(async (tx) => {
    await tx
      .update(homeworkSubmissions)
      .set({ ...parsed.data, reviewedById: user.id })
      .where(eq(homeworkSubmissions.id, id));
    await tx
      .insert(notifications)
      .values({
        userId: submission.studentId,
        titleFa: "بازخورد تکلیف",
        titleEn: "Homework feedback",
        bodyFa: "مدرس تکلیف شما را بررسی کرد.",
        bodyEn: "Your homework has been reviewed.",
        href: `/panel/student/learning/homework/${submission.activityId}`,
      });
  });
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function homeworkReply(
  id: string,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = z
    .object({ body: z.string().trim().min(1).max(5000) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  if (!z.uuid().safeParse(id).success) return denied(locale);
  const [submission] = await getDatabase()
    .select()
    .from(homeworkSubmissions)
    .where(eq(homeworkSubmissions.id, id));
  if (
    !submission ||
    !(await getActivity(user, submission.activityId)) ||
    (user.role === "student" && submission.studentId !== user.id)
  )
    return denied(locale);
  await getDatabase()
    .insert(homeworkMessages)
    .values({ submissionId: id, authorId: user.id, body: parsed.data.body });
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function deleteSubmission(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireRole(["admin", "student"]);
  if (!z.uuid().safeParse(id).success) return denied(locale);
  const [submission] = await getDatabase()
    .select()
    .from(homeworkSubmissions)
    .where(eq(homeworkSubmissions.id, id));
  if (
    !submission ||
    (user.role !== "admin" && submission.studentId !== user.id)
  )
    return denied(locale);
  await getDatabase()
    .delete(homeworkSubmissions)
    .where(eq(homeworkSubmissions.id, id));
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function savePreviousCourse(
  studentId: string,
  id: string | null,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireRole(["admin", "student"]);
  const locale = form.get("locale") === "en" ? "en" : "fa";
  if (
    !z.uuid().safeParse(studentId).success ||
    (user.role !== "admin" && user.id !== studentId)
  )
    return denied(locale);
  const parsed = z
    .object({
      titleFa: z.string().trim().min(2).max(240),
      titleEn: z.string().max(240),
      institution: z.string().trim().min(2).max(240),
      completedOn: z.union([z.iso.date(), z.literal("")]),
      description: z.string().max(5000),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  const data = { ...parsed.data, completedOn: parsed.data.completedOn || null };
  if (id) {
    if (!z.uuid().safeParse(id).success) return denied(locale);
    await getDatabase()
      .update(previousCourses)
      .set(data)
      .where(
        and(
          eq(previousCourses.id, id),
          eq(previousCourses.studentId, studentId),
        ),
      );
  } else
    await getDatabase()
      .insert(previousCourses)
      .values({ ...data, studentId });
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function deletePreviousCourse(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireRole(["admin", "student"]);
  if (!z.uuid().safeParse(id).success) return denied(locale);
  await getDatabase()
    .delete(previousCourses)
    .where(
      and(
        eq(previousCourses.id, id),
        user.role === "admin"
          ? undefined
          : eq(previousCourses.studentId, user.id),
      ),
    );
  revalidatePath("/panel", "layout");
  return saved(locale);
}
