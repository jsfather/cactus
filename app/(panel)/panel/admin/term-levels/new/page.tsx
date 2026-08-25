import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { TermLevelForm } from "@/components/terms/term-level-form";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function NewTermLevelPage() {
  const locale = await getPanelLocale(); const isFa = locale === "fa";
  return <PanelPage><PanelBackLink href="/panel/admin/term-levels">{isFa ? "بازگشت" : "Back"}</PanelBackLink><PanelPageHeader eyebrow={isFa ? "ساختار آموزشی" : "Learning structure"} title={isFa ? "سطح آموزشی جدید" : "New learning level"} description={isFa ? "نام‌های فارسی و انگلیسی سطح را ثبت کنید." : "Add the Persian and English names for this level."} /><TermLevelForm locale={locale} /></PanelPage>;
}
