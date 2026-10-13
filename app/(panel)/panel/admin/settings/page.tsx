import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getSiteNavigation } from "@/lib/site-content/navigation-server";
import { saveNavigation } from "@/lib/site-content/actions";
import { NavigationEditor } from "@/components/panel/navigation-editor";
import { ActionForm } from "@/components/workflows/action-form";
import {
  PanelPage,
  PanelPageHeader,
  PanelDashboardCard,
} from "@/components/panel/ui";

export default async function SiteSettings() {
  await requireRole("admin", "settings");
  const [locale, settings] = await Promise.all([
    getPanelLocale(),
    getSiteNavigation(),
  ]);
  const fa = locale === "fa";
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={fa ? "مدیریت سایت" : "Site management"}
        title={fa ? "تنظیمات سایت" : "Site settings"}
        description={
          fa
            ? "هویت بصری، هدر، فوتر و محتوای ثابت سایت را از اینجا مدیریت کنید."
            : "Manage site identity, header, footer and fixed content."
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <PanelDashboardCard href="/panel/admin/settings/appearance" eyebrow={fa ? "دیزاین سیستم" : "Design system"} title={fa ? "رنگ‌ها و تایپوگرافی" : "Colors & typography"} description={fa ? "رنگ‌های روشن و تاریک با راهنمای محل استفاده" : "Light and dark palettes with usage labels"} />
        <PanelDashboardCard href="/panel/admin/landings" eyebrow={fa ? "صفحه‌های مستقل" : "Standalone pages"} title={fa ? "لندینگ‌ساز" : "Landing builder"} description={fa ? "محتوا، تصویر، ویدیو، دعوت به اقدام و دیدگاه" : "Content, image, video, call to action and comments"} />
        <PanelDashboardCard
          href="/panel/admin/pages"
          eyebrow={fa ? "صفحه اصلی" : "Homepage"}
          title={fa ? "ویرایش صفحات ثابت" : "Edit static pages"}
          description={
            fa
              ? "هیرو، بنر مسابقات، عنوان‌ها و رضایت دانش‌پژوهان"
              : "Hero, event banner, headings and testimonials"
          }
        />
        <PanelDashboardCard
          href="/panel/admin/about"
          eyebrow={fa ? "معرفی و ارتباط" : "About & contact"}
          title={fa ? "درباره ما و اطلاعات تماس" : "About us & contact"}
          description={
            fa
              ? "متن معرفی، مأموریت، نشانی و متن حقوقی فوتر"
              : "About text, mission, address and footer copyright"
          }
        />
      </div>
      <ActionForm
        locale={locale}
        action={saveNavigation}
        initial={{
          faviconUrl: settings.faviconUrl,
          loadingIconUrl: settings.loadingIconUrl,
          logoUrl: settings.logoUrl,
          subtitleFa: settings.subtitleFa,
          subtitleEn: settings.subtitleEn,
          siteTitleFa: settings.siteTitleFa,
          siteTitleEn: settings.siteTitleEn,
          descriptionFa: settings.descriptionFa,
          descriptionEn: settings.descriptionEn,
          googleVerification: settings.googleVerification,
        }}
        fields={[
          {name: "faviconUrl", label: fa ? "فاوآیکن مرورگر" : "Browser favicon", type: "image", hint: fa ? "تصویر مربعی PNG پیشنهاد می‌شود؛ اگر انتخاب نشود، لوگوی سایت و سپس نشان پیش‌فرض استفاده می‌شود." : "A square PNG is recommended. Leave empty to use the site logo, then the default mark."},
          { name: "loadingIconUrl", label: fa ? "نشان بارگذاری" : "Loading icon", type: "image", hint: fa ? "با حذف تصویر، نشان کاکتوس نمایش داده می‌شود." : "Leave empty to use the Cactus mark." },
          {
            name: "siteTitleFa",
            label: fa
              ? "عنوان سایت و سئو (فارسی)"
              : "Site / SEO title (Persian)",
            required: true,
          },
          {
            name: "siteTitleEn",
            label: fa
              ? "عنوان سایت و سئو (انگلیسی)"
              : "Site / SEO title (English)",
            required: true,
          },
          {
            name: "descriptionFa",
            label: fa ? "توضیحات سئو (فارسی)" : "SEO description (Persian)",
            type: "textarea",
          },
          {
            name: "descriptionEn",
            label: fa ? "توضیحات سئو (انگلیسی)" : "SEO description (English)",
            type: "textarea",
          },
          {
            name: "googleVerification",
            label: "Google Search Console",
            dir: "ltr",
            hint: fa
              ? "فقط مقدار content متاتگ google-site-verification را وارد کنید، نه کد HTML کامل."
              : "Enter only the content value of google-site-verification, not the complete HTML tag.",
          },
          {
            name: "logoUrl",
            label: fa ? "نشان هدر و فوتر" : "Header and footer logo",
            type: "image",
            hint: fa
              ? "با حذف تصویر، نشان اصلی کاکتوس استفاده می‌شود."
              : "Leave empty to use the original Cactus mark.",
          },
          {
            name: "subtitleFa",
            label: fa ? "زیرعنوان نشان در فارسی" : "Brand subtitle in Persian",
          },
          {
            name: "subtitleEn",
            label: fa
              ? "زیرعنوان نشان در انگلیسی"
              : "Brand subtitle in English",
          },
        ]}
        sections={[
          {
            title: fa ? "عنوان و توضیحات سایت" : "Site title and description",
            fields: [
              "siteTitleFa",
              "siteTitleEn",
              "descriptionFa",
              "descriptionEn",
              "googleVerification",
            ],
          },
          {
            title: fa ? "هویت سایت" : "Site identity",
            fields: ["logoUrl", "faviconUrl", "loadingIconUrl", "subtitleFa", "subtitleEn"],
          },
        ]}
      >
        <NavigationEditor
          name="socialLinks"
          initial={settings.socialLinks}
          locale={locale}
        />
        <NavigationEditor
          name="headerLinks"
          initial={settings.headerLinks}
          locale={locale}
        />
        <NavigationEditor
          name="footerLinks"
          initial={settings.footerLinks}
          locale={locale}
        />
      </ActionForm>
    </PanelPage>
  );
}
