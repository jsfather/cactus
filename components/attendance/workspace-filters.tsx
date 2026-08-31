import Link from "next/link";
import { PanelInput } from "@/components/panel/form-controls";
import { getPanelButtonClass } from "@/components/panel/ui";
import type { AttendanceWorkspaceView } from "@/lib/attendance/queries";
import type { Locale } from "@/lib/i18n/config";

const views: AttendanceWorkspaceView[] = ["today", "needs_action", "upcoming", "all"];

export function AttendanceWorkspaceFilters({ action, locale, view, query, termId }: { action: string; locale: Locale; view: AttendanceWorkspaceView; query: string; termId?: string }) {
  const isFa = locale === "fa";
  const labels = isFa
    ? { today: "امروز", needs_action: "نیازمند اقدام", upcoming: "پیش‌رو", all: "همه جلسات" }
    : { today: "Today", needs_action: "Need action", upcoming: "Upcoming", all: "All sessions" };
  const hrefFor = (nextView: AttendanceWorkspaceView) => {
    const params = new URLSearchParams();
    if (nextView !== "today") params.set("view", nextView);
    if (query) params.set("q", query);
    if (termId) params.set("termId", termId);
    const search = params.toString();
    return search ? `${action}?${search}` : action;
  };
  return <div className="border-b border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/45">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <nav aria-label={isFa ? "فیلتر جلسات" : "Session filters"} className="flex gap-1 overflow-x-auto rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
        {views.map((item) => <Link key={item} href={hrefFor(item)} aria-current={view === item ? "page" : undefined} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${view === item ? "bg-white text-emerald-800 shadow-sm dark:bg-zinc-800 dark:text-emerald-300" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"}`}>{labels[item]}</Link>)}
      </nav>
      <form action={action} className="flex min-w-0 gap-2 lg:w-96">
        <input type="hidden" name="view" value={view} />
        {termId ? <input type="hidden" name="termId" value={termId} /> : null}
        <label className="relative block min-w-0 flex-1"><span className="sr-only">{isFa ? "جست‌وجو" : "Search"}</span><PanelInput type="search" name="q" defaultValue={query} maxLength={100} placeholder={isFa ? "جست‌وجوی ترم یا سطح…" : "Search term or level…"} controlSize="compact" /></label>
        <button className={getPanelButtonClass("primary", "compact")}>{isFa ? "جست‌وجو" : "Search"}</button>
      </form>
    </div>
  </div>;
}
