import { ToastOnMount } from "@/components/feedback/toast-effects";
import { DeleteExamButton } from "@/components/exams/exam-actions";
import { PanelListControls, PanelPagination } from "@/components/panel/list-controls";
import {
  PanelEditIcon,
  PanelEmptyState,
  PanelPage,
  PanelPageHeader,
  PanelPrimaryLink,
  PanelSurface,
  PanelTable,
  PanelTableActions,
  PanelTableActionLink,
  PanelTableCell,
} from "@/components/panel/ui";
import {
  getAdminExams,
  type ExamStatusFilter,
} from "@/lib/exams/queries";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import {
  getSearchParam,
  parseAdminListQuery,
  type AdminListSearchParams,
} from "@/lib/panel/pagination";

export default async function AdminExamsPage({
  searchParams,
}: {
  searchParams: Promise<AdminListSearchParams>;
}) {
  const [locale, query] = await Promise.all([getPanelLocale(), searchParams]);
  const listQuery = parseAdminListQuery(query);
  const statusValue = getSearchParam(query, "status");
  const status: ExamStatusFilter =
    statusValue === "draft" || statusValue === "published" || statusValue === "archived"
      ? statusValue
      : "all";
  const result = await getAdminExams(locale, { ...listQuery, status });
  const dictionary = getPanelDictionary(locale);
  const number = (value: number) =>
    new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);

  return (
    <PanelPage>
      {query.toast === "updated" ? (
        <ToastOnMount title={locale === "fa" ? "آزمون به‌روز شد." : "Exam updated."} />
      ) : null}
      <PanelPageHeader
        eyebrow={dictionary.exams.eyebrow}
        title={dictionary.exams.title}
        description={dictionary.exams.description}
        actions={
          <PanelPrimaryLink href="/panel/admin/exams/new">
            {dictionary.exams.newExam}
          </PanelPrimaryLink>
        }
      />

      <PanelSurface>
        <PanelListControls
          action="/panel/admin/exams"
          locale={locale}
          query={listQuery.q}
          searchPlaceholder={
            locale === "fa"
              ? "جست‌وجوی عنوان یا توضیحات آزمون…"
              : "Search exam title or description…"
          }
          filters={[
            {
              name: "status",
              label: dictionary.common.status,
              value: status,
              options: [
                { value: "all", label: locale === "fa" ? "همه وضعیت‌ها" : "All statuses" },
                { value: "draft", label: dictionary.common.draft },
                { value: "published", label: dictionary.common.published },
                { value: "archived", label: dictionary.exams.archived },
              ],
            },
          ]}
        />
        {result.items.length ? (
          <PanelTable
            columns={[
              { label: dictionary.common.title, className: "w-[30%]" },
              { label: dictionary.common.status, className: "w-[13%]" },
              { label: dictionary.exams.questions, className: "w-[15%]" },
              { label: dictionary.exams.duration, className: "w-[13%]" },
              { label: locale === "fa" ? "سازنده" : "Created by", className: "w-[14%]" },
              { label: dictionary.common.actions, className: "w-[15%]" },
            ]}
          >
            {result.items.map((exam) => (
              <tr key={exam.id}>
                <PanelTableCell>
                  <p className="font-medium text-zinc-950 dark:text-zinc-50">
                    {locale === "en" ? exam.titleEn || exam.titleFa : exam.titleFa}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {number(exam.totalPoints)} {dictionary.exams.points} · {number(exam.passingScore)}{locale === "fa" ? "٪" : "%"}
                  </p>
                </PanelTableCell>
                <PanelTableCell>
                  <ExamStatusBadge status={exam.status} locale={locale} />
                </PanelTableCell>
                <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                  {number(exam.questionCount)}
                </PanelTableCell>
                <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                  {exam.durationMinutes
                    ? `${number(exam.durationMinutes)} ${locale === "fa" ? "دقیقه" : "min"}`
                    : locale === "fa"
                      ? "بدون محدودیت"
                      : "Untimed"}
                </PanelTableCell>
                <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                  {exam.creatorName}
                </PanelTableCell>
                <PanelTableCell>
                  <PanelTableActions>
                    <PanelTableActionLink
                      href={`/panel/admin/exams/${exam.id}/edit`}
                      label={dictionary.common.edit}
                    >
                      <PanelEditIcon />
                    </PanelTableActionLink>
                    <DeleteExamButton examId={exam.id} locale={locale} />
                  </PanelTableActions>
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={
              listQuery.q || status !== "all"
                ? locale === "fa"
                  ? "آزمونی پیدا نشد"
                  : "No matching exams"
                : dictionary.exams.emptyTitle
            }
            description={
              listQuery.q || status !== "all"
                ? locale === "fa"
                  ? "عبارت جست‌وجو یا فیلترها را تغییر دهید."
                  : "Try changing the search term or filters."
                : dictionary.exams.emptyDescription
            }
            action={
              !listQuery.q && status === "all" ? (
                <PanelPrimaryLink href="/panel/admin/exams/new">
                  {dictionary.exams.newExam}
                </PanelPrimaryLink>
              ) : undefined
            }
          />
        )}
        <PanelPagination
          action="/panel/admin/exams"
          locale={locale}
          pagination={result}
          query={{
            ...(listQuery.q ? { q: listQuery.q } : {}),
            ...(status !== "all" ? { status } : {}),
          }}
        />
      </PanelSurface>
    </PanelPage>
  );
}

function ExamStatusBadge({
  status,
  locale,
}: {
  status: "draft" | "published" | "archived";
  locale: "fa" | "en";
}) {
  const labels = {
    fa: { draft: "پیش‌نویس", published: "منتشرشده", archived: "بایگانی‌شده" },
    en: { draft: "Draft", published: "Published", archived: "Archived" },
  };
  const styles = {
    draft: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    published: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    archived: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[locale][status]}
    </span>
  );
}
