import type { UserRole } from "@/lib/db/schema";

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
