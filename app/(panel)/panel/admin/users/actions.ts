"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { users, userRole, type UserRole } from "@/lib/db/schema";
import { userSectionConfig } from "@/lib/users/config";

const roleSchema = z.enum(userRole.enumValues);
const commonUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  isActive: z.boolean(),
});
const createUserSchema = commonUserSchema.extend({
  password: z.string().min(12).max(256),
});
const updateUserSchema = commonUserSchema.extend({
  password: z.union([z.literal(""), z.string().min(12).max(256)]),
});

export type UserFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export type DeleteUserState = {
  error?: string;
};

function readUserForm(formData: FormData) {
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    isActive: formData.get("isActive") === "on",
  };
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

function isForeignKeyViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23503"
  );
}

function revalidateUserPages(role: UserRole) {
  revalidatePath(userSectionConfig[role].path);
  revalidatePath("/panel/admin");
}

export async function createManagedUser(
  role: UserRole,
  _previousState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  await requireRole("admin");
  const validRole = roleSchema.safeParse(role);
  const parsed = createUserSchema.safeParse(readUserForm(formData));

  if (!validRole.success || !parsed.success) {
    return {
      error: "لطفاً اطلاعات حساب را بررسی کنید.",
      fieldErrors: parsed.success
        ? undefined
        : z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await getDatabase().insert(users).values({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash: await hashPassword(parsed.data.password),
      role: validRole.data,
      isActive: parsed.data.isActive,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: "این ایمیل قبلاً برای حساب دیگری ثبت شده است." };
    }

    throw error;
  }

  revalidateUserPages(validRole.data);
  redirect(userSectionConfig[validRole.data].path);
}

export async function updateManagedUser(
  role: UserRole,
  userId: string,
  _previousState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const currentAdmin = await requireRole("admin");
  const validRole = roleSchema.safeParse(role);
  const validUserId = z.uuid().safeParse(userId);
  const parsed = updateUserSchema.safeParse(readUserForm(formData));

  if (!validRole.success || !validUserId.success || !parsed.success) {
    return {
      error: "لطفاً اطلاعات حساب را بررسی کنید.",
      fieldErrors: parsed.success
        ? undefined
        : z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (currentAdmin.id === validUserId.data && !parsed.data.isActive) {
    return { error: "نمی‌توانید حساب مدیریتی فعال خودتان را غیرفعال کنید." };
  }

  const changes: Partial<typeof users.$inferInsert> = {
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    isActive: parsed.data.isActive,
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
          eq(users.role, validRole.data),
        ),
      )
      .returning({ id: users.id });

    if (!updatedUser) {
      return { error: "این حساب دیگر وجود ندارد." };
    }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: "این ایمیل قبلاً برای حساب دیگری ثبت شده است." };
    }

    throw error;
  }

  revalidateUserPages(validRole.data);
  redirect(userSectionConfig[validRole.data].path);
}

export async function deleteManagedUser(
  role: UserRole,
  userId: string,
  _previousState: DeleteUserState,
  _formData: FormData,
): Promise<DeleteUserState> {
  void _previousState;
  void _formData;
  const currentAdmin = await requireRole("admin");
  const validRole = roleSchema.safeParse(role);
  const validUserId = z.uuid().safeParse(userId);

  if (!validRole.success || !validUserId.success) {
    return { error: "شناسه حساب معتبر نیست." };
  }

  if (currentAdmin.id === validUserId.data) {
    return { error: "نمی‌توانید حسابی را که با آن وارد شده‌اید حذف کنید." };
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
        error: "این حساب به محتوای دیگری متصل است و فعلاً قابل حذف نیست.",
      };
    }

    throw error;
  }

  revalidateUserPages(validRole.data);
  return {};
}
