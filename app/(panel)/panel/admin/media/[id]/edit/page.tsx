import { notFound } from "next/navigation";
import { MediaEditForm } from "@/components/media/media-edit-form";
import { CopyMediaUrlButton } from "@/components/media/copy-media-url-button";
import { DeleteMediaButton } from "@/components/media/delete-media-button";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { requireRole } from "@/lib/auth/session";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getAdminMediaAsset } from "@/lib/media/queries";

export default async function EditMediaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [, locale, asset] = await Promise.all([requireRole("admin"), getPanelLocale(), getAdminMediaAsset(id)]);
  if (!asset) notFound();
  const dictionary = getPanelDictionary(locale);
  return <PanelPage><div><PanelBackLink href="/panel/admin/media">{dictionary.common.back} · {dictionary.media.title}</PanelBackLink></div><PanelPageHeader eyebrow={dictionary.media.eyebrow} title={asset.originalName} description={dictionary.media.description} actions={<div className="flex gap-2"><CopyMediaUrlButton url={asset.url} locale={locale} /><DeleteMediaButton assetId={asset.id} locale={locale} redirectAfterDelete /></div>} /><MediaEditForm locale={locale} asset={asset} /></PanelPage>;
}
