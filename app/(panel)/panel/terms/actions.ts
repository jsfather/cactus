"use server";

import { randomBytes } from "node:crypto";
import { and, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  termEnrollments,
  termInvitations,
  termSchedules,
  termTeachers,
  terms,
  users,
} from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { hashTermInvitationToken } from "@/lib/terms/invitations";
import { schedulesOverlap } from "@/lib/terms/schedule";

export type TermActionState = {
  error?: string;
  success?: string;
  invitationPath?: string;
};

import { enrollStudent } from "@/lib/terms/enrollment";

async function canManageTerm(termId: string) {
  const user = await requireUser();
  if (user.role === "admin") return user;
  if (user.role !== "teacher") return null;
  const [assignment] = await getDatabase()
    .select({ termId: termTeachers.termId })
    .from(termTeachers)
    .where(
      and(eq(termTeachers.termId, termId), eq(termTeachers.teacherId, user.id)),
    )
    .limit(1);
  return assignment ? user : null;
}

function refresh(termId: string) {
  revalidatePath(`/panel/admin/terms/${termId}/edit`);
  revalidatePath(`/panel/teacher/terms/${termId}`);
  revalidatePath("/panel/admin/terms");
  revalidatePath("/panel/teacher/terms");
  revalidatePath("/panel/teacher/schedule");
  revalidatePath("/panel/student/schedule");
}

export async function assignStudentToTerm(
  termIdValue: string,
  _state: TermActionState,
  formData: FormData,
): Promise<TermActionState> {
  const locale: Locale = formData.get("locale") === "en" ? "en" : "fa";
  const termId = z.uuid().safeParse(termIdValue);
  const studentId = z.uuid().safeParse(formData.get("studentId"));
  if (!termId.success || !studentId.success)
    return {
      error:
        locale === "fa"
          ? "ترم و دانش پژوه را انتخاب کنید."
          : "Select a term and student.",
    };
  const manager = await canManageTerm(termId.data);
  if (!manager)
    return {
      error:
        locale === "fa"
          ? "اجازه مدیریت این ترم را ندارید."
          : "You cannot manage this term.",
    };
  const result = await getDatabase().transaction((transaction) =>
    enrollStudent(
      transaction,
      termId.data,
      studentId.data,
      manager.id,
      "direct",
      locale,
    ),
  );
  if (result.error) return { error: result.error };
  refresh(termId.data);
  return {
    success:
      locale === "fa"
        ? "دانش پژوه به ترم اضافه شد."
        : "Student added to the term.",
  };
}

export async function updateTermEnrollment(
  enrollmentIdValue: string,
  statusValue: string,
  locale: Locale,
): Promise<TermActionState> {
  const enrollmentId = z.uuid().safeParse(enrollmentIdValue);
  const status = z
    .enum(["active", "withdrawn", "completed"])
    .safeParse(statusValue);
  if (!enrollmentId.success || !status.success)
    return {
      error:
        locale === "fa" ? "درخواست معتبر نیست." : "The request is invalid.",
    };
  const [enrollment] = await getDatabase()
    .select({ id: termEnrollments.id, termId: termEnrollments.termId })
    .from(termEnrollments)
    .where(eq(termEnrollments.id, enrollmentId.data))
    .limit(1);
  if (!enrollment)
    return {
      error:
        locale === "fa" ? "ثبت‌نام پیدا نشد." : "The enrollment was not found.",
    };
  const manager = await canManageTerm(enrollment.termId);
  if (!manager)
    return {
      error:
        locale === "fa"
          ? "اجازه مدیریت این ترم را ندارید."
          : "You cannot manage this term.",
    };
  if (status.data === "active") {
    const [record] = await getDatabase()
      .select({ studentId: termEnrollments.studentId })
      .from(termEnrollments)
      .where(eq(termEnrollments.id, enrollment.id))
      .limit(1);
    const result = await getDatabase().transaction((transaction) =>
      enrollStudent(
        transaction,
        enrollment.termId,
        record.studentId,
        manager.id,
        "direct",
        locale,
      ),
    );
    if (result.error) return { error: result.error };
  } else {
    await getDatabase()
      .update(termEnrollments)
      .set({ status: status.data, updatedAt: new Date() })
      .where(eq(termEnrollments.id, enrollment.id));
  }
  refresh(enrollment.termId);
  return {
    success:
      locale === "fa"
        ? "وضعیت ثبت‌نام به‌روز شد."
        : "Enrollment status updated.",
  };
}

