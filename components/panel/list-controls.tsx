import Link from "next/link";
import { PanelInput, PanelSelect } from "@/components/panel/form-controls";
import { getPanelButtonClass } from "@/components/panel/ui";
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
  const hasActiveFilters = Boolean(
    query || filters.some((filter) => filter.value !== "all"),
  );

  return (
    <form
      action={action}
      className="flex flex-col gap-2 border-b border-zinc-200 bg-zinc-50/70 p-3 sm:flex-row sm:flex-wrap sm:items-center dark:border-zinc-800 dark:bg-zinc-900/45"
    >
      <label className="relative block min-w-0 flex-1 sm:basis-64">
        <span className="sr-only">{isFa ? "جست‌وجو" : "Search"}</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        >
          <circle cx="8.5" cy="8.5" r="5" />
          <path strokeLinecap="round" d="m12.2 12.2 4 4" />
        </svg>
        <PanelInput
          type="search"
          name="q"
          defaultValue={query}
          maxLength={100}
          placeholder={searchPlaceholder}
          controlSize="compact"
          className="ps-9"
        />
      </label>
      {filters.map((filter) => (
        <label key={filter.name} className="block min-w-0 sm:w-44">
          <span className="sr-only">{filter.label}</span>
          <PanelSelect
            name={filter.name}
            defaultValue={filter.value}
            aria-label={filter.label}
            controlSize="compact"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </PanelSelect>
        </label>
      ))}
      <div className="flex gap-2 sm:w-auto">
        <button
          type="submit"
          className={`${getPanelButtonClass("primary", "compact")} flex-1 sm:flex-none`}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h14M5.5 10h9M8 15h4" /></svg>
          {isFa ? "اعمال" : "Apply"}
        </button>
        {hasActiveFilters ? (
          <Link
            href={action}
            className={`${getPanelButtonClass("secondary", "compact")} flex-1 sm:flex-none`}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="size-4"><path strokeLinecap="round" d="m5.5 5.5 9 9m0-9-9 9" /></svg>
            {isFa ? "پاک‌کردن" : "Clear"}
          </Link>
        ) : null}
      </div>
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
      className="flex flex-col gap-3 border-t border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800"
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
            className={`${getPanelButtonClass("secondary", "compact")} ${page === 1 ? "pointer-events-none opacity-45" : ""}`}
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
                    ? "inline-flex size-9 items-center justify-center rounded-lg bg-emerald-700 text-sm font-semibold text-white dark:bg-emerald-500 dark:text-emerald-950"
                    : "inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 transition hover:border-emerald-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                }
              >
                {number.format(pageNumber)}
              </Link>
            </span>
          ))}
          <Link
            href={buildPageHref(action, query, Math.min(pageCount, page + 1))}
            aria-disabled={page === pageCount}
            className={`${getPanelButtonClass("secondary", "compact")} ${page === pageCount ? "pointer-events-none opacity-45" : ""}`}
          >
            {isFa ? "بعدی" : "Next"}
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
