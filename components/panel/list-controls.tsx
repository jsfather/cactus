import Link from "next/link";
import { PanelInput, PanelSelect } from "@/components/panel/form-controls";
import { primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import type { PaginatedResult } from "@/lib/panel/pagination";

type Filter = {
  label: string;
  name: string;
  options: Array<{ label: string; value: string }>;
  value: string;
};

export function PanelListControls({
  action,
  filters = [],
  locale,
  query,
  searchPlaceholder,
}: {
  action: string;
  filters?: Filter[];
  locale: Locale;
  query: string;
  searchPlaceholder: string;
}) {
  const isFa = locale === "fa";

  return (
    <form
      action={action}
      className="flex flex-col gap-3 border-b border-zinc-200 bg-zinc-50/60 p-4 sm:flex-row sm:flex-wrap dark:border-zinc-800 dark:bg-zinc-900/35"
    >
      <label className="block min-w-0 flex-1 sm:basis-64">
        <span className="sr-only">{isFa ? "جست‌وجو" : "Search"}</span>
        <PanelInput
          type="search"
          name="q"
          defaultValue={query}
          maxLength={100}
          placeholder={searchPlaceholder}
          className="py-2.5"
        />
      </label>
      {filters.map((filter) => (
        <label key={filter.name} className="block min-w-0 sm:w-44">
          <span className="sr-only">{filter.label}</span>
          <PanelSelect
            name={filter.name}
            defaultValue={filter.value}
            aria-label={filter.label}
            className="py-2.5"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </PanelSelect>
        </label>
      ))}
      <button type="submit" className={`${primaryButtonClass} py-2.5`}>
        {isFa ? "اعمال" : "Apply"}
      </button>
      <Link href={action} className={`${secondaryButtonClass} cursor-pointer`}>
        {isFa ? "پاک‌کردن" : "Clear"}
      </Link>
    </form>
  );
}

function buildPageHref(
  action: string,
  query: Record<string, string>,
  page: number,
) {
  const params = new URLSearchParams(query);
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const search = params.toString();
  return search ? `${action}?${search}` : action;
}

function visiblePages(current: number, total: number) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
}

export function PanelPagination({
  action,
  locale,
  pagination,
  query,
}: {
  action: string;
  locale: Locale;
  pagination: Pick<PaginatedResult<unknown>, "page" | "pageCount" | "pageSize" | "total">;
  query: Record<string, string>;
}) {
  const { page, pageCount, pageSize, total } = pagination;
  const isFa = locale === "fa";
  const number = new Intl.NumberFormat(isFa ? "fa-IR" : "en-US");
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  const pages = visiblePages(page, pageCount);

  return (
    <nav
      aria-label={isFa ? "صفحه‌بندی" : "Pagination"}
      className="flex flex-col gap-3 border-t border-zinc-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800"
    >
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {isFa
          ? `نمایش ${number.format(first)} تا ${number.format(last)} از ${number.format(total)}`
          : `Showing ${number.format(first)}–${number.format(last)} of ${number.format(total)}`}
      </p>
      {pageCount > 1 ? (
        <div className="flex flex-wrap items-center gap-1" dir="ltr">
          <Link
            href={buildPageHref(action, query, Math.max(1, page - 1))}
            aria-disabled={page === 1}
            className={`${secondaryButtonClass} px-3 py-2 ${page === 1 ? "pointer-events-none opacity-45" : ""}`}
          >
            {isFa ? "قبلی" : "Previous"}
          </Link>
          {pages.map((pageNumber, index) => (
            <span key={pageNumber} className="contents">
              {index > 0 && pageNumber - pages[index - 1] > 1 ? (
                <span className="px-1 text-zinc-400">…</span>
              ) : null}
              <Link
                href={buildPageHref(action, query, pageNumber)}
                aria-current={pageNumber === page ? "page" : undefined}
                aria-label={`${isFa ? "صفحه" : "Page"} ${number.format(pageNumber)}`}
                className={
                  pageNumber === page
                    ? "inline-flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-sm font-semibold text-white dark:bg-emerald-500 dark:text-emerald-950"
                    : "inline-flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm text-zinc-700 transition hover:border-emerald-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                }
              >
                {number.format(pageNumber)}
              </Link>
            </span>
          ))}
          <Link
            href={buildPageHref(action, query, Math.min(pageCount, page + 1))}
            aria-disabled={page === pageCount}
            className={`${secondaryButtonClass} px-3 py-2 ${page === pageCount ? "pointer-events-none opacity-45" : ""}`}
          >
            {isFa ? "بعدی" : "Next"}
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
