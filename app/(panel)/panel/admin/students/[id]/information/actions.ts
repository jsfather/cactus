"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { studentInformation, users } from "@/lib/db/schema";

export type StudentReviewState = { error?: string; success?: string };

const reviewSchema = z.object({
  studentId: z.uuid(),
  locale: z.enum(["fa", "en"]),
});

export async function approveStudentInformation(studentId: string, locale: "fa" | "en"): Promise<StudentReviewState> {
  const admin = await requireRole("admin");
  const parsed = reviewSchema.safeParse({ studentId, locale });
  if (!parsed.success) return { error: locale === "en" ? "The student identifier is invalid." : "شناسه دانش پژوه معتبر نیست." };

  const [updated] = await getDatabase().update(studentInformation).set({
    status: "approved",
    rejectionReason: null,
    reviewedAt: new Date(),
    reviewedById: admin.id,
    updatedAt: new Date(),
  }).where(and(
    eq(studentInformation.userId, parsed.data.studentId),
    eq(studentInformation.status, "pending"),
  )).returning({ id: studentInformation.id });
  if (!updated) return { error: locale === "en" ? "Only a pending submission can be approved." : "فقط پرونده در انتظار بررسی قابل تأیید است." };

  revalidatePath("/panel/admin/students");
  revalidatePath(`/panel/admin/students/${parsed.data.studentId}/information`);
  revalidatePath("/panel/student", "layout");
  return { success: locale === "en" ? "Student information approved." : "اطلاعات دانش پژوه تأیید شد." };
}

export async function rejectStudentInformation(studentId: string, reason: string, locale: "fa" | "en"): Promise<StudentReviewState> {
  const admin = await requireRole("admin");
  const parsed = reviewSchema.extend({ reason: z.string().trim().min(3).max(1200) }).safeParse({ studentId, reason, locale });
  if (!parsed.success) return { error: locale === "en" ? "Write a clear rejection reason (at least 3 characters)." : "دلیل رد را به‌صورت روشن و حداقل ۳ نویسه وارد کنید." };

  const [student] = await getDatabase().select({ id: users.id }).from(users)
    .where(and(eq(users.id, parsed.data.studentId), eq(users.role, "student")))
    .limit(1);
  if (!student) return { error: locale === "en" ? "Student account not found." : "حساب دانش پژوه پیدا نشد." };

  const [updated] = await getDatabase().update(studentInformation).set({
    status: "rejected",
    rejectionReason: parsed.data.reason,
    reviewedAt: new Date(),
    reviewedById: admin.id,
    updatedAt: new Date(),
  }).where(and(
    eq(studentInformation.userId, parsed.data.studentId),
    eq(studentInformation.status, "pending"),
  )).returning({ id: studentInformation.id });
  if (!updated) return { error: locale === "en" ? "Only a pending submission can be rejected." : "فقط پرونده در انتظار بررسی قابل رد است." };

  revalidatePath("/panel/admin/students");
  revalidatePath(`/panel/admin/students/${parsed.data.studentId}/information`);
  revalidatePath("/panel/student", "layout");
  return { success: locale === "en" ? "Submission returned to the student for corrections." : "پرونده برای اصلاح به دانش پژوه بازگردانده شد." };
}

