import { ToastOnMount } from "@/components/feedback/toast-effects";
import { DeleteHonorButton } from "@/components/honors/delete-honor-button";
import { PanelListControls, PanelPagination } from "@/components/panel/list-controls";
import { PanelEditIcon, PanelEmptyState, PanelPage, PanelPageHeader, PanelPrimaryLink, PanelSurface, PanelTable, PanelTableActionLink, PanelTableActions, PanelTableCell } from "@/components/panel/ui";
import { getAdminHonors, type HonorStatusFilter } from "@/lib/honors/queries";
import { localeConfig } from "@/lib/i18n/config";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getSearchParam, parseAdminListQuery, type AdminListSearchParams } from "@/lib/panel/pagination";

export default async function AdminHonorsPage({ searchParams }: { searchParams: Promise<AdminListSearchParams> }) {
  const [locale, query] = await Promise.all([getPanelLocale(), searchParams]);
  const listQuery = parseAdminListQuery(query);
  const statusValue = getSearchParam(query, "status");
  const status: HonorStatusFilter = statusValue === "draft" || statusValue === "published" ? statusValue : "all";
  const page = await getAdminHonors({ ...listQuery, status });
  const isFa = locale === "fa";
  const formatDate = (value: string) => new Intl.DateTimeFormat(localeConfig[locale].dateLocale, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00Z`));
  return <PanelPage>
    {query.toast === "created" ? <ToastOnMount title={isFa ? "افتخار یا گواهینامه ساخته شد." : "Honor or certificate created."} /> : null}
    {query.toast === "updated" ? <ToastOnMount title={isFa ? "افتخار یا گواهینامه به‌روز شد." : "Honor or certificate updated."} /> : null}
    <PanelPageHeader eyebrow={isFa ? "اعتبار و دستاوردها" : "Recognition and achievements"} title={isFa ? "افتخارات و گواهینامه‌ها" : "Honors and certificates"} description={isFa ? "جوایز، گواهینامه‌ها و دستاوردهای کاکتوس را مدیریت و در سایت عمومی منتشر کنید." : "Manage and publish Cactus awards, certificates, and achievements."} actions={<PanelPrimaryLink href="/panel/admin/honors/new">{isFa ? "مورد جدید" : "New item"}</PanelPrimaryLink>} />
    <PanelSurface>
      <PanelListControls action="/panel/admin/honors" locale={locale} query={listQuery.q} searchPlaceholder={isFa ? "جست‌وجوی عنوان، سازمان، دسته‌بندی یا نشانی…" : "Search title, organization, category, or URL…"} filters={[{ name: "status", label: isFa ? "وضعیت" : "Status", value: status, options: [{ value: "all", label: isFa ? "همه وضعیت‌ها" : "All statuses" }, { value: "draft", label: isFa ? "پیش‌نویس" : "Draft" }, { value: "published", label: isFa ? "منتشرشده" : "Published" }] }]} />
      {page.items.length ? <PanelTable columns={[{ label: isFa ? "عنوان" : "Title", className: "w-[31%]" }, { label: isFa ? "سازمان" : "Organization", className: "w-[21%]" }, { label: isFa ? "وضعیت" : "Status", className: "w-[14%]" }, { label: isFa ? "تاریخ صدور" : "Issue date", className: "w-[18%]" }, { label: isFa ? "عملیات" : "Actions", className: "w-[16%]" }]}>{page.items.map((honor) => <tr key={honor.id}><PanelTableCell><p className="font-medium text-zinc-950 dark:text-zinc-50">{locale === "en" ? honor.titleEn || honor.titleFa : honor.titleFa}</p><p className="nums-en mt-1 truncate text-xs text-zinc-500" dir="ltr">/honors/{honor.slug}</p></PanelTableCell><PanelTableCell className="text-zinc-600 dark:text-zinc-400">{locale === "en" ? honor.organizationEn || honor.organizationFa : honor.organizationFa}</PanelTableCell><PanelTableCell><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${honor.status === "published" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"}`}>{honor.status === "published" ? (isFa ? "منتشرشده" : "Published") : (isFa ? "پیش‌نویس" : "Draft")}</span></PanelTableCell><PanelTableCell className="text-zinc-600 dark:text-zinc-400">{formatDate(honor.issuedAt)}</PanelTableCell><PanelTableCell><PanelTableActions><PanelTableActionLink href={`/panel/admin/honors/${honor.id}/edit`} label={isFa ? "ویرایش" : "Edit"}><PanelEditIcon /></PanelTableActionLink><DeleteHonorButton honorId={honor.id} locale={locale} /></PanelTableActions></PanelTableCell></tr>)}</PanelTable> : <PanelEmptyState title={listQuery.q || status !== "all" ? (isFa ? "نتیجه‌ای پیدا نشد" : "No matching items") : (isFa ? "هنوز موردی ثبت نشده است" : "No honors or certificates yet")} description={listQuery.q || status !== "all" ? (isFa ? "عبارت جست‌وجو یا فیلتر را تغییر دهید." : "Try changing the search or filter.") : (isFa ? "اولین افتخار یا گواهینامه کاکتوس را ثبت کنید." : "Create the first Cactus honor or certificate.")} action={!listQuery.q && status === "all" ? <PanelPrimaryLink href="/panel/admin/honors/new">{isFa ? "ساخت اولین مورد" : "Create first item"}</PanelPrimaryLink> : undefined} />}
      <PanelPagination action="/panel/admin/honors" locale={locale} pagination={page} query={{ ...(listQuery.q ? { q: listQuery.q } : {}), ...(status !== "all" ? { status } : {}) }} />
    </PanelSurface>
  </PanelPage>;
}
