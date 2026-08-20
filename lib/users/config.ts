import type { UserRole } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

export const userSectionConfig: Record<
  UserRole,
  {
    path: string;
    singular: string;
    plural: string;
    description: string;
  }
> = {
  admin: {
    path: "/panel/admin/admins",
    singular: "مدیر",
    plural: "مدیران",
    description: "حساب‌های مدیریتی و سطح دسترسی کامل سامانه را مدیریت کنید.",
  },
  teacher: {
    path: "/panel/admin/teachers",
    singular: "مدرس",
    plural: "مدرسان",
    description: "حساب‌های مدرسان مدرسه و وضعیت دسترسی آن‌ها را مدیریت کنید.",
  },
  student: {
    path: "/panel/admin/students",
    singular: "دانش‌آموز",
    plural: "دانش‌آموزان",
    description: "حساب‌های دانش‌آموزان و وضعیت دسترسی آن‌ها را مدیریت کنید.",
  },
};

const englishLabels: Record<UserRole, { singular: string; plural: string; description: string }> = {
  admin: { singular: "Administrator", plural: "Administrators", description: "Manage accounts with full administrative access." },
  teacher: { singular: "Teacher", plural: "Teachers", description: "Manage school teacher accounts and their access status." },
  student: { singular: "Student", plural: "Students", description: "Manage student accounts and their access status." },
};

export function getUserSectionConfig(role: UserRole, locale: Locale) {
  return locale === "fa" ? userSectionConfig[role] : { ...englishLabels[role], path: userSectionConfig[role].path };
}
