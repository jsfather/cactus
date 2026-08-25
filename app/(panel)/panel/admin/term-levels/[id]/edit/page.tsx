import { notFound } from "next/navigation";
import { z } from "zod";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { TermLevelForm } from "@/components/terms/term-level-form";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getTermLevel } from "@/lib/terms/queries";

export default async function EditTermLevelPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, locale] = await Promise.all([params, getPanelLocale()]);
  if (!z.uuid().safeParse(id).success) notFound();
  const level = await getTermLevel(id); if (!level) notFound(); const isFa = locale === "fa";
  return <PanelPage><PanelBackLink href="/panel/admin/term-levels">{isFa ? "بازگشت" : "Back"}</PanelBackLink><PanelPageHeader eyebrow={isFa ? "ساختار آموزشی" : "Learning structure"} title={isFa ? "ویرایش سطح" : "Edit level"} description={isFa ? "نام و توضیح سطح را به‌روز کنید." : "Update the level names and description."} /><TermLevelForm locale={locale} levelId={id} initialValues={{ titleFa: level.titleFa, titleEn: level.titleEn || "", descriptionFa: level.descriptionFa || "", descriptionEn: level.descriptionEn || "" }} /></PanelPage>;
}
