"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { saveSessionRecords, type SessionRecordActionState } from "@/app/(panel)/panel/attendance/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { PanelInput } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelSurface, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import { UserAvatar } from "@/components/users/user-avatar";
import type { AttendanceStatus } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

type RosterStudent = {
  enrollmentId: string;
  enrollmentStatus: "active" | "withdrawn" | "completed";
  studentId: string;
  studentName: string;
  mobile: string;
  avatarUrl: string | null;
  attendance: AttendanceStatus | null;
  grade: string | null;
  note: string | null;
  updatedAt: Date | null;
};

type EditableRecord = Omit<RosterStudent, "grade"> & { grade: string };

const initialActionState: SessionRecordActionState = {};
const attendanceValues: AttendanceStatus[] = ["present", "absent", "late", "excused"];

const attendanceStyle: Record<AttendanceStatus, string> = {
  present: "border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  absent: "border-red-300 bg-red-100 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
  late: "border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200",
  excused: "border-sky-300 bg-sky-100 text-sky-900 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-200",
};

function labels(locale: Locale) {
  return locale === "fa"
    ? { present: "حاضر", absent: "غایب", late: "با تأخیر", excused: "غیبت موجه" }
    : { present: "Present", absent: "Absent", late: "Late", excused: "Excused" };
}

