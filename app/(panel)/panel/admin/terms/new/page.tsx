import { PanelBackLink, PanelEmptyState, PanelPage, PanelPageHeader, PanelPrimaryLink, PanelSurface } from "@/components/panel/ui";
import { TermForm } from "@/components/terms/term-form";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getTermOptions } from "@/lib/terms/queries";

export default async function NewTermPage() {
  const locale = await getPanelLocale(); const options = await getTermOptions(locale); const isFa = locale === "fa";
  return <PanelPage><PanelBackLink href="/panel/admin/terms">{isFa ? "بازگشت" : "Back"}</PanelBackLink><PanelPageHeader eyebrow={isFa ? "آموزش و برنامه‌ریزی" : "Learning and scheduling"} title={isFa ? "ترم جدید" : "New term"} description={isFa ? "مشخصات، مدرس‌ها، پیش‌نیازها و برنامه هفتگی را یکجا تعریف کنید." : "Define information, teachers, prerequisites, and the weekly schedule together."} />
    {!options.levels.length ? <PanelSurface><PanelEmptyState title={isFa ? "ابتدا یک سطح بسازید" : "Create a level first"} description={isFa ? "هر ترم باید به یک سطح آموزشی قابل مدیریت متصل باشد." : "Every term must use a manageable learning level."} action={<PanelPrimaryLink href="/panel/admin/term-levels/new">{isFa ? "ساخت سطح" : "Create level"}</PanelPrimaryLink>} /></PanelSurface> : <TermForm locale={locale} {...options} />}
  </PanelPage>;
}
