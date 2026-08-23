import { notFound } from "next/navigation";
import { PanelBackLink, PanelPage, PanelPageHeader, PanelSurface } from "@/components/panel/ui";
import { StudentReviewActions } from "@/components/student-information/student-review-actions";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getStudentReview } from "@/lib/student-information/queries";
import { getLocalizedUserName } from "@/lib/users/name";

function Detail({ label, value, ltr = false }: { label: string; value: string | number | null; ltr?: boolean }) {
  return <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"><dt className="text-xs font-medium text-zinc-500">{label}</dt><dd className={`mt-1.5 whitespace-pre-wrap text-sm font-medium ${ltr ? "nums-en" : ""}`} dir={ltr ? "ltr" : undefined}>{value || "—"}</dd></div>;
}

export default async function StudentInformationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, locale] = await Promise.all([params, getPanelLocale(), requireRole("admin")]).then(([route, language]) => [route, language] as const);
  const review = await getStudentReview(id);
  if (!review) notFound();
  const { student, information, documents } = review;
  const isFa = locale === "fa";
  const localized = (fa: string | null, en: string | null) => locale === "en" ? (en || fa || "—") : (fa || "—");
  const statusLabel = information
    ? (isFa ? { draft: "تکمیل‌نشده", pending: "در انتظار بررسی", approved: "تأییدشده", rejected: "نیازمند اصلاح" } : { draft: "Incomplete", pending: "Awaiting review", approved: "Approved", rejected: "Needs changes" })[information.status]
    : (isFa ? "ارسال‌نشده" : "Not submitted");

  return <PanelPage>
    <PanelBackLink href="/panel/admin/students">{isFa ? "بازگشت به دانش پژوهان" : "Back to students"}</PanelBackLink>
    <PanelPageHeader eyebrow={isFa ? "بررسی پرونده" : "Submission review"} title={getLocalizedUserName(student, locale) || student.mobile} description={isFa ? `وضعیت فعلی: ${statusLabel}` : `Current status: ${statusLabel}`} />
    {!information ? <PanelSurface><div className="p-8 text-center text-sm text-zinc-500">{isFa ? "این دانش پژوه هنوز اطلاعات خود را ارسال نکرده است." : "This student has not submitted their information yet."}</div></PanelSurface> : <>
      {information.rejectionReason ? <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30"><h2 className="font-semibold text-red-900 dark:text-red-200">{isFa ? "آخرین دلیل رد" : "Latest rejection reason"}</h2><p className="mt-2 whitespace-pre-wrap text-sm text-red-800 dark:text-red-300">{information.rejectionReason}</p></div> : null}
      <PanelSurface>
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800"><h2 className="font-semibold">{isFa ? "اطلاعات شخصی و خانوادگی" : "Personal and family information"}</h2></div>
        <dl className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label={isFa ? "نام کامل" : "Full name"} value={getLocalizedUserName(student, locale)} />
          <Detail label={isFa ? "نام کاربری" : "Username"} value={information.username} ltr />
          <Detail label={isFa ? "شماره موبایل" : "Mobile"} value={student.mobile} ltr />
          <Detail label={isFa ? "ایمیل" : "Email"} value={student.email} ltr />
          <Detail label={isFa ? "کد ملی" : "National ID"} value={information.nationalCode} ltr />
          <Detail label={isFa ? "تاریخ تولد" : "Birth date"} value={information.birthDate} ltr />
          <Detail label={isFa ? "سطح تحصیلی" : "Education level"} value={localized(information.educationLevelFa, information.educationLevelEn)} />
          <Detail label={isFa ? "نام پدر" : "Father's name"} value={localized(information.fatherNameFa, information.fatherNameEn)} />
          <Detail label={isFa ? "شغل پدر" : "Father's occupation"} value={localized(information.fatherOccupationFa, information.fatherOccupationEn)} />
          <Detail label={isFa ? "نام مادر" : "Mother's name"} value={localized(information.motherNameFa, information.motherNameEn)} />
          <Detail label={isFa ? "شغل مادر" : "Mother's occupation"} value={localized(information.motherOccupationFa, information.motherOccupationEn)} />
          <Detail label={isFa ? "آلرژی" : "Allergies"} value={information.allergyStatus === "none" ? (isFa ? "ندارد" : "None") : localized(information.allergyDescriptionFa, information.allergyDescriptionEn)} />
          <Detail label={isFa ? "سطح علاقه" : "Interest level"} value={`${information.interestLevel}/100`} ltr />
          <Detail label={isFa ? "سطح تمرکز" : "Focus level"} value={`${information.focusLevel}/100`} ltr />
        </dl>
      </PanelSurface>
      <PanelSurface>
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800"><h2 className="font-semibold">{isFa ? "مدارک خصوصی" : "Private documents"}</h2></div>
        <div className="flex flex-wrap gap-3 p-5">{documents.length ? documents.map((document) => <a key={document.id} href={`/api/student-documents/${document.id}`} target="_blank" rel="noreferrer" className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-zinc-700 dark:text-emerald-400">{document.kind === "national_card" ? (isFa ? "مشاهده کارت ملی" : "View national ID") : (isFa ? "مشاهده مدرک تحصیلی" : "View education certificate")}</a>) : <p className="text-sm text-zinc-500">{isFa ? "مدرکی بارگذاری نشده است." : "No documents uploaded."}</p>}</div>
      </PanelSurface>
      {information.status === "pending" ? <PanelSurface><div className="p-5"><StudentReviewActions studentId={student.id} locale={locale} /></div></PanelSurface> : null}
    </>}
  </PanelPage>;
}

