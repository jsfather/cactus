import { z } from "zod";
import type { Locale } from "@/lib/i18n/config";
export type ActionState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
};
export const text = (locale: Locale, fa: string, en: string) =>
  locale === "fa" ? fa : en;
export const title = (
  item: { titleFa: string; titleEn: string | null },
  locale: Locale,
) => (locale === "en" ? item.titleEn || item.titleFa : item.titleFa);
export const optionalUrl = z
  .string()
  .trim()
  .max(2000)
  .refine(
    (v) =>
      !v ||
      /^https?:\/\/[^\s]+$/i.test(v) ||
      /^\/api\/attachments\/[a-f0-9-]+$/.test(v) ||
      /^\/media\/[\w/.-]+$/.test(v),
  );
export const internalHref = z
  .string()
  .max(500)
  .refine((v) => !v || /^\/(?!\/)[\w/?=&%#.-]*$/.test(v));
export function validationError(
  locale: Locale,
  error: z.ZodError,
): ActionState {
  const message = text(
    locale,
    "اطلاعات این بخش را بررسی کنید.",
    "Review this field.",
  );
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues)
    fieldErrors[String(issue.path[0])] = [message];
  return {
    error: text(
      locale,
      "لطفاً فیلدهای مشخص‌شده را بررسی کنید.",
      "Please review the highlighted fields.",
    ),
    fieldErrors,
  };
}
export const saved = (locale: Locale) => ({
  success: text(locale, "تغییرات ذخیره شد.", "Changes saved."),
});
export const denied = (locale: Locale) => ({
  error: text(
    locale,
    "این مورد در دسترس نیست یا اجازه تغییر آن را ندارید.",
    "This item is unavailable or you do not have permission to change it.",
  ),
});
export const failed = (locale: Locale) => ({
  error: text(
    locale,
    "ذخیره انجام نشد. اطلاعات و ارتباط‌های این مورد را بررسی کنید.",
    "Could not save. Check this item's values and related records.",
  ),
});
