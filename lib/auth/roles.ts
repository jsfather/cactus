import type { UserRole } from "@/lib/db/schema";

export const roleLabels: Record<UserRole, string> = {
  admin: "همکار",
  teacher: "مدرس",
  student: "دانش پژوه",
  member: "عضو عادی",
};

export const roleHome: Record<UserRole, string> = {
  admin: "/panel/admin",
  teacher: "/panel/teacher",
  student: "/panel/student",
  member: "/panel/member",
};
