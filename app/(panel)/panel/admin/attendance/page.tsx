import Link from "next/link";
import { z } from "zod";
import { AttendanceTaskBoard } from "@/components/attendance/task-board";
import { AttendanceWorkspaceFilters } from "@/components/attendance/workspace-filters";
import { PanelPage, PanelPageHeader, PanelPrimaryLink, PanelSurface } from "@/components/panel/ui";
import { getAttendanceSessions, type AttendanceWorkspaceView } from "@/lib/attendance/queries";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getSearchParam } from "@/lib/panel/pagination";

const validViews: AttendanceWorkspaceView[] = ["today", "needs_action", "upcoming", "all"];

export default async function AdminAttendancePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [, locale, params] = await Promise.all([requireRole("admin"), getPanelLocale(), searchParams]);
  const isFa = locale === "fa";
  const rawTermId = getSearchParam(params, "termId");
  const termId = z.uuid().safeParse(rawTermId).success ? rawTermId : undefined;
  const rawView = getSearchParam(params, "view");
  const view = validViews.includes(rawView as AttendanceWorkspaceView) ? rawView as AttendanceWorkspaceView : termId ? "all" : "today";
  const query = getSearchParam(params, "q").slice(0, 100);
  const sessions = await getAttendanceSessions({ termId, view, query });
  const selectedTerm = termId && sessions.length
    ? (locale === "en" ? sessions[0].termTitleEn || sessions[0].termTitleFa : sessions[0].termTitleFa)
    : null;
  const viewTitle = isFa
    ? { today: "جلسات امروز", needs_action: "جلسات نیازمند اقدام", upcoming: "جلسات پیش‌رو", all: "همه جلسات" }[view]
    : { today: "Today’s sessions", needs_action: "Sessions needing action", upcoming: "Upcoming sessions", all: "All sessions" }[view];

  return <PanelPage>
    <PanelPageHeader
      eyebrow={isFa ? "عملیات آموزشی" : "Learning operations"}
      title={isFa ? "حضور و نمره‌ها" : "Attendance & grades"}
      description={isFa ? "جلسات همه ترم‌ها را از یک فضای کاری ببینید، موارد عقب‌افتاده را پیدا کنید و مستقیم وارد دفتر هر جلسه شوید." : "See sessions across every term, find overdue registers, and open any session in one click."}
      actions={<PanelPrimaryLink href="/panel/admin/terms">{isFa ? "مدیریت ترم‌ها" : "Manage terms"}</PanelPrimaryLink>}
    />
    <PanelSurface>
      {termId ? <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-sky-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-sky-950/30"><p className="font-medium text-sky-900 dark:text-sky-200">{selectedTerm ? (isFa ? `نمایش جلسات «${selectedTerm}»` : `Showing sessions for “${selectedTerm}”`) : (isFa ? "نمایش جلسات ترم انتخاب‌شده" : "Showing the selected term’s sessions")}</p><Link href="/panel/admin/attendance?view=all" className="cursor-pointer text-xs font-semibold text-sky-700 hover:underline dark:text-sky-300">{isFa ? "نمایش همه ترم‌ها" : "Show all terms"}</Link></div> : null}
      <AttendanceWorkspaceFilters action="/panel/admin/attendance" locale={locale} view={view} query={query} termId={termId} />
    </PanelSurface>
    <AttendanceTaskBoard sessions={sessions} locale={locale} role="admin" title={viewTitle} description={isFa ? "وضعیت حضور و نمره هر جلسه همین‌جا قابل پیگیری است." : "Track attendance and grading progress for every session here."} emptyTitle={isFa ? "جلسه‌ای در این نما نیست" : "No sessions in this view"} emptyDescription={isFa ? "فیلتر دیگری را انتخاب کنید یا برنامه و تاریخ‌های ترم را بررسی کنید." : "Choose another filter or check the term schedule and dates."} />
  </PanelPage>;
}
