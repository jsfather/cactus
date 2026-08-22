"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { richTextLength, sanitizeRichText } from "@/lib/content/rich-text";
import { getDatabase } from "@/lib/db/client";
import { siteContent } from "@/lib/db/schema";

const optionalEmail = z.string().trim().max(320).refine((value) => !value || z.email().safeParse(value).success);
const contentSchema = z.object({
  contactNumber: z.string().trim().max(80), email: optionalEmail,
  addressFa: z.string().trim().max(1200), addressEn: z.string().trim().max(1200),
  aboutUsFa: z.string().transform(sanitizeRichText).refine((value) => richTextLength(value) >= 20),
  aboutUsEn: z.string().transform(sanitizeRichText), missionFa: z.string().transform(sanitizeRichText).refine((value) => richTextLength(value) >= 20), missionEn: z.string().transform(sanitizeRichText),
  visionFa: z.string().transform(sanitizeRichText).refine((value) => richTextLength(value) >= 20), visionEn: z.string().transform(sanitizeRichText),
  footerTextFa: z.string().trim().min(3).max(500), footerTextEn: z.string().trim().max(500), locale: z.enum(["fa", "en"]),
});
export type AboutFormState = { error?: string; success?: string; fieldErrors?: Record<string, string[]> };

export async function updateSiteContent(_state: AboutFormState, formData: FormData): Promise<AboutFormState> {
  const admin = await requireRole("admin"); const locale = formData.get("locale") === "en" ? "en" : "fa";
  const parsed = contentSchema.safeParse({ contactNumber: formData.get("contactNumber"), email: formData.get("email"), addressFa: formData.get("addressFa"), addressEn: formData.get("addressEn"), aboutUsFa: formData.get("aboutUsFa"), aboutUsEn: formData.get("aboutUsEn"), missionFa: formData.get("missionFa"), missionEn: formData.get("missionEn"), visionFa: formData.get("visionFa"), visionEn: formData.get("visionEn"), footerTextFa: formData.get("footerTextFa"), footerTextEn: formData.get("footerTextEn"), locale: formData.get("locale") });
  if (!parsed.success) return { error: locale === "fa" ? "اطلاعات صفحه درباره ما را بررسی کنید." : "Please review the About page information.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  try {
    await getDatabase().insert(siteContent).values({ key: "about", contactNumber: parsed.data.contactNumber || null, email: parsed.data.email || null, addressFa: parsed.data.addressFa || null, addressEn: parsed.data.addressEn || null, aboutUsFa: parsed.data.aboutUsFa, aboutUsEn: parsed.data.aboutUsEn || null, missionFa: parsed.data.missionFa, missionEn: parsed.data.missionEn || null, visionFa: parsed.data.visionFa, visionEn: parsed.data.visionEn || null, footerTextFa: parsed.data.footerTextFa, footerTextEn: parsed.data.footerTextEn || null, updatedById: admin.id, updatedAt: new Date() }).onConflictDoUpdate({ target: siteContent.key, set: { contactNumber: parsed.data.contactNumber || null, email: parsed.data.email || null, addressFa: parsed.data.addressFa || null, addressEn: parsed.data.addressEn || null, aboutUsFa: parsed.data.aboutUsFa, aboutUsEn: parsed.data.aboutUsEn || null, missionFa: parsed.data.missionFa, missionEn: parsed.data.missionEn || null, visionFa: parsed.data.visionFa, visionEn: parsed.data.visionEn || null, footerTextFa: parsed.data.footerTextFa, footerTextEn: parsed.data.footerTextEn || null, updatedById: admin.id, updatedAt: new Date() } });
  } catch { return { error: locale === "fa" ? "ذخیره اطلاعات انجام نشد." : "The site content could not be saved." }; }
  for (const path of ["/", "/en", "/about", "/en/about", "/blog", "/en/blog", "/shop", "/en/shop", "/panel/admin/about"]) revalidatePath(path);
  return { success: locale === "fa" ? "اطلاعات درباره ما به‌روز شد." : "About content updated." };
}
