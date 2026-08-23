"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { hasPostgresErrorCode } from "@/lib/db/errors";
import {
  teacherEducations,
  teacherProfiles,
  teacherSkills,
  teacherWorkExperiences,
  users,
} from "@/lib/db/schema";
import { isAllowedImageReference } from "@/lib/media/reference";
import { createTeacherProfileSchema, type TeacherProfileInput } from "@/lib/teacher-profiles/validation";

export type TeacherProfileFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export type DeleteTeacherProfileState = {
  error?: string;
  success?: string;
};

function readTeacherProfileForm(formData: FormData) {
  return {
    firstNameFa: formData.get("firstNameFa"),
    lastNameFa: formData.get("lastNameFa"),
    firstNameEn: formData.get("firstNameEn"),
    lastNameEn: formData.get("lastNameEn"),
    email: formData.get("email"),
    avatarUrl: formData.get("avatarUrl"),
    username: formData.get("username"),
    nationalCode: formData.get("nationalCode"),
    cityFa: formData.get("cityFa"),
    cityEn: formData.get("cityEn"),
    biographyFa: formData.get("biographyFa"),
    biographyEn: formData.get("biographyEn"),
    aboutFa: formData.get("aboutFa"),
    aboutEn: formData.get("aboutEn"),
    achievementsFa: formData.get("achievementsFa"),
    achievementsEn: formData.get("achievementsEn"),
    memberSince: formData.get("memberSince"),
    isPublic: formData.get("isPublic") === "on",
    skills: formData.get("skillsJson"),
    workExperiences: formData.get("workExperiencesJson"),
    educations: formData.get("educationsJson"),
  };
}

function revalidateTeacherProfilePaths() {
  revalidatePath("/", "layout");
  revalidatePath("/teachers");
  revalidatePath("/en/teachers");
  revalidatePath("/panel/admin/teachers");
  revalidatePath("/panel/teacher/profile");
}

async function persistTeacherProfile(userId: string, data: TeacherProfileInput) {
  const database = getDatabase();
  const now = new Date();
  await database.transaction(async (transaction) => {
    const [updatedAccount] = await transaction
      .update(users)
      .set({
        firstNameFa: data.firstNameFa,
        lastNameFa: data.lastNameFa,
        firstNameEn: data.firstNameEn,
        lastNameEn: data.lastNameEn,
        email: data.email ? data.email.toLowerCase() : null,
        avatarUrl: data.avatarUrl || null,
        updatedAt: now,
      })
      .where(and(eq(users.id, userId), eq(users.role, "teacher")))
      .returning({ id: users.id });
    if (!updatedAccount) throw new Error("TEACHER_NOT_FOUND");

    const values = {
      username: data.username,
      nationalCode: data.nationalCode,
      cityFa: data.cityFa,
      cityEn: data.cityEn || null,
      biographyFa: data.biographyFa,
      biographyEn: data.biographyEn || null,
      aboutFa: data.aboutFa,
      aboutEn: data.aboutEn || null,
      achievementsFa: data.achievementsFa || null,
      achievementsEn: data.achievementsEn || null,
      memberSince: data.memberSince,
      isPublic: data.isPublic,
      updatedAt: now,
    };
    const [profile] = await transaction
      .insert(teacherProfiles)
      .values({ userId, ...values })
      .onConflictDoUpdate({ target: teacherProfiles.userId, set: values })
      .returning({ id: teacherProfiles.id });

    await transaction.delete(teacherSkills).where(eq(teacherSkills.teacherProfileId, profile.id));
    await transaction.delete(teacherWorkExperiences).where(eq(teacherWorkExperiences.teacherProfileId, profile.id));
    await transaction.delete(teacherEducations).where(eq(teacherEducations.teacherProfileId, profile.id));

    if (data.skills.length) {
      await transaction.insert(teacherSkills).values(data.skills.map((skill, index) => ({
        teacherProfileId: profile.id,
        nameFa: skill.nameFa,
        nameEn: skill.nameEn || null,
        score: skill.score,
        sortOrder: index + 1,
      })));
    }
    if (data.workExperiences.length) {
      await transaction.insert(teacherWorkExperiences).values(data.workExperiences.map((experience, index) => ({
        teacherProfileId: profile.id,
        companyFa: experience.companyFa,
        companyEn: experience.companyEn || null,
        positionFa: experience.positionFa,
        positionEn: experience.positionEn || null,
        periodFa: experience.periodFa,
        periodEn: experience.periodEn || null,
        descriptionFa: experience.descriptionFa || null,
        descriptionEn: experience.descriptionEn || null,
        sortOrder: index + 1,
      })));
    }
    if (data.educations.length) {
      await transaction.insert(teacherEducations).values(data.educations.map((education, index) => ({
        teacherProfileId: profile.id,
        institutionFa: education.institutionFa,
        institutionEn: education.institutionEn || null,
        degreeFa: education.degreeFa,
        degreeEn: education.degreeEn || null,
        fieldFa: education.fieldFa,
        fieldEn: education.fieldEn || null,
        periodFa: education.periodFa,
        periodEn: education.periodEn || null,
        descriptionFa: education.descriptionFa || null,
        descriptionEn: education.descriptionEn || null,
        sortOrder: index + 1,
      })));
    }
  });
}

