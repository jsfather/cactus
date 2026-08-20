import type { UserRole } from "@/lib/db/schema";

export const roleLabels: Record<UserRole, string> = {
  admin: "مدیر",
  teacher: "مدرس",
  student: "دانش‌آموز",
  member: "عضو عادی",
};

export const roleHome: Record<UserRole, string> = {
  admin: "/panel/admin",
  teacher: "/panel/teacher",
  student: "/panel/student",
  member: "/panel/member",
};
