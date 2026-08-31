import { notFound } from "next/navigation";
import { z } from "zod";
import { SessionRecordForm } from "@/components/attendance/session-record-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getSessionRoster, getTermSession } from "@/lib/attendance/queries";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { isTeacherAssignedToTerm } from "@/lib/terms/queries";
import { normalizeTermTime } from "@/lib/terms/schedule";

export async function AttendanceSessionPage({
  role,
  sessionId,
}: {
  role: "admin" | "teacher";
  sessionId: string;
}) {
  if (!z.uuid().safeParse(sessionId).success) notFound();
  const [user, locale, session] = await Promise.all([
    requireRole(role),
    getPanelLocale(),
    getTermSession(sessionId),
  ]);
  if (!session) notFound();
  if (role === "teacher" && !(await isTeacherAssignedToTerm(session.termId, user.id))) notFound();
  const roster = await getSessionRoster(session.id, session.termId, session.sessionDate, locale);
  const isFa = locale === "fa";
  const date = new Intl.DateTimeFormat(isFa ? "fa-IR-u-ca-persian" : "en-US-u-ca-gregory", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const number = new Intl.NumberFormat(isFa ? "fa-IR" : "en-US");
  const termTitle = locale === "en" ? session.termTitleEn || session.termTitleFa : session.termTitleFa;
  const levelTitle = locale === "en" ? session.levelTitleEn || session.levelTitleFa : session.levelTitleFa;
  const backHref = `/panel/${role}/attendance`;
  return <PanelPage>
    <PanelBackLink href={backHref}>{isFa ? "بازگشت به کارهای روزانه" : "Back to daily work"}</PanelBackLink>
    <PanelPageHeader
      eyebrow={`${termTitle} · ${levelTitle}`}
      title={isFa ? `دفتر جلسه ${number.format(session.sequence)}` : `Session ${number.format(session.sequence)} register`}
      description={`${date.format(new Date(`${session.sessionDate}T12:00:00Z`))} · ${normalizeTermTime(session.startTime)}–${normalizeTermTime(session.endTime)} · ${isFa ? `${number.format(roster.length)} دانش پژوه` : `${number.format(roster.length)} student${roster.length === 1 ? "" : "s"}`}`}
    />
    {roster.length ? <SessionRecordForm sessionId={session.id} locale={locale} initialGradeMax={session.gradeMax} roster={roster} /> : <section className="rounded-2xl border border-zinc-200 bg-white px-6 py-14 text-center dark:border-zinc-800 dark:bg-zinc-950"><h2 className="font-bold">{isFa ? "دانش پژوهی برای این جلسه وجود ندارد" : "No students for this session"}</h2><p className="mt-2 text-sm text-zinc-500">{isFa ? "ابتدا دانش پژوه را به ترم اضافه کنید. دانش پژوهانی که بعد از تاریخ جلسه ثبت‌نام شوند در این دفتر نمایش داده نمی‌شوند." : "Add students to the term first. Students enrolled after this session date are not included."}</p></section>}
  </PanelPage>;
}