async function validateAndSave(userId: string, formData: FormData): Promise<TeacherProfileFormState> {
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  const parsed = createTeacherProfileSchema(locale).safeParse(readTeacherProfileForm(formData));
  if (!parsed.success) {
    return {
      error: locale === "fa" ? "لطفاً اطلاعات پروفایل حرفه‌ای را بررسی کنید." : "Please review the professional profile.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (!isAllowedImageReference(parsed.data.avatarUrl)) {
    return {
      error: locale === "fa" ? "تصویر پروفایل معتبر نیست." : "The profile image is invalid.",
      fieldErrors: { avatarUrl: [locale === "fa" ? "یک تصویر معتبر انتخاب کنید." : "Choose a valid image."] },
    };
  }

  try {
    await persistTeacherProfile(userId, parsed.data);
  } catch (error) {
    if (error instanceof Error && error.message === "TEACHER_NOT_FOUND") {
      return { error: locale === "fa" ? "حساب مدرس دیگر وجود ندارد." : "The teacher account no longer exists." };
    }
    if (hasPostgresErrorCode(error, "23505")) {
      return { error: locale === "fa" ? "نام کاربری، کد ملی یا ایمیل قبلاً استفاده شده است." : "The username, national ID, or email is already in use." };
    }
    throw error;
  }
  revalidateTeacherProfilePaths();
  return {};
}

export async function saveOwnTeacherProfile(
  _previousState: TeacherProfileFormState,
  formData: FormData,
): Promise<TeacherProfileFormState> {
  const teacher = await requireRole("teacher");
  const result = await validateAndSave(teacher.id, formData);
  if (result.error) return result;
  redirect("/panel/teacher/profile?saved=1");
}

export async function saveAdminTeacherProfile(
  teacherId: string,
  _previousState: TeacherProfileFormState,
  formData: FormData,
): Promise<TeacherProfileFormState> {
  await requireRole("admin");
  const validId = z.uuid().safeParse(teacherId);
  const locale = formData.get("locale") === "en" ? "en" : "fa";
  if (!validId.success) {
    return { error: locale === "fa" ? "شناسه مدرس معتبر نیست." : "The teacher identifier is invalid." };
  }
  const result = await validateAndSave(validId.data, formData);
  if (result.error) return result;
  redirect(`/panel/admin/teachers/${validId.data}/profile?saved=1`);
}

export async function deleteAdminTeacherProfile(
  teacherId: string,
  locale: "fa" | "en",
): Promise<DeleteTeacherProfileState> {
  await requireRole("admin");
  const validId = z.uuid().safeParse(teacherId);
  if (!validId.success) {
    return { error: locale === "fa" ? "شناسه مدرس معتبر نیست." : "The teacher identifier is invalid." };
  }
  const [deleted] = await getDatabase()
    .delete(teacherProfiles)
    .where(eq(teacherProfiles.userId, validId.data))
    .returning({ id: teacherProfiles.id });
  if (!deleted) {
    return { error: locale === "fa" ? "پروفایل حرفه‌ای برای حذف وجود ندارد." : "There is no professional profile to delete." };
  }
  revalidateTeacherProfilePaths();
  return { success: locale === "fa" ? "پروفایل حرفه‌ای حذف شد." : "Professional profile deleted." };
}
