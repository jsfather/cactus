"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, deleteSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { getDatabase } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export type LoginState = {
  error?: string;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "ایمیل یا رمز عبور معتبر نیست." };
  }

  const [user] = await getDatabase()
    .select({
      id: users.id,
      passwordHash: users.passwordHash,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.email, parsed.data.email.toLowerCase()))
    .limit(1);

  if (
    !user ||
    !user.isActive ||
    !(await verifyPassword(parsed.data.password, user.passwordHash))
  ) {
    return { error: "ایمیل یا رمز عبور معتبر نیست." };
  }

  await createSession(user.id);
  redirect("/panel");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
