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
  await requireRole("admin");
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
          logoUrl: settings.logoUrl,
          subtitleFa: settings.subtitleFa,
          subtitleEn: settings.subtitleEn,
        }}
        fields={[
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
            title: fa ? "هویت سایت" : "Site identity",
            fields: ["logoUrl", "subtitleFa", "subtitleEn"],
          },
        ]}
      >
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
