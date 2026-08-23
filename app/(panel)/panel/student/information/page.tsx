import { ToastOnMount } from "@/components/feedback/toast-effects";
import { PanelEmptyState, PanelPage, PanelPageHeader, PanelSurface } from "@/components/panel/ui";
import { StudentInformationForm } from "@/components/student-information/student-information-form";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getStudentInformationForUser } from "@/lib/student-information/queries";

function StatusBadge({ status, locale }: { status: "draft" | "pending" | "approved" | "rejected"; locale: "fa" | "en" }) {
  const labels = locale === "fa"
    ? { draft: "تکمیل‌نشده", pending: "در انتظار بررسی", approved: "تأییدشده", rejected: "نیازمند اصلاح" }
    : { draft: "Incomplete", pending: "Awaiting review", approved: "Approved", rejected: "Needs changes" };
  const tones = {
    draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[status]}`}>{labels[status]}</span>;
}

function Detail({ label, value, ltr = false }: { label: string; value: string | number | null; ltr?: boolean }) {
  return <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"><dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</dt><dd className={`mt-1.5 text-sm font-medium text-zinc-950 dark:text-zinc-50 ${ltr ? "nums-en" : ""}`} dir={ltr ? "ltr" : undefined}>{value || "—"}</dd></div>;
}

export default async function StudentInformationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [user, locale, params] = await Promise.all([requireRole("student"), getPanelLocale(), searchParams]);
  const { information, documents } = await getStudentInformationForUser(user.id);
  const isFa = locale === "fa";
  const status = information?.status ?? "draft";
  const editable = status === "draft" || status === "rejected";
  const localized = (fa: string | null, en: string | null) => locale === "en" ? (en || fa || "—") : (fa || "—");

  return (
    <PanelPage>
      {params.submitted === "1" ? <ToastOnMount title={isFa ? "اطلاعات برای بررسی مدیر ارسال شد." : "Information submitted for admin review."} /> : null}
      <PanelPageHeader
        eyebrow={isFa ? "پرونده دانش پژوه" : "Student record"}
        title={isFa ? "اطلاعات دانش پژوهی" : "Student information"}
        description={isFa ? "اطلاعات شخصی، خانوادگی، سلامتی و مدارک خود را تکمیل کنید تا مدیر آن‌ها را بررسی کند." : "Complete your personal, family, health, and document information for admin review."}
        actions={<StatusBadge status={status} locale={locale} />}
      />

      {status === "rejected" && information?.rejectionReason ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-start dark:border-red-900 dark:bg-red-950/35">
          <h2 className="font-semibold text-red-900 dark:text-red-200">{isFa ? "دلیل نیاز به اصلاح" : "Reason changes are required"}</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-red-800 dark:text-red-300">{information.rejectionReason}</p>
        </div>
      ) : null}

      {editable ? (
        <StudentInformationForm locale={locale} student={user} information={information} documents={documents} />
      ) : information ? (
        <div className="space-y-6">
          <PanelSurface>
            <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800"><h2 className="font-semibold">{isFa ? "خلاصه پرونده ارسال‌شده" : "Submitted record summary"}</h2><p className="mt-1 text-xs leading-5 text-zinc-500">{status === "pending" ? (isFa ? "اطلاعات تا پایان بررسی مدیر قفل است." : "Information is locked until admin review is complete.") : (isFa ? "پرونده شما تأیید شده است." : "Your record has been approved.")}</p></div>
            <dl className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label={isFa ? "نام" : "Name"} value={localized(user.firstNameFa, user.firstNameEn)} />
              <Detail label={isFa ? "نام خانوادگی" : "Last name"} value={localized(user.lastNameFa, user.lastNameEn)} />
              <Detail label={isFa ? "نام کاربری" : "Username"} value={information.username} ltr />
              <Detail label={isFa ? "شماره موبایل" : "Mobile"} value={user.mobile} ltr />
              <Detail label={isFa ? "تاریخ تولد" : "Birth date"} value={information.birthDate} ltr />
              <Detail label={isFa ? "سطح تحصیلی" : "Education level"} value={localized(information.educationLevelFa, information.educationLevelEn)} />
              <Detail label={isFa ? "نام پدر" : "Father's name"} value={localized(information.fatherNameFa, information.fatherNameEn)} />
              <Detail label={isFa ? "نام مادر" : "Mother's name"} value={localized(information.motherNameFa, information.motherNameEn)} />
              <Detail label={isFa ? "شغل پدر" : "Father's occupation"} value={localized(information.fatherOccupationFa, information.fatherOccupationEn)} />
              <Detail label={isFa ? "شغل مادر" : "Mother's occupation"} value={localized(information.motherOccupationFa, information.motherOccupationEn)} />
              <Detail label={isFa ? "سطح علاقه" : "Interest level"} value={`${information.interestLevel}/100`} ltr />
              <Detail label={isFa ? "سطح تمرکز" : "Focus level"} value={`${information.focusLevel}/100`} ltr />
            </dl>
            {documents.length ? <div className="flex flex-wrap gap-3 border-t border-zinc-200 p-5 dark:border-zinc-800">{documents.map((document) => <a key={document.id} href={`/api/student-documents/${document.id}`} target="_blank" rel="noreferrer" className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-zinc-700 dark:text-emerald-400">{document.kind === "national_card" ? (isFa ? "مشاهده کارت ملی" : "View national ID") : (isFa ? "مشاهده مدرک تحصیلی" : "View education certificate")}</a>)}</div> : null}
          </PanelSurface>
        </div>
      ) : null}

      <PanelSurface>
        <PanelEmptyState
          title={isFa ? "ترم فعال ثبت نشده است" : "No active terms yet"}
          description={isFa ? "ترم‌ها پس از اضافه شدن بخش ثبت‌نام آموزشی، به‌صورت خودکار از اطلاعات ثبت‌نام شما نمایش داده می‌شوند." : "Terms will appear automatically from your enrollments after the enrollment module is added."}
        />
      </PanelSurface>
    </PanelPage>
  );
}

