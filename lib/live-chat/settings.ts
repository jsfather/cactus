import { z } from "zod";
import { isAllowedImageReference } from "@/lib/media/reference";
export const chatSettingsSchema = z
  .object({
    enabled: z.enum(["true", "false"]).default("true"),
    color: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/)
      .default("#009b69"),
    logoUrl: z
      .string()
      .max(2048)
      .refine((value) => !value || isAllowedImageReference(value))
      .default(""),
    greetingFa: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default("اگر سوالی دارید همکاران ما در بخش پشتیبانی در خدمت شما هستند."),
    greetingEn: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default("Have a question? Our support team is here to help."),
    awayFa: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(
        "در حال حاضر خارج از ساعت پاسخ‌گویی هستیم؛ پیام شما ثبت می‌شود و در اولین فرصت پاسخ می‌دهیم.",
      ),
    awayEn: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(
        "We are currently away. Leave a message and we will reply as soon as possible.",
      ),
    startHour: z.coerce.number().int().min(0).max(23).default(9),
    endHour: z.coerce.number().int().min(1).max(24).default(18),
    workingDays: z
      .array(z.coerce.number().int().min(0).max(6))
      .min(1)
      .max(7)
      .default([0, 1, 2, 3, 6]),
    idleMinutes: z.coerce.number().int().min(1).max(1440).default(10),
    operatorIds: z.array(z.uuid()).max(50).default([]),
  })
  .refine((value) => value.endHour > value.startHour, {
    path: ["endHour"],
    message: "End hour must follow start hour.",
  });
export type ChatSettings = z.infer<typeof chatSettingsSchema>;
export const defaultChatSettings = chatSettingsSchema.parse({});
export function isChatOfficeOpen(settings: ChatSettings, now = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Asia/Tehran",
    }).format(now),
  );
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Asia/Tehran",
  }).format(now);
  return (
    settings.workingDays.includes(
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday),
    ) &&
    hour >= settings.startHour &&
    hour < settings.endHour
  );
}