export function SessionRecordForm({
  sessionId,
  locale,
  initialGradeMax,
  roster,
}: {
  sessionId: string;
  locale: Locale;
  initialGradeMax: string;
  roster: RosterStudent[];
}) {
  const isFa = locale === "fa";
  const attendanceLabels = labels(locale);
  const [state, action, pending] = useActionState(saveSessionRecords.bind(null, sessionId), initialActionState);
  const { toast } = useFeedback();
  useActionErrorToast(state);
  const [gradeMax, setGradeMax] = useState(initialGradeMax);
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<EditableRecord[]>(() => roster.map((student) => ({ ...student, grade: student.grade ?? "" })));
  useEffect(() => {
    if (state.success) toast.success(state.success);
  }, [state.revision, state.success, toast]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale === "fa" ? "fa" : "en");
    return normalized
      ? records.filter((record) => `${record.studentName} ${record.mobile}`.toLocaleLowerCase(locale === "fa" ? "fa" : "en").includes(normalized))
      : records;
  }, [locale, query, records]);
  const summary = useMemo(() => ({
    present: records.filter((record) => record.attendance === "present").length,
    absent: records.filter((record) => record.attendance === "absent").length,
    late: records.filter((record) => record.attendance === "late").length,
    excused: records.filter((record) => record.attendance === "excused").length,
    unmarked: records.filter((record) => record.attendance === null).length,
    graded: records.filter((record) => record.grade !== "").length,
  }), [records]);

  function updateRecord(studentId: string, values: Partial<Pick<EditableRecord, "attendance" | "grade" | "note">>) {
    setRecords((current) => current.map((record) => record.studentId === studentId ? { ...record, ...values } : record));
  }

  function setAllAttendance(attendance: AttendanceStatus | null) {
    setRecords((current) => current.map((record) => record.enrollmentStatus === "active" ? { ...record, attendance } : record));
  }

  const serialized = JSON.stringify(records.map((record) => ({
    studentId: record.studentId,
    attendance: record.attendance,
    grade: record.grade.trim() === "" ? null : Number(record.grade),
    note: record.note?.trim() || null,
  })));
  const number = new Intl.NumberFormat(isFa ? "fa-IR" : "en-US");

  return <form action={action} className="space-y-6">
    <input type="hidden" name="locale" value={locale} />
    <input type="hidden" name="gradeMax" value={gradeMax} />
    <input type="hidden" name="records" value={serialized} />

    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <SummaryCard label={attendanceLabels.present} value={summary.present} tone="emerald" locale={locale} />
      <SummaryCard label={attendanceLabels.absent} value={summary.absent} tone="red" locale={locale} />
      <SummaryCard label={attendanceLabels.late} value={summary.late} tone="amber" locale={locale} />
      <SummaryCard label={attendanceLabels.excused} value={summary.excused} tone="sky" locale={locale} />
      <SummaryCard label={isFa ? "ثبت‌نشده" : "Unmarked"} value={summary.unmarked} tone="zinc" locale={locale} />
      <SummaryCard label={isFa ? "نمره‌دار" : "Graded"} value={summary.graded} tone="violet" locale={locale} />
    </div>

    <PanelSurface>
      <div className="border-b border-zinc-200 bg-zinc-50/70 p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">{isFa ? "دفتر جلسه" : "Session register"}</h2>
            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{isFa ? "حضور را سریع ثبت کنید و در صورت نیاز نمره و یادداشت فردی اضافه کنید." : "Mark attendance quickly, then add an optional grade and private note."}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block min-w-36 text-start"><span className="mb-1.5 block text-xs font-medium">{isFa ? "سقف نمره جلسه" : "Session grade maximum"}</span><PanelInput controlSize="compact" type="number" min="0.25" max="1000" step="0.25" value={gradeMax} onChange={(event) => setGradeMax(event.target.value)} required dir="ltr" className="nums-en" /></label>
            <label className="block min-w-56 text-start"><span className="mb-1.5 block text-xs font-medium">{isFa ? "جست‌وجوی دانش پژوه" : "Find a student"}</span><PanelInput controlSize="compact" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isFa ? "نام یا شماره موبایل…" : "Name or mobile…"} /></label>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500">{isFa ? "ثبت سریع:" : "Quick mark:"}</span>
          {attendanceValues.map((value) => <button key={value} type="button" onClick={() => setAllAttendance(value)} className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${attendanceStyle[value]}`}>{attendanceLabels[value]}</button>)}
          <button type="button" onClick={() => setAllAttendance(null)} className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">{isFa ? "پاک‌کردن حضور" : "Clear attendance"}</button>
          <span className="ms-auto text-xs text-zinc-500">{isFa ? `${number.format(filtered.length)} از ${number.format(records.length)} نفر` : `${filtered.length} of ${records.length} students`}</span>
        </div>
      </div>

      {filtered.length ? <>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full table-fixed text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"><tr><th className="w-[23%] px-4 py-3 text-start font-medium">{isFa ? "دانش پژوه" : "Student"}</th><th className="w-[34%] px-4 py-3 text-start font-medium">{isFa ? "حضور" : "Attendance"}</th><th className="w-[15%] px-4 py-3 text-start font-medium">{isFa ? "نمره" : "Grade"}</th><th className="w-[28%] px-4 py-3 text-start font-medium">{isFa ? "یادداشت" : "Note"}</th></tr></thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">{filtered.map((record) => <DesktopRow key={record.studentId} record={record} locale={locale} gradeMax={gradeMax} updateRecord={updateRecord} />)}</tbody>
          </table>
        </div>
        <div className="divide-y divide-zinc-200 md:hidden dark:divide-zinc-800">{filtered.map((record) => <MobileCard key={record.studentId} record={record} locale={locale} gradeMax={gradeMax} updateRecord={updateRecord} />)}</div>
      </> : <div className="px-6 py-12 text-center"><p className="font-semibold">{isFa ? "دانش پژوهی پیدا نشد" : "No student found"}</p><p className="mt-2 text-sm text-zinc-500">{isFa ? "عبارت جست‌وجو را تغییر دهید." : "Try a different search."}</p></div>}
    </PanelSurface>

    <PanelFormFooter error={state.error} message={isFa ? "یادداشت‌ها فقط در پنل آموزشی نمایش داده می‌شوند. نمره می‌تواند اعشاری باشد." : "Notes stay inside the learning panel. Grades may use decimals."}>
      <button type="button" onClick={() => { setRecords(roster.map((student) => ({ ...student, grade: student.grade ?? "" }))); setGradeMax(initialGradeMax); }} className={secondaryButtonClass}>{isFa ? "بازنشانی" : "Reset"}</button>
      <button disabled={pending || !records.length || !gradeMax} className={primaryButtonClass}>{pending ? (isFa ? "در حال ذخیره…" : "Saving…") : (isFa ? "ذخیره حضور و نمره‌ها" : "Save attendance & grades")}</button>
    </PanelFormFooter>
  </form>;
}

function AttendancePicker({ value, locale, onChange }: { value: AttendanceStatus | null; locale: Locale; onChange: (value: AttendanceStatus | null) => void }) {
  const text = labels(locale);
  return <div role="group" aria-label={locale === "fa" ? "وضعیت حضور" : "Attendance status"} className="flex flex-wrap gap-1.5">{attendanceValues.map((status) => <button key={status} type="button" aria-pressed={value === status} onClick={() => onChange(value === status ? null : status)} className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${value === status ? attendanceStyle[status] : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400"}`}>{text[status]}</button>)}</div>;
}

