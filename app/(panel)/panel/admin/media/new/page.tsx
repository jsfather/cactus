import { MediaCreateForm } from "@/components/media/media-create-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { requireRole } from "@/lib/auth/session";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function NewMediaPage() {
  const [, locale] = await Promise.all([requireRole("admin"), getPanelLocale()]);
  const dictionary = getPanelDictionary(locale);
  return <PanelPage><div><PanelBackLink href="/panel/admin/media">{dictionary.common.back} · {dictionary.media.title}</PanelBackLink></div><PanelPageHeader eyebrow={dictionary.media.eyebrow} title={dictionary.media.newAsset} description={dictionary.media.description} /><MediaCreateForm locale={locale} /></PanelPage>;
}
