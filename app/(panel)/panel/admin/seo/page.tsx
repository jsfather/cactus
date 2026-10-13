import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getSiteNavigation } from "@/lib/site-content/navigation-server";
import { saveSeo } from "@/lib/site-content/seo-actions";
import { ActionForm } from "@/components/workflows/action-form";
import { PanelPage, PanelPageHeader } from "@/components/panel/ui";

export default async function SeoPage() {
  await requireRole("admin", "seo");
  const [locale, settings] = await Promise.all([getPanelLocale(), getSiteNavigation()]);
  const fa = locale === "fa";
  return <PanelPage><PanelPageHeader eyebrow={fa ? "مدیریت" : "Administration"} title={fa ? "سئو و سرچ کنسول" : "SEO and Search Console"} description={fa ? "عنوان و توضیحات سایت و تأیید مالکیت گوگل؛ این دسترسی امکان تغییر منو، فوتر یا ظاهر سایت را نمی‌دهد." : "Site titles, descriptions, and Google verification. This permission does not allow changing navigation, footer, or appearance."} /><ActionForm locale={locale} action={saveSeo} initial={{ siteTitleFa: settings.siteTitleFa, siteTitleEn: settings.siteTitleEn, descriptionFa: settings.descriptionFa, descriptionEn: settings.descriptionEn, googleVerification: settings.googleVerification }} fields={[{ name: "siteTitleFa", label: fa ? "عنوان سایت فارسی" : "Persian site title", required: true }, { name: "siteTitleEn", label: fa ? "عنوان سایت انگلیسی" : "English site title", required: true }, { name: "descriptionFa", label: fa ? "توضیحات سئو فارسی" : "Persian SEO description", type: "textarea" }, { name: "descriptionEn", label: fa ? "توضیحات سئو انگلیسی" : "English SEO description", type: "textarea" }, { name: "googleVerification", label: "Google Search Console", dir: "ltr", hint: fa ? "فقط مقدار content متاتگ google-site-verification؛ نه کل HTML." : "Only the content value of google-site-verification, not the HTML tag." }]} /></PanelPage>;
}
