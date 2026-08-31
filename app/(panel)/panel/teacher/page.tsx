import { requireRole } from "@/lib/auth/session";
import { AttendanceTaskBoard } from "@/components/attendance/task-board";
import { PanelDashboardCard, PanelPage, PanelPageHeader, PanelPrimaryLink } from "@/components/panel/ui";
import { getAttendanceSessions } from "@/lib/attendance/queries";
import { getTehranTodayIso } from "@/lib/date/local";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getLocalizedUserName } from "@/lib/users/name";

export default async function TeacherDashboard() {
  const [user, locale] = await Promise.all([requireRole("teacher"), getPanelLocale()]);
  const dictionary = getPanelDictionary(locale);
  const [todaySessions, pendingSessions, upcomingSessions] = await Promise.all([
    getAttendanceSessions({ teacherId: user.id, view: "today", limit: 20 }),
    getAttendanceSessions({ teacherId: user.id, view: "needs_action", limit: 20 }),
    getAttendanceSessions({ teacherId: user.id, view: "upcoming", limit: 3 }),
  ]);
  const today = getTehranTodayIso();
  const visibleSessions = [
    ...todaySessions,
    ...pendingSessions.filter((session) => session.sessionDate < today).slice(0, 4),
    ...upcomingSessions,
  ].filter((session, index, all) => all.findIndex((candidate) => candidate.id === session.id) === index);

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={dictionary.dashboard.teacherEyebrow}
        title={`${dictionary.dashboard.hello}، ${getLocalizedUserName(user, locale)}`}
        description={dictionary.dashboard.teacherDescription}
        actions={<PanelPrimaryLink href="/panel/teacher/attendance">{locale === "fa" ? "بازکردن میز کار روزانه" : "Open daily workspace"}</PanelPrimaryLink>}
      />
      <AttendanceTaskBoard
        sessions={visibleSessions}
        locale={locale}
        role="teacher"
        title={locale === "fa" ? "کارهای آموزشی امروز" : "Today’s teaching work"}
        description={locale === "fa" ? "جلسات امروز ابتدا نمایش داده می‌شوند؛ سپس دفترهای عقب‌افتاده و نزدیک‌ترین کلاس‌های بعدی." : "Today’s classes come first, followed by overdue registers and your next upcoming sessions."}
        emptyTitle={locale === "fa" ? "فعلاً کاری در صف نیست" : "Your queue is clear"}
        emptyDescription={locale === "fa" ? "کلاس‌های آینده پس از اختصاص ترم و ساخت جلسات اینجا ظاهر می‌شوند." : "Upcoming classes appear here after a term and its sessions are assigned."}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <PanelDashboardCard
          href="/panel/teacher/attendance"
          eyebrow={locale === "fa" ? "کلاس‌های من" : "My classes"}
          title={locale === "fa" ? "حضور و نمره‌ها" : "Attendance & grades"}
          description={locale === "fa" ? "همه دفترهای جلسات، کارهای عقب‌افتاده و نمره‌های دانش پژوهان را یکجا ببینید." : "See every session register, overdue task, and student grade in one place."}
        />
        <PanelDashboardCard
          href="/panel/teacher/profile"
          eyebrow={locale === "fa" ? "معرفی عمومی" : "Public presence"}
          title={dictionary.nav.teacherProfile}
          description={locale === "fa" ? "بیوگرافی، مهارت‌ها، سوابق کاری و تحصیلات خود را مدیریت کنید." : "Manage your biography, skills, work history, and education."}
        />
      </div>
    </PanelPage>
  );
}