export async function createTermInvitation(
  termIdValue: string,
  _state: TermActionState,
  formData: FormData,
): Promise<TermActionState> {
  const locale: Locale = formData.get("locale") === "en" ? "en" : "fa";
  const parsed = z
    .object({
      termId: z.uuid(),
      expiryDays: z.coerce.number().int().min(1).max(90),
      maxUses: z
        .string()
        .trim()
        .refine((value) => !value || /^\d+$/.test(value))
        .transform((value) => (value ? Number(value) : null))
        .refine((value) => value === null || (value >= 1 && value <= 10000)),
    })
    .safeParse({
      termId: termIdValue,
      expiryDays: formData.get("expiryDays"),
      maxUses: formData.get("maxUses"),
    });
  if (!parsed.success)
    return {
      error:
        locale === "fa"
          ? "اعتبار و تعداد استفاده پیوند را بررسی کنید."
          : "Review the link expiry and usage limit.",
    };
  const manager = await canManageTerm(parsed.data.termId);
  if (!manager)
    return {
      error:
        locale === "fa"
          ? "اجازه مدیریت این ترم را ندارید."
          : "You cannot manage this term.",
    };
  const [term] = await getDatabase()
    .select({ status: terms.status })
    .from(terms)
    .where(eq(terms.id, parsed.data.termId))
    .limit(1);
  if (!term || term.status !== "enrollment_open")
    return {
      error:
        locale === "fa"
          ? "برای ساخت پیوند، وضعیت ترم را روی «ثبت‌نام باز» بگذارید."
          : "Set the term status to “Enrollment open” before creating a link.",
    };
  const token = randomBytes(32).toString("base64url");
  await getDatabase()
    .insert(termInvitations)
    .values({
      termId: parsed.data.termId,
      tokenHash: hashTermInvitationToken(token),
      expiresAt: new Date(Date.now() + parsed.data.expiryDays * 86_400_000),
      maxUses: parsed.data.maxUses,
      createdById: manager.id,
    });
  refresh(parsed.data.termId);
  return {
    success:
      locale === "fa"
        ? "پیوند ثبت‌نام ساخته شد؛ اکنون آن را کپی کنید."
        : "Enrollment link created. Copy it now.",
    invitationPath: `/join/term/${token}`,
  };
}

export async function revokeTermInvitation(
  invitationIdValue: string,
  locale: Locale,
): Promise<TermActionState> {
  const invitationId = z.uuid().safeParse(invitationIdValue);
  if (!invitationId.success)
    return {
      error:
        locale === "fa"
          ? "شناسه پیوند معتبر نیست."
          : "The link identifier is invalid.",
    };
  const [invitation] = await getDatabase()
    .select({ termId: termInvitations.termId })
    .from(termInvitations)
    .where(eq(termInvitations.id, invitationId.data))
    .limit(1);
  if (!invitation)
    return {
      error: locale === "fa" ? "پیوند پیدا نشد." : "The link was not found.",
    };
  if (!(await canManageTerm(invitation.termId)))
    return {
      error:
        locale === "fa"
          ? "اجازه مدیریت این ترم را ندارید."
          : "You cannot manage this term.",
    };
  await getDatabase()
    .update(termInvitations)
    .set({ revokedAt: new Date() })
    .where(eq(termInvitations.id, invitationId.data));
  refresh(invitation.termId);
  return {
    success: locale === "fa" ? "پیوند غیرفعال شد." : "Enrollment link revoked.",
  };
}

export async function acceptTermInvitation(
  token: string,
  locale: Locale,
): Promise<TermActionState> {
  const user = await requireUser();
  if (user.role !== "student")
    return {
      error:
        locale === "fa"
          ? "این پیوند فقط برای حساب دانش پژوهی قابل استفاده است."
          : "This link can only be used by a student account.",
    };
  const tokenHash = hashTermInvitationToken(token);
  const result = await getDatabase().transaction(async (transaction) => {
    await transaction.execute(
      sql`select id from term_invitations where token_hash = ${tokenHash} for update`,
    );
    const [invitation] = await transaction
      .select()
      .from(termInvitations)
      .where(eq(termInvitations.tokenHash, tokenHash))
      .limit(1);
    if (
      !invitation ||
      invitation.revokedAt ||
      invitation.expiresAt <= new Date() ||
      (invitation.maxUses !== null && invitation.useCount >= invitation.maxUses)
    )
      return {
        error:
          locale === "fa"
            ? "این پیوند نامعتبر، منقضی یا تکمیل‌شده است."
            : "This enrollment link is invalid, expired, or fully used.",
      };
    const enrollment = await enrollStudent(
      transaction,
      invitation.termId,
      user.id,
      null,
      "invitation",
      locale,
    );
    if (enrollment.error) return enrollment;
    await transaction
      .update(termInvitations)
      .set({ useCount: sql`${termInvitations.useCount} + 1` })
      .where(eq(termInvitations.id, invitation.id));
    return { success: true, termId: invitation.termId };
  });
  if ("error" in result) return { error: result.error };
  refresh(result.termId);
  return {
    success:
      locale === "fa"
        ? "با موفقیت به ترم اضافه شدید."
        : "You joined the term successfully.",
  };
}
