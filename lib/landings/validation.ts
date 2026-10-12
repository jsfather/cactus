import { z } from "zod";
import { isAllowedImageReference } from "@/lib/media/reference";
import { sanitizeRichText } from "@/lib/content/rich-text";

// Root routes and infrastructure paths must never be shadowed by a managed page.
const reserved = new Set([
  "en",
  "api",
  "media",
  "panel",
  "login",
  "register",
  "logout",
  "about",
  "blog",
  "shop",
  "courses",
  "teachers",
  "honors",
  "requirements",
  "search",
  "cart",
  "checkout",
  "reset-password",
  "forgot-password",
  "sitemap",
  "robots",
  "images",
  "fonts",
  "favicon",
]);
export const landingSlug = z
  .string()
  .trim()
  .min(1)
  .max(180)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .refine((value) => !reserved.has(value));
const short = z.string().trim().max(180);
const rich = z.string().max(200000).transform(sanitizeRichText);
export const ctaSchema = z
  .object({
    titleFa: short,
    titleEn: short,
    textFa: z.string().trim().max(1000),
    textEn: z.string().trim().max(1000),
    labelFa: z.string().trim().max(80),
    labelEn: z.string().trim().max(80),
    href: z
      .string()
      .trim()
      .max(2048)
      .refine(
        (value) =>
          !value ||
          /^\/(?!\/)[^\\\s]*$/.test(value) ||
          (URL.canParse(value) &&
            ["https:", "http:"].includes(new URL(value).protocol)),
      ),
  })
  .refine((value) => !value.href || Boolean(value.titleFa && value.labelFa), {
    path: ["titleFa"],
  });
export const landingSchema = z.object({
  slug: landingSlug,
  titleFa: short.min(1),
  titleEn: short,
  summaryFa: z.string().trim().max(1000),
  summaryEn: z.string().trim().max(1000),
  contentFa: rich,
  contentEn: rich,
  afterCtaFa: rich,
  afterCtaEn: rich,
  coverImageUrl: z.string().trim().max(2048).refine(isAllowedImageReference),
  videoUrl: z
    .string()
    .trim()
    .max(2048)
    .refine(
      (value) =>
        !value ||
        /^\/api\/attachments\/[a-f0-9-]{36}$/.test(value) ||
        (URL.canParse(value) &&
          ["https:", "http:"].includes(new URL(value).protocol)),
    ),
  status: z.enum(["draft", "published"]),
  commentsEnabled: z
    .enum(["true", "false"])
    .transform((value) => value === "true"),
  cta: ctaSchema,
});
