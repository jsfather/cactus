import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { LandingForm } from "@/components/landings/landing-form";
import { PanelPage, PanelPageHeader } from "@/components/panel/ui";
export default async function NewLanding() {
  await requireRole("admin");
  const locale = await getPanelLocale();
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={locale === "fa" ? "مدیریت محتوا" : "Content management"}
        description={
          locale === "fa"
            ? "بنر بین دو بخش محتوا نمایش داده می‌شود."
            : "The banner appears between the two content sections."
        }
        title={locale === "fa" ? "لندینگ جدید" : "New landing"}
      />
      <LandingForm locale={locale} />
    </PanelPage>
  );
}
