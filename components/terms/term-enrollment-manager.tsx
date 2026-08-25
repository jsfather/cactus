"use client";

import { useActionState, useEffect, useTransition } from "react";
import { assignStudentToTerm, createTermInvitation, revokeTermInvitation, updateTermEnrollment, type TermActionState } from "@/app/(panel)/panel/terms/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { FormLabel, PanelInput, PanelSelect } from "@/components/panel/form-controls";
import { PanelActionSpinner, PanelCopyIcon, PanelEmptyState, PanelFormSection, PanelTable, PanelTableActionButton, PanelTableActions, PanelTableCell, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

const initialState: TermActionState = {};

type Student = { id: string; name: string; mobile: string };
type RosterItem = { enrollmentId: string; studentId: string; studentName: string; mobile: string; status: "active" | "withdrawn" | "completed"; source: "direct" | "invitation"; enrolledAt: Date };
type Invitation = { id: string; expiresAt: Date; maxUses: number | null; useCount: number; revokedAt: Date | null; createdAt: Date };

export function TermEnrollmentManager({ termId, locale, students, roster, invitations, enrollmentOpen }: { termId: string; locale: Locale; students: Student[]; roster: RosterItem[]; invitations: Invitation[]; enrollmentOpen: boolean }) {
  const isFa = locale === "fa";
  const [assignState, assignAction, assigning] = useActionState(assignStudentToTerm.bind(null, termId), initialState);
  const [inviteState, inviteAction, inviting] = useActionState(createTermInvitation.bind(null, termId), initialState);
  const { toast } = useFeedback();
  useActionErrorToast(assignState); useActionErrorToast(inviteState);
  useEffect(() => { if (assignState.success) toast.success(assignState.success); }, [assignState.success, toast]);
  useEffect(() => { if (inviteState.success) toast.success(inviteState.success); }, [inviteState.success, toast]);
  const availableStudents = students.filter((student) => !roster.some((item) => item.studentId === student.id && item.status !== "withdrawn"));
  async function copyInvitation() {
    if (!inviteState.invitationPath) return;
    try { await navigator.clipboard.writeText(`${window.location.origin}${inviteState.invitationPath}`); toast.success(isFa ? "پیوند کپی شد." : "Link copied."); } catch { toast.error(isFa ? "کپی خودکار انجام نشد؛ پیوند را دستی کپی کنید." : "Automatic copy failed. Copy the link manually."); }
  }

  return <div className="space-y-6">
    <PanelFormSection title={isFa ? "افزودن دانش پژوه" : "Add a student"} description={isFa ? "دانش پژوه فعال را مستقیم اضافه کنید. ظرفیت، پیش‌نیاز و تداخل برنامه پیش از ثبت بررسی می‌شود." : "Add an active student directly. Capacity, prerequisites, and schedule conflicts are checked first."}>
      <form action={assignAction} className="flex flex-col gap-3 sm:flex-row sm:items-end"><input type="hidden" name="locale" value={locale} /><div className="min-w-0 flex-1"><FormLabel label={isFa ? "دانش پژوه" : "Student"}><PanelSelect name="studentId" required defaultValue=""><option value="">{isFa ? "انتخاب دانش پژوه" : "Select student"}</option>{availableStudents.map((student) => <option key={student.id} value={student.id}>{student.name} · {student.mobile}</option>)}</PanelSelect></FormLabel></div><button disabled={assigning || !availableStudents.length} className={primaryButtonClass}>{assigning ? (isFa ? "در حال افزودن…" : "Adding…") : (isFa ? "افزودن به ترم" : "Add to term")}</button></form>
      {!availableStudents.length ? <p className="mt-3 text-xs text-zinc-500">{isFa ? "دانش پژوه فعال دیگری برای افزودن وجود ندارد." : "No other active student is available."}</p> : null}
    </PanelFormSection>

    <PanelFormSection title={isFa ? "پیوند ثبت‌نام" : "Enrollment link"} description={isFa ? "پیوندها زمان‌دار و قابل لغو هستند. توکن اصلی فقط هنگام ساخت نمایش داده می‌شود و در پایگاه داده ذخیره نمی‌شود." : "Links expire and can be revoked. The raw token is shown only once and is never stored in the database."}>
      {enrollmentOpen ? <form action={inviteAction} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]"><input type="hidden" name="locale" value={locale} /><FormLabel label={isFa ? "اعتبار (روز)" : "Expires in (days)"}><PanelInput name="expiryDays" type="number" min="1" max="90" defaultValue="7" required dir="ltr" className="nums-en" /></FormLabel><FormLabel label={isFa ? "حداکثر استفاده" : "Maximum uses"} hint={isFa ? "خالی یعنی بدون محدودیت." : "Blank means unlimited."}><PanelInput name="maxUses" type="number" min="1" max="10000" dir="ltr" className="nums-en" /></FormLabel><button disabled={inviting} className={primaryButtonClass}>{inviting ? (isFa ? "در حال ساخت…" : "Creating…") : (isFa ? "ساخت پیوند" : "Create link")}</button></form> : <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/35 dark:text-amber-300">{isFa ? "برای ساخت پیوند، وضعیت ترم را روی «ثبت‌نام باز» بگذارید." : "Set the term status to “Enrollment open” to create a link."}</p>}
      {inviteState.invitationPath ? <div className="mt-4 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30"><input readOnly value={inviteState.invitationPath} dir="ltr" className="nums-en min-w-0 flex-1 bg-transparent text-xs outline-none" /><button type="button" onClick={copyInvitation} className={secondaryButtonClass}><PanelCopyIcon />{isFa ? "کپی" : "Copy"}</button></div> : null}
      {invitations.length ? <div className="mt-5 space-y-2">{invitations.map((invitation) => <InvitationRow key={invitation.id} invitation={invitation} locale={locale} />)}</div> : null}
    </PanelFormSection>

    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"><header className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900"><h2 className="font-semibold">{isFa ? "دانش پژوهان ترم" : "Term students"}</h2><p className="mt-1 text-xs text-zinc-500">{isFa ? `${roster.length.toLocaleString("fa-IR")} سابقه ثبت‌نام` : `${roster.length} enrollment record${roster.length === 1 ? "" : "s"}`}</p></header>
      {roster.length ? <PanelTable columns={[{ label: isFa ? "دانش پژوه" : "Student", className: "w-[32%]" }, { label: isFa ? "وضعیت" : "Status", className: "w-[18%]" }, { label: isFa ? "روش افزودن" : "Source", className: "w-[18%]" }, { label: isFa ? "عملیات" : "Actions", className: "w-[32%]" }]}>{roster.map((item) => <tr key={item.enrollmentId}><PanelTableCell><p className="font-medium">{item.studentName}</p><span className="nums-en text-xs text-zinc-500" dir="ltr">{item.mobile}</span></PanelTableCell><PanelTableCell><EnrollmentStatus status={item.status} locale={locale} /></PanelTableCell><PanelTableCell className="text-zinc-500">{item.source === "invitation" ? (isFa ? "پیوند" : "Link") : (isFa ? "مستقیم" : "Direct")}</PanelTableCell><PanelTableCell><EnrollmentActions enrollmentId={item.enrollmentId} currentStatus={item.status} locale={locale} /></PanelTableCell></tr>)}</PanelTable> : <PanelEmptyState title={isFa ? "هنوز دانش پژوهی ثبت‌نام نشده" : "No students enrolled"} description={isFa ? "یک دانش پژوه را مستقیم اضافه کنید یا پیوند ثبت‌نام بسازید." : "Add a student directly or create an enrollment link."} />}
    </section>
  </div>;
}

