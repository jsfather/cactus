import { z } from "zod";
import { richTextLength, sanitizeRichText } from "@/lib/content/rich-text";
import type { Locale } from "@/lib/i18n/config";
import {
  isValidIranianNationalCode,
  normalizeNationalCode,
} from "@/lib/student-information/validation";

const persianLetterPattern = /[\u0600-\u06ff]/;

function parseJsonArray(value: unknown) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function createTeacherProfileSchema(locale: Locale) {
  const isFa = locale === "fa";
  const required = isFa ? "تکمیل این فیلد الزامی است." : "This field is required.";
  const persianRequired = isFa
    ? "این فیلد را با حروف فارسی تکمیل کنید."
    : "Complete this field in Persian.";
  const richRequired = isFa
    ? "محتوای فارسی این بخش را تکمیل کنید."
    : "Add the Persian content for this section.";
  const requiredPersian = (max: number) => z.string().trim().min(1, required).max(max).refine(
    (value) => persianLetterPattern.test(value),
    persianRequired,
  );
  const optionalText = (max: number) => z.string().trim().max(max);
  const requiredRichText = z.string().transform(sanitizeRichText)
    .refine((value) => richTextLength(value) >= 10, richRequired)
    .refine(
      (value) => richTextLength(value) <= 20_000,
      isFa ? "متن این بخش بیش از حد طولانی است." : "This content is too long.",
    );
  const optionalRichText = z.string().transform(sanitizeRichText).refine(
    (value) => richTextLength(value) <= 20_000,
    isFa ? "متن این بخش بیش از حد طولانی است." : "This content is too long.",
  );

  const skillSchema = z.object({
    nameFa: requiredPersian(120),
    nameEn: optionalText(120),
    score: z.coerce.number().int().min(0).max(100),
  });
  const workSchema = z.object({
    companyFa: requiredPersian(180),
    companyEn: optionalText(180),
    positionFa: requiredPersian(180),
    positionEn: optionalText(180),
    periodFa: z.string().trim().min(1, required).max(120),
    periodEn: optionalText(120),
    descriptionFa: z.string().trim().max(2_000),
    descriptionEn: z.string().trim().max(2_000),
  });
  const educationSchema = z.object({
    institutionFa: requiredPersian(180),
    institutionEn: optionalText(180),
    degreeFa: requiredPersian(160),
    degreeEn: optionalText(160),
    fieldFa: requiredPersian(180),
    fieldEn: optionalText(180),
    periodFa: z.string().trim().min(1, required).max(120),
    periodEn: optionalText(120),
    descriptionFa: z.string().trim().max(2_000),
    descriptionEn: z.string().trim().max(2_000),
  });

  return z.object({
    firstNameFa: requiredPersian(80),
    lastNameFa: requiredPersian(80),
    firstNameEn: optionalText(80),
    lastNameEn: optionalText(80),
    email: z.union([z.literal(""), z.string().trim().email().max(320)]),
    avatarUrl: z.string().trim().max(2_048),
    username: z.string().trim().toLowerCase().min(3, required).max(32).regex(
      /^[a-z0-9_]+$/,
      isFa
        ? "نام کاربری فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و زیرخط باشد."
        : "Use lowercase letters, numbers, and underscores only.",
    ),
    nationalCode: z.string().trim().transform(normalizeNationalCode).refine(
      isValidIranianNationalCode,
      isFa ? "کد ملی معتبر نیست." : "Enter a valid Iranian national ID.",
    ),
    cityFa: requiredPersian(120),
    cityEn: optionalText(120),
    biographyFa: requiredRichText,
    biographyEn: optionalRichText,
    aboutFa: requiredRichText,
    aboutEn: optionalRichText,
    achievementsFa: optionalRichText,
    achievementsEn: optionalRichText,
    memberSince: z.string().trim().refine((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const date = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(date.valueOf()) && date <= new Date() && date.getUTCFullYear() >= 1900;
    }, isFa ? "تاریخ عضویت معتبر نیست." : "Enter a valid membership date."),
    isPublic: z.boolean(),
    skills: z.preprocess(parseJsonArray, z.array(skillSchema).max(30)),
    workExperiences: z.preprocess(parseJsonArray, z.array(workSchema).max(30)),
    educations: z.preprocess(parseJsonArray, z.array(educationSchema).max(30)),
  });
}

export type TeacherProfileInput = z.infer<ReturnType<typeof createTeacherProfileSchema>>;
