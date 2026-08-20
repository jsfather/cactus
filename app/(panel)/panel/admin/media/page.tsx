/* eslint-disable @next/next/no-img-element */
import { CopyMediaUrlButton } from "@/components/media/copy-media-url-button";
import { DeleteMediaButton } from "@/components/media/delete-media-button";
import { ToastOnMount } from "@/components/feedback/toast-effects";
import { PanelEditIcon, PanelEmptyState, PanelPage, PanelPageHeader, PanelPrimaryLink, PanelSurface, PanelTable, PanelTableActions, PanelTableActionLink, PanelTableCell } from "@/components/panel/ui";
import { requireRole } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getAdminMediaAssets } from "@/lib/media/queries";
import { getMediaKindLabel } from "@/lib/media/labels";

function formatSize(bytes: number, locale: Locale) {
  const value = bytes >= 1024 * 1024 ? bytes / (1024 * 1024) : bytes / 1024;
  const unit = bytes >= 1024 * 1024 ? "MB" : "KB";
  return `${new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 1 }).format(value)} ${unit}`;
}

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const locale = await getPanelLocale();
  const [, assets, query] = await Promise.all([requireRole("admin"), getAdminMediaAssets(locale), searchParams]);
  const dictionary = getPanelDictionary(locale);

  return (
    <PanelPage>
      {query.toast === "created" ? <ToastOnMount title={locale === "fa" ? "تصویر به کتابخانه افزوده شد." : "Image added to the library."} /> : null}
      {query.toast === "updated" ? <ToastOnMount title={locale === "fa" ? "اطلاعات رسانه به‌روز شد." : "Media details updated."} /> : null}
      {query.toast === "deleted" ? <ToastOnMount title={locale === "fa" ? "رسانه حذف شد." : "Media deleted."} /> : null}
      <PanelPageHeader eyebrow={dictionary.media.eyebrow} title={dictionary.media.title} description={dictionary.media.description} actions={<PanelPrimaryLink href="/panel/admin/media/new">{dictionary.media.newAsset}</PanelPrimaryLink>} />
      <PanelSurface>
        {assets.length ? (
          <PanelTable columns={[
            { label: dictionary.media.file, className: "w-[31%]" },
            { label: dictionary.media.kind, className: "w-[12%]" },
            { label: dictionary.media.uploader, className: "w-[17%]" },
            { label: dictionary.media.size, className: "w-[12%]" },
            { label: dictionary.common.createdAt, className: "w-[13%]" },
            { label: dictionary.common.actions, className: "w-[15%]" },
          ]}>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <PanelTableCell><div className="flex items-center gap-3"><div className="size-12 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"><img src={asset.url} alt={locale === "fa" ? asset.altFa || "" : asset.altEn || ""} className="size-full object-cover" /></div><div className="min-w-0"><p className="truncate font-medium text-zinc-950 dark:text-zinc-50">{asset.originalName}</p><p className="nums-en mt-1 truncate text-xs text-zinc-500" dir="ltr">{asset.mimeType}</p></div></div></PanelTableCell>
                <PanelTableCell>{getMediaKindLabel(asset.kind, locale)}</PanelTableCell>
                <PanelTableCell><span className="block truncate">{asset.uploaderName}</span></PanelTableCell>
                <PanelTableCell><span className="nums-en whitespace-nowrap">{formatSize(asset.size, locale)}</span></PanelTableCell>
                <PanelTableCell>{new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium" }).format(asset.createdAt)}</PanelTableCell>
                <PanelTableCell><PanelTableActions><PanelTableActionLink href={`/panel/admin/media/${asset.id}/edit`} label={dictionary.common.edit}><PanelEditIcon /></PanelTableActionLink><CopyMediaUrlButton url={asset.url} locale={locale} /><DeleteMediaButton assetId={asset.id} locale={locale} /></PanelTableActions></PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : <PanelEmptyState title={dictionary.media.emptyTitle} description={dictionary.media.emptyDescription} action={<PanelPrimaryLink href="/panel/admin/media/new">{dictionary.media.newAsset}</PanelPrimaryLink>} />}
      </PanelSurface>
    </PanelPage>
  );
}
