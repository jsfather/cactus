import { HonorForm } from "@/components/honors/honor-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function NewHonorPage() { const locale = await getPanelLocale(); const isFa = locale === "fa"; return <PanelPage><div><PanelBackLink href="/panel/admin/honors">{isFa ? "بازگشت" : "Back"}</PanelBackLink></div><PanelPageHeader eyebrow={isFa ? "اعتبار و دستاوردها" : "Recognition and achievements"} title={isFa ? "افتخار یا گواهینامه جدید" : "New honor or certificate"} description={isFa ? "اطلاعات فارسی، ترجمه اختیاری، تصویر و وضعیت انتشار را ثبت کنید." : "Add Persian content, optional translation, image, and publication status."} /><HonorForm locale={locale} /></PanelPage>; }
