import { OnlineClassControls } from "@/components/terms/online-class-controls";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ToastOnMount } from "@/components/feedback/toast-effects";
import {
  PanelBackLink,
  PanelPage,
  PanelPageHeader,
} from "@/components/panel/ui";
import { TermEnrollmentManager } from "@/components/terms/term-enrollment-manager";
import { TermForm } from "@/components/terms/term-form";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { normalizeTermTime } from "@/lib/terms/schedule";
import {
  getActiveStudents,
  getTerm,
  getTermInvitations,
  getTermOptions,
  getTermRoster,
} from "@/lib/terms/queries";

export default async function EditTermPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ toast?: string }>;
}) {
  const [{ id }, query, locale] = await Promise.all([
    params,
    searchParams,
    getPanelLocale(),
  ]);
  if (!z.uuid().safeParse(id).success) notFound();
  const [term, options, students, roster, invitations] = await Promise.all([
    getTerm(id),
    getTermOptions(locale, id),
    getActiveStudents(locale),
    getTermRoster(id, locale),
    getTermInvitations(id),
  ]);
  if (!term) notFound();
  const isFa = locale === "fa";
  return (
    <PanelPage>
      {query.toast === "created" ? (
        <ToastOnMount
          title={
            isFa
              ? "ترم ساخته شد؛ اکنون می‌توانید دانش پژوه اضافه کنید."
              : "Term created. You can now add students."
          }
        />
      ) : null}
      {query.toast === "updated" ? (
        <ToastOnMount title={isFa ? "ترم به‌روز شد." : "Term updated."} />
      ) : null}
      <PanelBackLink href="/panel/admin/terms">
        {isFa ? "بازگشت" : "Back"}
      </PanelBackLink>
      <PanelPageHeader
        eyebrow={isFa ? "مدیریت کامل ترم" : "Complete term management"}
        title={
          locale === "en"
            ? `Edit ${term.titleEn || term.titleFa}`
            : `ویرایش ${term.titleFa}`
        }
        description={
          isFa
            ? "اطلاعات ترم، برنامه و ثبت‌نام‌ها را مدیریت کنید."
            : "Manage term information, schedules, and enrollment."
        }
      />
      {term.archivedAt && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {isFa
            ? "این ارائه آرشیو شده است؛ سوابق و نتایج قابل مشاهده‌اند اما قابل تغییر نیستند."
            : "This offering is archived. History and results remain visible but are read-only."}
        </p>
      )}
      <fieldset
        disabled={Boolean(term.archivedAt)}
        className="min-w-0 space-y-6"
      >
        <TermForm
          locale={locale}
          termId={term.id}
          {...options}
          initialValues={{
            semesterId: term.semesterId || "",
            courseTemplateId: term.courseTemplateId || "",
            titleFa: term.titleFa,
            titleEn: term.titleEn || "",
            descriptionFa: term.descriptionFa || "",
            descriptionEn: term.descriptionEn || "",
            levelId: term.levelId,
            status: term.status,
            deliveryMode: term.deliveryMode,
            startDate: term.startDate,
            endDate: term.endDate,
            capacity: term.capacity === null ? "" : String(term.capacity),
            tuitionToman: String(term.tuitionToman),
            locationFa: term.locationFa || "",
            locationEn: term.locationEn || "",
            meetingUrl: term.meetingUrl || "",
          }}
          initialTeacherIds={term.teacherIds}
          initialPrerequisiteIds={term.prerequisiteIds}
          initialSchedules={term.schedules.map((slot) => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: normalizeTermTime(slot.startTime),
            endTime: normalizeTermTime(slot.endTime),
          }))}
        />
        <TermEnrollmentManager
          termId={term.id}
          locale={locale}
          students={students}
          roster={roster}
          invitations={invitations}
          enrollmentOpen={term.status === "enrollment_open"}
        />
        <OnlineClassControls termId={term.id} locale={locale} manager />
      </fieldset>
    </PanelPage>
  );
}
