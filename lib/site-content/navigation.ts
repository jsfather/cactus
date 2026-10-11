import { z } from "zod";
import { isAllowedImageReference } from "@/lib/media/reference";

export const navigationLinkSchema = z.object({
  labelFa: z.string().trim().min(1).max(80),
  labelEn: z.string().trim().min(1).max(80),
  href: z
    .string()
    .trim()
    .max(2048)
    .refine(
      (value) =>
        (/^\/(?!\/)[^\\\s]*$/.test(value) && !/^\/en(?:\/|$)/.test(value)) ||
        (URL.canParse(value) && new URL(value).protocol === "https:"),
    ),
});
export const navigationSchema = z.object({
  logoUrl: z
    .string()
    .trim()
    .max(2048)
    .refine((value) => !value || isAllowedImageReference(value)),
  subtitleFa: z.string().trim().max(80),
  subtitleEn: z.string().trim().max(80),
  headerLinks: z
    .array(navigationLinkSchema)
    .max(10)
    .refine(
      (links) => new Set(links.map((link) => link.href)).size === links.length,
    ),
  footerLinks: z
    .array(navigationLinkSchema)
    .max(16)
    .refine(
      (links) => new Set(links.map((link) => link.href)).size === links.length,
    ),
});
export type SiteNavigation = z.infer<typeof navigationSchema>;
export type NavigationLink = z.infer<typeof navigationLinkSchema>;
export const defaultNavigation: SiteNavigation = {
  logoUrl: "",
  subtitleFa: "ROBOTICS",
  subtitleEn: "ROBOTICS",
  headerLinks: [
    { href: "/courses", labelFa: "دوره‌ها", labelEn: "Courses" },
    { href: "/shop", labelFa: "فروشگاه", labelEn: "Shop" },
    { href: "/blog", labelFa: "وبلاگ", labelEn: "Journal" },
    { href: "/teachers", labelFa: "مدرس‌ها", labelEn: "Teachers" },
    { href: "/honors", labelFa: "افتخارات", labelEn: "Achievements" },
    { href: "/requirements", labelFa: "نرم‌افزارها", labelEn: "Software" },
    { href: "/about", labelFa: "درباره ما", labelEn: "About" },
  ],
  footerLinks: [
    {
      href: "/courses",
      labelFa: "دوره‌های آموزشی",
      labelEn: "Learning courses",
    },
    {
      href: "/requirements",
      labelFa: "نرم‌افزارهای مورد نیاز",
      labelEn: "Required software",
    },
    { href: "/teachers", labelFa: "مدرس‌های کاکتوس", labelEn: "Instructors" },
    { href: "/honors", labelFa: "افتخارات", labelEn: "Achievements" },
    { href: "/blog", labelFa: "وبلاگ", labelEn: "Journal" },
    { href: "/shop", labelFa: "فروشگاه", labelEn: "Shop" },
    { href: "/about", labelFa: "درباره ما", labelEn: "About us" },
    { href: "/search", labelFa: "جست‌وجو", labelEn: "Search" },
  ],
};
