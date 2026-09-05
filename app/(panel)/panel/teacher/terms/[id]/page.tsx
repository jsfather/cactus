import { OnlineClassControls } from "@/components/terms/online-class-controls";
import { notFound } from "next/navigation";
import { z } from "zod";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { TermEnrollmentManager } from "@/components/terms/term-enrollment-manager";
import { WeeklySchedule } from "@/components/terms/weekly-schedule";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getActiveStudents, getTerm, getTermInvitations, getTermRoster, isTeacherAssignedToTerm } from "@/lib/terms/queries";

export default async function TeacherTermPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, teacher, locale] = await Promise.all([params, requireRole("teacher"), getPanelLocale()]); if (!z.uuid().safeParse(id).success) notFound();
  if (!(await isTeacherAssignedToTerm(id, teacher.id))) notFound();
  const [term, students, roster, invitations] = await Promise.all([getTerm(id), getActiveStudents(locale), getTermRoster(id, locale), getTermInvitations(id)]); if (!term) notFound(); const isFa = locale === "fa";
  const entries = term.schedules.map((slot) => ({ termId: term.id, titleFa: term.titleFa, titleEn: term.titleEn, status: term.status, deliveryMode: term.deliveryMode, startDate: term.startDate, endDate: term.endDate, locationFa: term.locationFa, locationEn: term.locationEn, meetingUrl: term.meetingUrl, dayOfWeek: slot.dayOfWeek, startTime: slot.startTime, endTime: slot.endTime }));
  return <PanelPage><PanelBackLink href="/panel/teacher/terms">{isFa ? "بازگشت" : "Back"}</PanelBackLink><PanelPageHeader eyebrow={isFa ? "ترم اختصاص‌داده‌شده" : "Assigned term"} title={locale === "en" ? term.titleEn || term.titleFa : term.titleFa} description={isFa ? "برنامه و ثبت‌نام این ترم را مدیریت کنید. کارهای روزانه حضور و نمره در میز کار مدرس قرار دارند." : "Manage this term's schedule and enrollment. Daily attendance and grading live in the teacher workspace."} /><WeeklySchedule entries={entries} locale={locale} /><TermEnrollmentManager termId={term.id} locale={locale} students={students} roster={roster} invitations={invitations} enrollmentOpen={term.status === "enrollment_open"} /><OnlineClassControls termId={term.id} locale={locale} manager /></PanelPage>;
}
