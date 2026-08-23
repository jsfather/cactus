import { z } from "zod";
import { toLatinDigits } from "@/lib/auth/mobile";
import type { Locale } from "@/lib/i18n/config";

const persianLetterPattern = /[\u0600-\u06ff]/;

export function normalizeNationalCode(value: string) {
  return toLatinDigits(value).replace(/\D/g, "");
}

export function isValidIranianNationalCode(value: string) {
  const code = normalizeNationalCode(value);
  if (!/^\d{10}$/.test(code) || /^(\d)\1{9}$/.test(code)) return false;

  const checksum = Number(code[9]);
  const sum = code
    .slice(0, 9)
    .split("")
    .reduce((total, digit, index) => total + Number(digit) * (10 - index), 0);
  const remainder = sum % 11;
  return checksum === (remainder < 2 ? remainder : 11 - remainder);
}

function requiredPersian(max: number, message: string) {
  return z.string().trim().min(1, message).max(max).refine(
    (value) => persianLetterPattern.test(value),
    message,
  );
}

export function createStudentInformationSchema(locale: Locale) {
  const isFa = locale === "fa";
  const required = isFa ? "تکمیل این فیلد الزامی است." : "This field is required.";
  const persianRequired = isFa
    ? "این فیلد را با حروف فارسی تکمیل کنید."
    : "Complete this field in Persian.";

  return z.object({
    firstNameFa: requiredPersian(80, persianRequired),
    lastNameFa: requiredPersian(80, persianRequired),
    firstNameEn: z.string().trim().max(80),
    lastNameEn: z.string().trim().max(80),
    email: z.union([z.literal(""), z.string().trim().email().max(320)]),
    avatarUrl: z.string().trim().max(2048),
    username: z.string().trim().toLowerCase().min(3, required).max(32).regex(
      /^[a-z0-9_]+$/,
      isFa
        ? "نام کاربری فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و زیرخط باشد."
        : "Use lowercase letters, numbers, and underscores only.",
    ),
    nationalCode: z.string().trim().transform(normalizeNationalCode).refine(
      (value) => !value || isValidIranianNationalCode(value),
      isFa ? "کد ملی معتبر نیست." : "Enter a valid Iranian national ID.",
    ),
    birthDate: z.string().trim().refine((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const date = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(date.valueOf()) && date <= new Date() && date.getUTCFullYear() >= 1900;
    }, isFa ? "تاریخ تولد معتبر نیست." : "Enter a valid birth date."),
    educationLevelFa: requiredPersian(120, persianRequired),
    educationLevelEn: z.string().trim().max(120),
    fatherNameFa: requiredPersian(160, persianRequired),
    fatherNameEn: z.string().trim().max(160),
    motherNameFa: requiredPersian(160, persianRequired),
    motherNameEn: z.string().trim().max(160),
    fatherOccupationFa: requiredPersian(180, persianRequired),
    fatherOccupationEn: z.string().trim().max(180),
    motherOccupationFa: requiredPersian(180, persianRequired),
    motherOccupationEn: z.string().trim().max(180),
    allergyStatus: z.enum(["none", "has_allergy"]),
    allergyDescriptionFa: z.string().trim().max(500),
    allergyDescriptionEn: z.string().trim().max(500),
    interestLevel: z.coerce.number().int().min(1).max(100),
    focusLevel: z.coerce.number().int().min(1).max(100),
    intent: z.enum(["draft", "submit"]),
  }).superRefine((value, context) => {
    if (value.allergyStatus === "has_allergy" && !persianLetterPattern.test(value.allergyDescriptionFa)) {
      context.addIssue({
        code: "custom",
        path: ["allergyDescriptionFa"],
        message: persianRequired,
      });
    }
  });
}

export type StudentInformationInput = z.infer<ReturnType<typeof createStudentInformationSchema>>;

