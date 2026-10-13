export const permissionSections = [
  { key: "support", fa: "پشتیبانی و چت آنلاین", en: "Support and live chat", href: "/panel/tickets" },
  { key: "finance", fa: "سفارش‌ها و امور مالی", en: "Orders and finance", href: "/panel/orders" },
  { key: "content", fa: "محتوا، وبلاگ و لندینگ‌ها", en: "Content, blog, and landings", href: "/panel/admin/blog" },
  { key: "seo", fa: "سئو و سرچ کنسول", en: "SEO and Search Console", href: "/panel/admin/seo" },
  { key: "shop", fa: "محصولات و دسته‌بندی‌ها", en: "Products and categories", href: "/panel/admin/products" },
  { key: "education", fa: "دوره‌ها، ترم‌ها و آموزش", en: "Courses, terms, and learning", href: "/panel/admin/terms" },
  { key: "media", fa: "کتابخانه رسانه", en: "Media library", href: "/panel/admin/media" },
  { key: "settings", fa: "تنظیمات و ظاهر سایت", en: "Site settings and appearance", href: "/panel/admin/settings" },
] as const;
export type Permission = typeof permissionSections[number]["key"];
export type PermissionUser = { role: string; accessProfileId?: string | null; permissions?: readonly string[] };
export function isAdministrator(user: PermissionUser | null | undefined, permission?: Permission) {
  return Boolean(user?.role === "admin" && (!user.accessProfileId || (permission && user.permissions?.includes(permission))));
}
export function permissionForPath(path: string): Permission | null {
  if (path.startsWith("/panel/tickets")) return "support";
  if (path.startsWith("/panel/orders")) return "finance";
  const section = path.split("/")[3];
  if (["departments", "live-chat"].includes(section)) return "support";
  if (["blog", "comments", "landings", "about", "pages", "honors", "resources"].includes(section)) return "content";
  if (["products", "product-categories"].includes(section)) return "shop";
  if (["academic", "courses", "terms", "term-levels", "attendance", "absences", "exams", "exam-assignments", "learning"].includes(section)) return "education";
  if (section === "seo") return "seo";
  if (section === "media") return "media";
  if (section === "settings") return "settings";
  return null;
}
export function canVisitPanelPath(user: PermissionUser, path: string) {
  if (user.role !== "admin" || !user.accessProfileId) return true;
  if (["/panel/admin", "/panel/profile", "/panel/admin/profile", "/panel/notifications"].includes(path)) return true;
  const permission = permissionForPath(path);
  return Boolean(permission && isAdministrator(user, permission));
}
