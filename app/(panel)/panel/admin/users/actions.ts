"use server";

import { unlink } from "node:fs/promises";
import { and, count, eq, ne, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import {
  studentDocuments,
  termEnrollments,
  termTeachers,
  users,
  accessProfiles,
  userRole,
  type UserRole,
} from "@/lib/db/schema";
import { notifyAdmins, notifyUsers } from "@/lib/notifications/events";
import { roleHome } from "@/lib/auth/roles";
import { userSectionConfig } from "@/lib/users/config";
import { isAllowedImageReference } from "@/lib/media/reference";
import { normalizeIranianMobile } from "@/lib/auth/mobile";
import { resolveStudentDocumentPath } from "@/lib/student-information/document-storage";

const roleSchema = z.enum(userRole.enumValues);
const mobileSchema = z
  .string()
  .trim()
  .refine((value) => normalizeIranianMobile(value) !== null)
  .transform((value) => normalizeIranianMobile(value)!);
const commonUserSchema = z.object({
  firstNameFa: z.string().trim().min(1).max(80),
  lastNameFa: z.string().trim().min(1).max(80),
  firstNameEn: z.string().trim().max(80),
  lastNameEn: z.string().trim().max(80),
  mobile: mobileSchema,
  email: z.union([z.literal(""), z.string().trim().email().max(320)]),
  role: roleSchema,
  accessProfileId: z.union([z.uuid(), z.literal("")]),
  isActive: z.boolean(),
  avatarUrl: z.string().trim().max(2048).refine(isAllowedImageReference),
  locale: z.enum(["fa", "en"]),
});
const createUserSchema = commonUserSchema.extend({
  password: z.union([z.literal(""), z.string().min(8).max(256)]),
});
const updateUserSchema = commonUserSchema.extend({
  password: z.union([z.literal(""), z.string().min(8).max(256)]),
});

export type UserFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export type DeleteUserState = {
  error?: string;
  success?: string;
};

function readUserForm(formData: FormData) {
  return {
    firstNameFa: formData.get("firstNameFa"),
    lastNameFa: formData.get("lastNameFa"),
    firstNameEn: formData.get("firstNameEn"),
    lastNameEn: formData.get("lastNameEn"),
    email: formData.get("email"),
    mobile: formData.get("mobile"),
    role: formData.get("role"),
    accessProfileId: formData.get("accessProfileId") ?? "",
    password: formData.get("password"),
    isActive: formData.get("isActive") === "on",
    avatarUrl: formData.get("avatarUrl"),
    locale: formData.get("locale"),
  };
}

function isUniqueViolation(error: unknown) {
  return hasPostgresErrorCode(error, "23505");
}

function isForeignKeyViolation(error: unknown) {
  return hasPostgresErrorCode(error, "23503");
}

function revalidateUserPages() {
  for (const role of userRole.enumValues) {
    revalidatePath(userSectionConfig[role].path);
  }
  revalidatePath("/panel/admin");
  revalidatePath("/panel/admin/terms");
  revalidatePath("/panel/teacher/terms");
}

export async function createManagedUser(
  role: UserRole,
  _previousState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  await requireRole("admin");
  const validSectionRole = roleSchema.safeParse(role);
  const parsed = createUserSchema.safeParse(readUserForm(formData));

  if (!validSectionRole.success || !parsed.success) {
    return {
      error:
        formData.get("locale") === "en"
          ? "Please review the account information."
          : "لطفاً اطلاعات حساب را بررسی کنید.",
      fieldErrors: parsed.success
        ? undefined
        : z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    if (parsed.data.role === "admin" && parsed.data.accessProfileId) {
      const [profile] = await getDatabase().select({ id: accessProfiles.id }).from(accessProfiles).where(eq(accessProfiles.id, parsed.data.accessProfileId));
      if (!profile) return { error: parsed.data.locale === "fa" ? "عنوان دسترسی پیدا نشد." : "Access profile not found." };
    }
    const passwordHash = parsed.data.password
      ? await hashPassword(parsed.data.password)
      : null;
    await getDatabase().transaction(async (tx) => {
      const [created] = await tx
        .insert(users)
        .values({
          firstNameFa: parsed.data.firstNameFa,
          lastNameFa: parsed.data.lastNameFa,
          firstNameEn: parsed.data.firstNameEn,
          lastNameEn: parsed.data.lastNameEn,
          mobile: parsed.data.mobile,
          email: parsed.data.email ? parsed.data.email.toLowerCase() : null,
          passwordHash,
          role: parsed.data.role,
          accessProfileId: parsed.data.role === "admin" ? parsed.data.accessProfileId || null : null,
          isActive: parsed.data.isActive,
          avatarUrl: parsed.data.avatarUrl || null,
        })
        .returning({ id: users.id });
      const descriptions = {
        student: [
          "ثبت‌نام کلاس‌ها، تکالیف و نمره‌ها را از بخش آموزش من دنبال کنید.",
          "Follow enrollment, homework and grades in My learning.",
        ],
        teacher: [
          "کلاس‌ها، برنامه تدریس و پرونده دانش‌پژوهان را از بخش تدریس مدیریت کنید.",
          "Manage classes, schedules and students from Teaching.",
        ],
        member: [
          "سفارش‌ها و درخواست‌های پشتیبانی خود را از پنل پیگیری کنید.",
          "Follow orders and support requests in your workspace.",
        ],
        admin: [
          "بخش‌های آموزش، فروشگاه، پشتیبانی و تنظیمات سایت برای مدیریت آماده‌اند.",
          "Manage education, commerce, support and site settings.",
        ],
      };
      const [bodyFa, bodyEn] = descriptions[parsed.data.role];
      await notifyUsers(tx, [created.id], {
        titleFa: "حساب شما آماده است",
        titleEn: "Your account is ready",
        bodyFa,
        bodyEn,
        href: roleHome[parsed.data.role],
      });
      await notifyAdmins(tx, {
        titleFa: "حساب کاربری جدید",
        titleEn: "New account created",
        bodyFa: `حساب ${parsed.data.firstNameFa} ${parsed.data.lastNameFa} ایجاد شد.`,
        bodyEn: `Account ${parsed.data.firstNameEn} ${parsed.data.lastNameEn} was created.`,
        href: userSectionConfig[parsed.data.role].path,
      });
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        error:
          parsed.data.locale === "en"
            ? "This mobile number or email is already used by another account."
            : "این شماره موبایل یا ایمیل قبلاً برای حساب دیگری ثبت شده است.",
      };
    }

    throw error;
  }

  revalidateUserPages();
  redirect(`${userSectionConfig[parsed.data.role].path}?toast=created`);
}

export async function updateManagedUser(
  role: UserRole,
  userId: string,
  _previousState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const currentAdmin = await requireRole("admin");
  const validOriginalRole = roleSchema.safeParse(role);
  const validUserId = z.uuid().safeParse(userId);
  const parsed = updateUserSchema.safeParse(readUserForm(formData));

  if (!validOriginalRole.success || !validUserId.success || !parsed.success) {
    return {
      error:
        formData.get("locale") === "en"
          ? "Please review the account information."
          : "لطفاً اطلاعات حساب را بررسی کنید.",
      fieldErrors: parsed.success
        ? undefined
        : z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (currentAdmin.id === validUserId.data && (!parsed.data.isActive || Boolean(parsed.data.accessProfileId))) {
    return {
      error:
        parsed.data.locale === "en"
          ? "You cannot deactivate your current account or restrict your own access."
          : "نمی‌توانید حساب فعال خودتان را غیرفعال یا دسترسی خودتان را محدود کنید.",
    };
  }

  if (
    validOriginalRole.data === "admin" &&
    (parsed.data.role !== "admin" || !parsed.data.isActive || Boolean(parsed.data.accessProfileId))
  ) {
    const [remainingAdmins] = await getDatabase()
      .select({ value: count() })
      .from(users)
      .where(
        and(
          eq(users.role, "admin"),
          eq(users.isActive, true),
          isNull(users.accessProfileId),
          ne(users.id, validUserId.data),
        ),
      );

    if ((remainingAdmins?.value ?? 0) === 0) {
      return {
        error:
          parsed.data.locale === "en"
            ? "At least one active administrator must remain."
            : "حداقل یک همکار فعال باید در سامانه باقی بماند.",
      };
    }
  }

  if (
    validOriginalRole.data === "teacher" &&
    (parsed.data.role !== "teacher" || !parsed.data.isActive)
  ) {
    const [assignments] = await getDatabase()
      .select({ value: count() })
      .from(termTeachers)
      .where(eq(termTeachers.teacherId, validUserId.data));
    if ((assignments?.value ?? 0) > 0) {
      return {
        error:
          parsed.data.locale === "en"
            ? "Reassign or remove this teacher from every term before changing their role or deactivating the account."
            : "پیش از تغییر نقش یا غیرفعال‌کردن حساب، این مدرس را از همه ترم‌ها حذف یا جایگزین کنید.",
      };
    }
  }

  if (
    validOriginalRole.data === "student" &&
    (parsed.data.role !== "student" || !parsed.data.isActive)
  ) {
    const [activeEnrollments] = await getDatabase()
      .select({ value: count() })
      .from(termEnrollments)
      .where(
        and(
          eq(termEnrollments.studentId, validUserId.data),
          eq(termEnrollments.status, "active"),
        ),
      );
    if ((activeEnrollments?.value ?? 0) > 0) {
      return {
        error:
          parsed.data.locale === "en"
            ? "Withdraw this student from active terms before changing their role or deactivating the account."
            : "پیش از تغییر نقش یا غیرفعال‌کردن حساب، انصراف دانش پژوه را از ترم‌های فعال ثبت کنید.",
      };
    }
  }

  const changes: Partial<typeof users.$inferInsert> = {
    firstNameFa: parsed.data.firstNameFa,
    lastNameFa: parsed.data.lastNameFa,
    firstNameEn: parsed.data.firstNameEn,
    lastNameEn: parsed.data.lastNameEn,
    mobile: parsed.data.mobile,
    email: parsed.data.email ? parsed.data.email.toLowerCase() : null,
    isActive: parsed.data.isActive,
    avatarUrl: parsed.data.avatarUrl || null,
    role: parsed.data.role,
    accessProfileId: parsed.data.role === "admin" ? parsed.data.accessProfileId || null : null,
    updatedAt: new Date(),
  };

  if (parsed.data.role === "admin" && parsed.data.accessProfileId) {
    const [profile] = await getDatabase().select({ id: accessProfiles.id }).from(accessProfiles).where(eq(accessProfiles.id, parsed.data.accessProfileId));
    if (!profile) return { error: parsed.data.locale === "fa" ? "عنوان دسترسی پیدا نشد." : "Access profile not found." };
  }

  if (parsed.data.password) {
    changes.passwordHash = await hashPassword(parsed.data.password);
    changes.passwordFailedAttempts = 0;
    changes.passwordLockedUntil = null;
  }

  try {
    const [updatedUser] = await getDatabase().transaction(async (tx) => {
      // Serialize administrative access changes so concurrent demotions cannot
      // leave the installation without a full administrator.
      await tx.execute(sql`select pg_advisory_xact_lock(1128352837)`);
      const [actor] = await tx.select({ id: users.id }).from(users).where(and(eq(users.id, currentAdmin.id), eq(users.role, "admin"), eq(users.isActive, true), isNull(users.accessProfileId)));
      if (!actor) return [];
      if (validOriginalRole.data === "admin" && (parsed.data.role !== "admin" || !parsed.data.isActive || parsed.data.accessProfileId)) {
        const [remaining] = await tx.select({ value: count() }).from(users).where(and(eq(users.role, "admin"), eq(users.isActive, true), isNull(users.accessProfileId), ne(users.id, validUserId.data)));
        if (!remaining?.value) return [];
      }
      return tx.update(users).set(changes).where(and(eq(users.id, validUserId.data), eq(users.role, validOriginalRole.data))).returning({ id: users.id });
    });

    if (!updatedUser) {
      return {
        error:
          parsed.data.locale === "en"
          ? "The account was not found or this change would remove the last full administrator."
          : "حساب پیدا نشد یا این تغییر دسترسی آخرین مدیر کامل را حذف می‌کند.",
      };
    }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        error:
          parsed.data.locale === "en"
            ? "This mobile number or email is already used by another account."
            : "این شماره موبایل یا ایمیل قبلاً برای حساب دیگری ثبت شده است.",
      };
    }

    throw error;
  }

  revalidateUserPages();
  if (currentAdmin.id === validUserId.data && parsed.data.role !== "admin") {
    redirect(roleHome[parsed.data.role]);
  }
  redirect(`${userSectionConfig[parsed.data.role].path}?toast=updated`);
}

export async function deleteManagedUser(
  role: UserRole,
  userId: string,
  locale: "fa" | "en",
): Promise<DeleteUserState> {
  const currentAdmin = await requireRole("admin");
  const validRole = roleSchema.safeParse(role);
  const validUserId = z.uuid().safeParse(userId);

  if (!validRole.success || !validUserId.success) {
    return {
      error:
        locale === "en"
          ? "The account identifier is invalid."
          : "شناسه حساب معتبر نیست.",
    };
  }

  if (currentAdmin.id === validUserId.data) {
    return {
      error:
        locale === "en"
          ? "You cannot delete the account you are currently using."
          : "نمی‌توانید حسابی را که با آن وارد شده‌اید حذف کنید.",
    };
  }

  try {
    const documentPaths =
      validRole.data === "student"
        ? await getDatabase()
            .select({ pathname: studentDocuments.pathname })
            .from(studentDocuments)
            .where(eq(studentDocuments.userId, validUserId.data))
        : [];
    const deleted = await getDatabase().transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(1128352837)`);
      const [actor] = await tx.select({ id: users.id }).from(users).where(and(eq(users.id, currentAdmin.id), eq(users.role, "admin"), eq(users.isActive, true), isNull(users.accessProfileId)));
      if (!actor) return false;
      if (validRole.data === "admin") {
        const [remaining] = await tx.select({ value: count() }).from(users).where(and(eq(users.role, "admin"), eq(users.isActive, true), isNull(users.accessProfileId), ne(users.id, validUserId.data)));
        if (!remaining?.value) return false;
      }
      const result = await tx.delete(users).where(and(eq(users.id, validUserId.data), eq(users.role, validRole.data))).returning({ id: users.id });
      return Boolean(result.length);
    });
    if (!deleted) return { error: locale === "fa" ? "حذف حساب مجاز نیست؛ دسترسی شما یا وجود مدیر کامل را بررسی کنید." : "Deletion was denied. Check your access and ensure a full administrator remains." };
    await Promise.all(
      documentPaths.map(async ({ pathname }) => {
        const absolutePath = resolveStudentDocumentPath(pathname);
        if (absolutePath) await unlink(absolutePath).catch(() => undefined);
      }),
    );
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      return {
        error:
          locale === "en"
            ? "This account is connected to other content and cannot be deleted yet."
            : "این حساب به محتوای دیگری متصل است و فعلاً قابل حذف نیست.",
      };
    }

    throw error;
  }

  revalidateUserPages();
  return {
    success: locale === "en" ? "Account deleted." : "حساب کاربری حذف شد.",
  };
}