function StudentIdentity({ record, locale }: { record: EditableRecord; locale: Locale }) {
  const isFa = locale === "fa";
  return <div className="flex min-w-0 items-center gap-3"><UserAvatar name={record.studentName} src={record.avatarUrl} className="size-9 shrink-0" /><div className="min-w-0"><p className="truncate font-medium text-zinc-950 dark:text-zinc-50">{record.studentName}</p><p className="nums-en mt-0.5 truncate text-xs text-zinc-500" dir="ltr">{record.mobile}</p>{record.enrollmentStatus !== "active" ? <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{record.enrollmentStatus === "completed" ? (isFa ? "تکمیل‌شده" : "Completed") : (isFa ? "انصراف" : "Withdrawn")}</span> : null}</div></div>;
}

function DesktopRow({ record, locale, gradeMax, updateRecord }: { record: EditableRecord; locale: Locale; gradeMax: string; updateRecord: (studentId: string, values: Partial<Pick<EditableRecord, "attendance" | "grade" | "note">>) => void }) {
  return <tr><td className="px-4 py-4 align-middle"><StudentIdentity record={record} locale={locale} /></td><td className="px-4 py-4 align-middle"><AttendancePicker value={record.attendance} locale={locale} onChange={(attendance) => updateRecord(record.studentId, { attendance })} /></td><td className="px-4 py-4 align-middle"><PanelInput controlSize="compact" aria-label={locale === "fa" ? `نمره ${record.studentName}` : `${record.studentName} grade`} type="number" min="0" max={gradeMax || undefined} step="0.25" value={record.grade} onChange={(event) => updateRecord(record.studentId, { grade: event.target.value })} dir="ltr" className="nums-en" /></td><td className="px-4 py-4 align-middle"><PanelInput controlSize="compact" aria-label={locale === "fa" ? `یادداشت ${record.studentName}` : `${record.studentName} note`} maxLength={500} value={record.note ?? ""} onChange={(event) => updateRecord(record.studentId, { note: event.target.value })} placeholder={locale === "fa" ? "اختیاری…" : "Optional…"} /></td></tr>;
}

function MobileCard({ record, locale, gradeMax, updateRecord }: { record: EditableRecord; locale: Locale; gradeMax: string; updateRecord: (studentId: string, values: Partial<Pick<EditableRecord, "attendance" | "grade" | "note">>) => void }) {
  const isFa = locale === "fa";
  return <div className="space-y-4 p-4"><StudentIdentity record={record} locale={locale} /><AttendancePicker value={record.attendance} locale={locale} onChange={(attendance) => updateRecord(record.studentId, { attendance })} /><div className="grid grid-cols-[7rem_1fr] gap-3"><label className="text-xs font-medium"><span className="mb-1.5 block">{isFa ? "نمره" : "Grade"}</span><PanelInput controlSize="compact" type="number" min="0" max={gradeMax || undefined} step="0.25" value={record.grade} onChange={(event) => updateRecord(record.studentId, { grade: event.target.value })} dir="ltr" className="nums-en" /></label><label className="text-xs font-medium"><span className="mb-1.5 block">{isFa ? "یادداشت" : "Note"}</span><PanelInput controlSize="compact" maxLength={500} value={record.note ?? ""} onChange={(event) => updateRecord(record.studentId, { note: event.target.value })} placeholder={isFa ? "اختیاری…" : "Optional…"} /></label></div></div>;
}

function SummaryCard({ label, value, tone, locale }: { label: string; value: number; tone: "emerald" | "red" | "amber" | "sky" | "zinc" | "violet"; locale: Locale }) {
  const styles = { emerald: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200", red: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200", amber: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200", sky: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200", zinc: "border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200", violet: "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200" };
  return <div className={`rounded-2xl border p-4 ${styles[tone]}`}><p className="text-2xl font-bold">{value.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}</p><p className="mt-1 text-xs font-medium opacity-80">{label}</p></div>;
}