function EnrollmentStatus({ status, locale }: { status: RosterItem["status"]; locale: Locale }) {
  const labels = { fa: { active: "فعال", withdrawn: "انصراف", completed: "تکمیل‌شده" }, en: { active: "Active", withdrawn: "Withdrawn", completed: "Completed" } };
  const styles = { active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300", withdrawn: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", completed: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300" };
  return <span className={`rounded-full px-2.5 py-1 text-xs ${styles[status]}`}>{labels[locale][status]}</span>;
}

function EnrollmentActions({ enrollmentId, currentStatus, locale }: { enrollmentId: string; currentStatus: RosterItem["status"]; locale: Locale }) {
  const [pending, startTransition] = useTransition(); const { confirm, toast } = useFeedback(); const isFa = locale === "fa";
  function update(status: RosterItem["status"]) { startTransition(async () => { if (status === "withdrawn") { const approved = await confirm({ title: isFa ? "ثبت انصراف؟" : "Mark withdrawn?", description: isFa ? "دانش پژوه از برنامه فعال این ترم خارج می‌شود و بعداً قابل بازگردانی است." : "The student leaves the active schedule and can be restored later.", confirmLabel: isFa ? "ثبت انصراف" : "Mark withdrawn" }); if (!approved) return; } const result = await updateTermEnrollment(enrollmentId, status, locale); if (result.error) toast.error(result.error); else if (result.success) toast.success(result.success); }); }
  return <PanelTableActions>{currentStatus !== "active" ? <PanelTableActionButton label={isFa ? "فعال‌کردن ثبت‌نام" : "Reactivate enrollment"} disabled={pending} onClick={() => update("active")}>{pending ? <PanelActionSpinner /> : <span aria-hidden="true">↺</span>}</PanelTableActionButton> : null}{currentStatus !== "completed" ? <PanelTableActionButton label={isFa ? "علامت‌گذاری تکمیل‌شده" : "Mark completed"} disabled={pending} onClick={() => update("completed")}><span aria-hidden="true">✓</span></PanelTableActionButton> : null}{currentStatus !== "withdrawn" ? <PanelTableActionButton label={isFa ? "ثبت انصراف" : "Mark withdrawn"} tone="danger" disabled={pending} onClick={() => update("withdrawn")}><span aria-hidden="true">×</span></PanelTableActionButton> : null}</PanelTableActions>;
}

function InvitationRow({ invitation, locale }: { invitation: Invitation; locale: Locale }) {
  const [pending, startTransition] = useTransition(); const { confirm, toast } = useFeedback(); const isFa = locale === "fa"; const expired = invitation.expiresAt <= new Date(); const inactive = Boolean(invitation.revokedAt) || expired || (invitation.maxUses !== null && invitation.useCount >= invitation.maxUses);
  function revoke() { startTransition(async () => { const approved = await confirm({ title: isFa ? "غیرفعال‌کردن پیوند؟" : "Revoke link?", description: isFa ? "افرادی که هنوز از پیوند استفاده نکرده‌اند دیگر نمی‌توانند با آن ثبت‌نام کنند." : "Anyone who has not used this link will no longer be able to enroll with it.", confirmLabel: isFa ? "غیرفعال‌کردن" : "Revoke" }); if (!approved) return; const result = await revokeTermInvitation(invitation.id, locale); if (result.error) toast.error(result.error); else if (result.success) toast.success(result.success); }); }
  return <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-3 text-xs sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800"><div><p className="font-medium">{inactive ? (isFa ? "پیوند غیرفعال" : "Inactive link") : (isFa ? "پیوند فعال" : "Active link")}</p><p className="nums-en mt-1 text-zinc-500" dir="ltr">{invitation.useCount} / {invitation.maxUses ?? "∞"} · {invitation.expiresAt.toLocaleDateString(isFa ? "fa-IR" : "en-US")}</p></div>{!inactive ? <button type="button" disabled={pending} onClick={revoke} className={`${secondaryButtonClass} text-red-600 dark:text-red-400`}>{pending ? (isFa ? "در حال انجام…" : "Working…") : (isFa ? "غیرفعال‌کردن" : "Revoke")}</button> : null}</div>;
}
