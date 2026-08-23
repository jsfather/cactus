import { z } from "zod";
import type { Locale } from "@/lib/i18n/config";
import { isAllowedImageReference } from "@/lib/media/reference";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const persianLetterPattern = /[\u0600-\u06ff]/;

function categoryList(value: string) {
  return [...new Set(value.split(/[,،]/).map((item) => item.trim()).filter(Boolean))];
}

export function createHonorSchema(locale: Locale) {
  const isFa = locale === "fa";
  const required = isFa ? "تکمیل این فیلد الزامی است." : "This field is required.";
  const persianRequired = isFa ? "این فیلد را با حروف فارسی تکمیل کنید." : "Complete this field in Persian.";
  const requiredPersian = (min: number, max: number) => z.string().trim().min(min, required).max(max).refine((value) => persianLetterPattern.test(value), persianRequired);
  const optional = (max: number) => z.string().trim().max(max);
  const categories = (requiredList: boolean) => z.string().trim().max(800).transform(categoryList).refine(
    (items) => (!requiredList || items.length > 0) && items.length <= 12 && items.every((item) => item.length <= 60),
    isFa ? "بین ۱ تا ۱۲ دسته‌بندی کوتاه وارد کنید." : "Enter between 1 and 12 short categories.",
  );

  return z.object({
    slug: z.string().trim().min(2, required).max(180).transform((value) => value.toLowerCase().replace(/\s+/g, "-")).refine(
      (value) => slugPattern.test(value),
      isFa ? "نشانی فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد." : "Use lowercase letters, numbers, and hyphens only.",
    ),
    titleFa: requiredPersian(3, 240),
    titleEn: optional(240),
    descriptionFa: requiredPersian(10, 3_000),
    descriptionEn: optional(3_000),
    organizationFa: requiredPersian(2, 200),
    organizationEn: optional(200),
    locationFa: requiredPersian(2, 160),
    locationEn: optional(160),
    categoriesFa: categories(true),
    categoriesEn: categories(false),
    certificateImageUrl: z.string().trim().min(1, required).max(2_048).refine(
      isAllowedImageReference,
      isFa ? "یک تصویر معتبر برای گواهینامه انتخاب کنید." : "Choose a valid certificate image.",
    ),
    issuedAt: z.string().trim().refine((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const date = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(date.valueOf()) && date <= new Date() && date.getUTCFullYear() >= 1900;
    }, isFa ? "تاریخ صدور معتبر نیست." : "Enter a valid issue date."),
    status: z.enum(["draft", "published"]),
    locale: z.enum(["fa", "en"]),
  });
}

export type HonorInput = z.infer<ReturnType<typeof createHonorSchema>>;
