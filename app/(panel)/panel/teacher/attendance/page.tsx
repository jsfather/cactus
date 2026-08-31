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

export default async function TeacherAttendancePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [teacher, locale, params] = await Promise.all([requireRole("teacher"), getPanelLocale(), searchParams]);
  const isFa = locale === "fa";
  const rawTermId = getSearchParam(params, "termId");
  const termId = z.uuid().safeParse(rawTermId).success ? rawTermId : undefined;
  const rawView = getSearchParam(params, "view");
  const view = validViews.includes(rawView as AttendanceWorkspaceView) ? rawView as AttendanceWorkspaceView : termId ? "all" : "today";
  const query = getSearchParam(params, "q").slice(0, 100);
  const sessions = await getAttendanceSessions({ teacherId: teacher.id, termId, view, query });
  const selectedTerm = termId && sessions.length
    ? (locale === "en" ? sessions[0].termTitleEn || sessions[0].termTitleFa : sessions[0].termTitleFa)
    : null;
  const viewTitle = isFa
    ? { today: "برنامه امروز من", needs_action: "کارهای عقب‌افتاده", upcoming: "جلسات بعدی", all: "همه جلسات من" }[view]
    : { today: "My work today", needs_action: "Overdue work", upcoming: "Next sessions", all: "All my sessions" }[view];

  return <PanelPage>
    <PanelPageHeader eyebrow={isFa ? "میز کار روزانه" : "Daily workspace"} title={isFa ? "حضور و نمره‌ها" : "Attendance & grades"} description={isFa ? "کلاس امروز، دفترهای تکمیل‌نشده و جلسات بعدی شما در یک مسیر روشن قرار دارند." : "Your classes today, unfinished registers, and upcoming sessions are organized in one clear workflow."} actions={<PanelPrimaryLink href="/panel/teacher/schedule">{isFa ? "برنامه هفتگی" : "Weekly schedule"}</PanelPrimaryLink>} />
    <PanelSurface>
      {termId ? <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-sky-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-sky-950/30"><p className="font-medium text-sky-900 dark:text-sky-200">{selectedTerm ? (isFa ? `نمایش جلسات «${selectedTerm}»` : `Showing sessions for “${selectedTerm}”`) : (isFa ? "نمایش جلسات ترم انتخاب‌شده" : "Showing the selected term’s sessions")}</p><Link href="/panel/teacher/attendance?view=all" className="cursor-pointer text-xs font-semibold text-sky-700 hover:underline dark:text-sky-300">{isFa ? "نمایش همه ترم‌ها" : "Show all terms"}</Link></div> : null}
      <AttendanceWorkspaceFilters action="/panel/teacher/attendance" locale={locale} view={view} query={query} termId={termId} />
    </PanelSurface>
    <AttendanceTaskBoard sessions={sessions} locale={locale} role="teacher" title={viewTitle} description={isFa ? "هر ردیف مستقیماً دفتر همان جلسه را باز می‌کند." : "Each row opens that session’s register directly."} emptyTitle={isFa ? "کاری برای این نما ندارید" : "Nothing to do in this view"} emptyDescription={isFa ? "برای دیدن جلسات دیگر، فیلتر پیش‌رو یا همه جلسات را انتخاب کنید." : "Choose Upcoming or All sessions to see more."} />
  </PanelPage>;
}
