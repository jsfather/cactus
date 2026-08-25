import { z } from "zod";
import { schedulesOverlap, type TermScheduleValue } from "./schedule";

const optionalInteger = (minimum: number, maximum: number) =>
  z
    .string()
    .trim()
    .refine((value) => !value || /^\d+$/.test(value))
    .transform((value) => (value ? Number(value) : null))
    .refine((value) => value === null || (value >= minimum && value <= maximum));

const scheduleSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
});

export const termLevelSchema = z.object({
  titleFa: z.string().trim().min(2).max(160),
  titleEn: z.string().trim().max(160),
  descriptionFa: z.string().trim().max(1000),
  descriptionEn: z.string().trim().max(1000),
  locale: z.enum(["fa", "en"]),
});

export const termSchema = z
  .object({
    titleFa: z.string().trim().min(3).max(240),
    titleEn: z.string().trim().max(240),
    descriptionFa: z.string().trim().max(4000),
    descriptionEn: z.string().trim().max(4000),
    levelId: z.uuid(),
    status: z.enum(["draft", "enrollment_open", "active", "completed", "cancelled"]),
    deliveryMode: z.enum(["in_person", "online", "hybrid"]),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    capacity: optionalInteger(1, 10000),
    tuitionToman: z.coerce.number().int().min(0).max(9_000_000_000),
    locationFa: z.string().trim().max(500),
    locationEn: z.string().trim().max(500),
    meetingUrl: z.union([z.literal(""), z.url({ protocol: /^https?$/ })]),
    teacherIds: z.array(z.uuid()).min(1).max(30),
    prerequisiteIds: z.array(z.uuid()).max(30),
    schedules: z.array(scheduleSchema).min(1).max(14),
    locale: z.enum(["fa", "en"]),
  })
  .superRefine((data, context) => {
    if (data.endDate < data.startDate) {
      context.addIssue({ code: "custom", path: ["endDate"], message: data.locale === "fa" ? "تاریخ پایان باید پس از تاریخ شروع باشد." : "End date must be on or after the start date." });
    }
    if ((data.deliveryMode === "in_person" || data.deliveryMode === "hybrid") && !data.locationFa) {
      context.addIssue({ code: "custom", path: ["locationFa"], message: data.locale === "fa" ? "نشانی فارسی برای کلاس حضوری الزامی است." : "A Persian location is required for in-person delivery." });
    }
    if ((data.deliveryMode === "online" || data.deliveryMode === "hybrid") && !data.meetingUrl) {
      context.addIssue({ code: "custom", path: ["meetingUrl"], message: data.locale === "fa" ? "پیوند کلاس آنلاین الزامی است." : "An online meeting link is required." });
    }
    const uniqueTeachers = new Set(data.teacherIds);
    if (uniqueTeachers.size !== data.teacherIds.length) {
      context.addIssue({ code: "custom", path: ["teacherIds"], message: data.locale === "fa" ? "هر مدرس را فقط یک‌بار انتخاب کنید." : "Select each teacher only once." });
    }
    const uniquePrerequisites = new Set(data.prerequisiteIds);
    if (uniquePrerequisites.size !== data.prerequisiteIds.length) {
      context.addIssue({ code: "custom", path: ["prerequisiteIds"], message: data.locale === "fa" ? "هر پیش‌نیاز را فقط یک‌بار انتخاب کنید." : "Select each prerequisite only once." });
    }
    for (let first = 0; first < data.schedules.length; first += 1) {
      const schedule = data.schedules[first];
      if (schedule.endTime <= schedule.startTime) {
        context.addIssue({ code: "custom", path: ["schedules"], message: data.locale === "fa" ? "زمان پایان هر جلسه باید پس از زمان شروع باشد." : "Each meeting must end after it starts." });
      }
      for (let second = first + 1; second < data.schedules.length; second += 1) {
        if (schedulesOverlap(schedule as TermScheduleValue, data.schedules[second] as TermScheduleValue)) {
          context.addIssue({ code: "custom", path: ["schedules"], message: data.locale === "fa" ? "زمان جلسه‌های یک روز نباید هم‌پوشانی داشته باشد." : "Meeting times on the same day cannot overlap." });
        }
      }
    }
  });

export function readTermFormData(formData: FormData) {
  let schedules: unknown = [];
  try {
    schedules = JSON.parse(String(formData.get("schedules") || "[]"));
  } catch {
    schedules = [];
  }
  return {
    titleFa: formData.get("titleFa"),
    titleEn: formData.get("titleEn"),
    descriptionFa: formData.get("descriptionFa"),
    descriptionEn: formData.get("descriptionEn"),
    levelId: formData.get("levelId"),
    status: formData.get("status"),
    deliveryMode: formData.get("deliveryMode"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    capacity: formData.get("capacity"),
    tuitionToman: formData.get("tuitionToman"),
    locationFa: formData.get("locationFa"),
    locationEn: formData.get("locationEn"),
    meetingUrl: formData.get("meetingUrl"),
    teacherIds: formData.getAll("teacherIds"),
    prerequisiteIds: formData.getAll("prerequisiteIds"),
    schedules,
    locale: formData.get("locale"),
  };
}
