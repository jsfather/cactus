import { z } from "zod";
export const resourceKind = z.enum(["faqs", "guides", "requirements"]);
export const resourceLabels = {
  faqs: ["پرسش‌های متداول", "Frequently asked questions"],
  guides: ["راهنمای پنل", "Panel guides"],
  requirements: ["پیش‌نیازهای یادگیری", "Learning requirements"],
} as const;
export const activityKind = z.enum(["homework", "recordings", "reports"]);
export const activityLabels = {
  homework: ["تکالیف", "Homework"],
  recordings: ["جلسات ضبط‌شده", "Recorded lessons"],
  reports: ["گزارش‌های آموزشی", "Teaching reports"],
} as const;
