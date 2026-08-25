import { ToastOnMount } from "@/components/feedback/toast-effects";
import { DeleteTermLevelButton } from "@/components/terms/delete-term-level-button";
import { PanelEditIcon, PanelEmptyState, PanelPage, PanelPageHeader, PanelPrimaryLink, PanelSurface, PanelTable, PanelTableActionLink, PanelTableActions, PanelTableCell } from "@/components/panel/ui";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getTermLevels } from "@/lib/terms/queries";

export default async function TermLevelsPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const [locale, query, levels] = await Promise.all([getPanelLocale(), searchParams, getTermLevels()]);
  const isFa = locale === "fa";
  return <PanelPage>
    {query.toast === "created" ? <ToastOnMount title={isFa ? "سطح ساخته شد." : "Level created."} /> : null}
    {query.toast === "updated" ? <ToastOnMount title={isFa ? "سطح به‌روز شد." : "Level updated."} /> : null}
    <PanelPageHeader eyebrow={isFa ? "ساختار آموزشی" : "Learning structure"} title={isFa ? "سطوح آموزشی" : "Learning levels"} description={isFa ? "سطوح قابل استفاده مجدد برای دسته‌بندی ترم‌ها را مدیریت کنید؛ هیچ شماره ترتیب دستی در فرم ترم لازم نیست." : "Manage reusable levels for classifying terms without entering manual term order numbers."} actions={<PanelPrimaryLink href="/panel/admin/term-levels/new">{isFa ? "سطح جدید" : "New level"}</PanelPrimaryLink>} />
    <PanelSurface>{levels.length ? <PanelTable columns={[{ label: isFa ? "سطح" : "Level", className: "w-[35%]" }, { label: isFa ? "توضیح" : "Description", className: "w-[45%]" }, { label: isFa ? "عملیات" : "Actions", className: "w-[20%]" }]}>
      {levels.map((level) => <tr key={level.id}><PanelTableCell><p className="font-semibold">{locale === "en" ? level.titleEn || level.titleFa : level.titleFa}</p></PanelTableCell><PanelTableCell className="text-zinc-600 dark:text-zinc-400"><p className="line-clamp-2">{locale === "en" ? level.descriptionEn || level.descriptionFa || "—" : level.descriptionFa || "—"}</p></PanelTableCell><PanelTableCell><PanelTableActions><PanelTableActionLink href={`/panel/admin/term-levels/${level.id}/edit`} label={isFa ? "ویرایش سطح" : "Edit level"}><PanelEditIcon /></PanelTableActionLink><DeleteTermLevelButton levelId={level.id} locale={locale} /></PanelTableActions></PanelTableCell></tr>)}
    </PanelTable> : <PanelEmptyState title={isFa ? "هنوز سطحی وجود ندارد" : "No levels yet"} description={isFa ? "اولین سطح آموزشی را بسازید تا بتوانید ترم تعریف کنید." : "Create the first learning level before adding a term."} action={<PanelPrimaryLink href="/panel/admin/term-levels/new">{isFa ? "ساخت سطح" : "Create level"}</PanelPrimaryLink>} />}</PanelSurface>
  </PanelPage>;
}
