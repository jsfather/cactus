"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import { studentInformation, users } from "@/lib/db/schema";
import { isAllowedImageReference } from "@/lib/media/reference";
import { createStudentInformationSchema } from "@/lib/student-information/validation";

export type StudentInformationFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function readFormData(formData: FormData) {
  return {
    firstNameFa: formData.get("firstNameFa"),
    lastNameFa: formData.get("lastNameFa"),
    firstNameEn: formData.get("firstNameEn"),
    lastNameEn: formData.get("lastNameEn"),
    email: formData.get("email"),
    avatarUrl: formData.get("avatarUrl"),
    username: formData.get("username"),
    nationalCode: formData.get("nationalCode"),
    birthDate: formData.get("birthDate"),
    educationLevelFa: formData.get("educationLevelFa"),
    educationLevelEn: formData.get("educationLevelEn"),
    fatherNameFa: formData.get("fatherNameFa"),
    fatherNameEn: formData.get("fatherNameEn"),
    motherNameFa: formData.get("motherNameFa"),
    motherNameEn: formData.get("motherNameEn"),
    fatherOccupationFa: formData.get("fatherOccupationFa"),
    fatherOccupationEn: formData.get("fatherOccupationEn"),
    motherOccupationFa: formData.get("motherOccupationFa"),
    motherOccupationEn: formData.get("motherOccupationEn"),
    allergyStatus: formData.get("allergyStatus"),
    allergyDescriptionFa: formData.get("allergyDescriptionFa"),
    allergyDescriptionEn: formData.get("allergyDescriptionEn"),
    interestLevel: formData.get("interestLevel"),
    focusLevel: formData.get("focusLevel"),
    intent: "submit",
  };
}

export async function submitStudentInformation(
  _previousState: StudentInformationFormState,
  formData: FormData,
): Promise<StudentInformationFormState> {
  const user = await requireRole("student");
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  const parsed = createStudentInformationSchema(locale).safeParse(readFormData(formData));
  if (!parsed.success || !isAllowedImageReference(String(formData.get("avatarUrl") || ""))) {
    return {
      error: locale === "fa" ? "لطفاً اطلاعات دانش پژوه را بررسی کنید." : "Please review the student information.",
      fieldErrors: parsed.success ? { avatarUrl: [locale === "fa" ? "تصویر پروفایل معتبر نیست." : "The profile image is invalid."] } : parsed.error.flatten().fieldErrors,
    };
  }

  const database = getDatabase();
  const [current] = await database.select({ status: studentInformation.status })
    .from(studentInformation)
    .where(eq(studentInformation.userId, user.id))
    .limit(1);
  if (current?.status === "pending" || current?.status === "approved") {
    return { error: locale === "fa" ? "این پرونده اکنون قابل ویرایش نیست." : "This submission cannot currently be edited." };
  }

  const now = new Date();
  try {
    await database.transaction(async (transaction) => {
      await transaction.update(users).set({
        firstNameFa: parsed.data.firstNameFa,
        lastNameFa: parsed.data.lastNameFa,
        firstNameEn: parsed.data.firstNameEn,
        lastNameEn: parsed.data.lastNameEn,
        email: parsed.data.email ? parsed.data.email.toLowerCase() : null,
        avatarUrl: parsed.data.avatarUrl || null,
        updatedAt: now,
      }).where(and(eq(users.id, user.id), eq(users.role, "student")));

      const values = {
        username: parsed.data.username,
        nationalCode: parsed.data.nationalCode || null,
        birthDate: parsed.data.birthDate,
        educationLevelFa: parsed.data.educationLevelFa,
        educationLevelEn: parsed.data.educationLevelEn || null,
        fatherNameFa: parsed.data.fatherNameFa,
        fatherNameEn: parsed.data.fatherNameEn || null,
        motherNameFa: parsed.data.motherNameFa,
        motherNameEn: parsed.data.motherNameEn || null,
        fatherOccupationFa: parsed.data.fatherOccupationFa,
        fatherOccupationEn: parsed.data.fatherOccupationEn || null,
        motherOccupationFa: parsed.data.motherOccupationFa,
        motherOccupationEn: parsed.data.motherOccupationEn || null,
        allergyStatus: parsed.data.allergyStatus,
        allergyDescriptionFa: parsed.data.allergyStatus === "has_allergy" ? parsed.data.allergyDescriptionFa : null,
        allergyDescriptionEn: parsed.data.allergyStatus === "has_allergy" ? parsed.data.allergyDescriptionEn || null : null,
        interestLevel: parsed.data.interestLevel,
        focusLevel: parsed.data.focusLevel,
        status: "pending" as const,
        rejectionReason: null,
        submittedAt: now,
        reviewedAt: null,
        reviewedById: null,
        updatedAt: now,
      };
      await transaction.insert(studentInformation).values({ userId: user.id, ...values })
        .onConflictDoUpdate({ target: studentInformation.userId, set: values });
    });
  } catch (error) {
    if (hasPostgresErrorCode(error, "23505")) {
      return { error: locale === "fa" ? "نام کاربری، کد ملی یا ایمیل قبلاً استفاده شده است." : "The username, national ID, or email is already in use." };
    }
    throw error;
  }

  revalidatePath("/panel", "layout");
  revalidatePath("/panel/admin/students");
  redirect("/panel/student/information?submitted=1");
}

