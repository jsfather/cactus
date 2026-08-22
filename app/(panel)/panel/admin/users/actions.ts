"use server";

import { and, count, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { users, userRole, type UserRole } from "@/lib/db/schema";
import { roleHome } from "@/lib/auth/roles";
import { userSectionConfig } from "@/lib/users/config";
import { isAllowedImageReference } from "@/lib/media/reference";

const roleSchema = z.enum(userRole.enumValues);
const commonUserSchema = z.object({
  firstNameFa: z.string().trim().min(1).max(80),
  lastNameFa: z.string().trim().min(1).max(80),
  firstNameEn: z.string().trim().min(1).max(80),
  lastNameEn: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(320),
  role: roleSchema,
  isActive: z.boolean(),
  avatarUrl: z.string().trim().max(2048).refine(isAllowedImageReference),
  locale: z.enum(["fa", "en"]),
});
const createUserSchema = commonUserSchema.extend({
  password: z.string().min(8).max(256),
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
    role: formData.get("role"),
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
      error: formData.get("locale") === "en" ? "Please review the account information." : "لطفاً اطلاعات حساب را بررسی کنید.",
      fieldErrors: parsed.success
        ? undefined
        : z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await getDatabase().insert(users).values({
      firstNameFa: parsed.data.firstNameFa,
      lastNameFa: parsed.data.lastNameFa,
      firstNameEn: parsed.data.firstNameEn,
      lastNameEn: parsed.data.lastNameEn,
      email: parsed.data.email.toLowerCase(),
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role,
      isActive: parsed.data.isActive,
      avatarUrl: parsed.data.avatarUrl || null,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: parsed.data.locale === "en" ? "This email is already used by another account." : "این ایمیل قبلاً برای حساب دیگری ثبت شده است." };
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
      error: formData.get("locale") === "en" ? "Please review the account information." : "لطفاً اطلاعات حساب را بررسی کنید.",
      fieldErrors: parsed.success
        ? undefined
        : z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (currentAdmin.id === validUserId.data && !parsed.data.isActive) {
    return { error: parsed.data.locale === "en" ? "You cannot deactivate your current administrator account." : "نمی‌توانید حساب همکاری فعال خودتان را غیرفعال کنید." };
  }

  if (validOriginalRole.data === "admin" && (parsed.data.role !== "admin" || !parsed.data.isActive)) {
    const [remainingAdmins] = await getDatabase()
      .select({ value: count() })
      .from(users)
      .where(and(eq(users.role, "admin"), eq(users.isActive, true), ne(users.id, validUserId.data)));

    if ((remainingAdmins?.value ?? 0) === 0) {
      return { error: parsed.data.locale === "en" ? "At least one active administrator must remain." : "حداقل یک همکار فعال باید در سامانه باقی بماند." };
    }
  }

  const changes: Partial<typeof users.$inferInsert> = {
    firstNameFa: parsed.data.firstNameFa,
    lastNameFa: parsed.data.lastNameFa,
    firstNameEn: parsed.data.firstNameEn,
    lastNameEn: parsed.data.lastNameEn,
    email: parsed.data.email.toLowerCase(),
    isActive: parsed.data.isActive,
    avatarUrl: parsed.data.avatarUrl || null,
    role: parsed.data.role,
    updatedAt: new Date(),
  };

  if (parsed.data.password) {
    changes.passwordHash = await hashPassword(parsed.data.password);
  }

  try {
    const [updatedUser] = await getDatabase()
      .update(users)
      .set(changes)
      .where(
        and(
          eq(users.id, validUserId.data),
          eq(users.role, validOriginalRole.data),
        ),
      )
      .returning({ id: users.id });

    if (!updatedUser) {
      return { error: parsed.data.locale === "en" ? "This account no longer exists." : "این حساب دیگر وجود ندارد." };
    }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: parsed.data.locale === "en" ? "This email is already used by another account." : "این ایمیل قبلاً برای حساب دیگری ثبت شده است." };
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
    return { error: locale === "en" ? "The account identifier is invalid." : "شناسه حساب معتبر نیست." };
  }

  if (currentAdmin.id === validUserId.data) {
    return { error: locale === "en" ? "You cannot delete the account you are currently using." : "نمی‌توانید حسابی را که با آن وارد شده‌اید حذف کنید." };
  }

  try {
    await getDatabase()
      .delete(users)
      .where(
        and(
          eq(users.id, validUserId.data),
          eq(users.role, validRole.data),
        ),
      );
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      return {
        error: locale === "en" ? "This account is connected to other content and cannot be deleted yet." : "این حساب به محتوای دیگری متصل است و فعلاً قابل حذف نیست.",
      };
    }

    throw error;
  }

  revalidateUserPages();
  return { success: locale === "en" ? "Account deleted." : "حساب کاربری حذف شد." };
}
