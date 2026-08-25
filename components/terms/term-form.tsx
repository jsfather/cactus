"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { createTerm, updateTerm, type TermFormState } from "@/app/(panel)/panel/admin/terms/actions";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { PanelDatePicker, PanelTimePicker } from "@/components/panel/date-time-picker";
import { FieldError, FormLabel, PanelInput, PanelSelect, PanelTextarea } from "@/components/panel/form-controls";
import { PanelMultiCombobox } from "@/components/panel/multi-combobox";
import { PanelFormFooter, PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import { countScheduledSessions, termWeekDays, type TermScheduleValue } from "@/lib/terms/schedule";

const initialState: TermFormState = {};
const emptyValues = {
  titleFa: "", titleEn: "", descriptionFa: "", descriptionEn: "", levelId: "", status: "draft", deliveryMode: "in_person", startDate: "", endDate: "", capacity: "", tuitionToman: "0", locationFa: "", locationEn: "", meetingUrl: "",
};

type Option = { id: string; name?: string; mobile?: string; titleFa?: string; titleEn?: string | null; startDate?: string };

export function TermForm({
  locale,
  termId,
  levels,
  teachers,
  prerequisiteTerms,
  initialValues = emptyValues,
  initialTeacherIds = [],
  initialPrerequisiteIds = [],
  initialSchedules = [{ dayOfWeek: 0, startTime: "09:00", endTime: "10:30" }],
}: {
  locale: Locale;
  termId?: string;
  levels: Array<{ id: string; titleFa: string; titleEn: string | null }>;
  teachers: Option[];
  prerequisiteTerms: Option[];
  initialValues?: typeof emptyValues;
  initialTeacherIds?: string[];
  initialPrerequisiteIds?: string[];
  initialSchedules?: TermScheduleValue[];
}) {
  const [state, action, pending] = useActionState(termId ? updateTerm.bind(null, termId) : createTerm, initialState);
  const { bind, bindValue, values } = usePreservedFields(initialValues);
  const [teacherIds, setTeacherIds] = useState(initialTeacherIds);
  const [prerequisiteIds, setPrerequisiteIds] = useState(initialPrerequisiteIds);
  const [schedules, setSchedules] = useState(initialSchedules);
  useActionErrorToast(state);
  const isFa = locale === "fa";
  const number = useMemo(() => new Intl.NumberFormat(isFa ? "fa-IR" : "en-US"), [isFa]);
  const date = useMemo(() => new Intl.DateTimeFormat(isFa ? "fa-IR-u-ca-persian" : "en-US-u-ca-gregory", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }), [isFa]);
  const estimatedSessions = countScheduledSessions(values.startDate, values.endDate, schedules);

  function toggle(selected: string[], setSelected: (value: string[]) => void, id: string) {
    setSelected(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  }
  function updateSchedule(index: number, key: keyof TermScheduleValue, value: string | number) {
    setSchedules((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  }

  return <form action={action} className="space-y-6">
    <input type="hidden" name="locale" value={locale} />
    <input type="hidden" name="schedules" value={JSON.stringify(schedules)} />
    {teacherIds.map((id) => <input key={id} type="hidden" name="teacherIds" value={id} />)}
    {prerequisiteIds.map((id) => <input key={id} type="hidden" name="prerequisiteIds" value={id} />)}

    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="space-y-6">
        <PanelFormSection title={isFa ? "مشخصات ترم" : "Term information"} description={isFa ? "عنوان و محتوای اصلی را در هر دو زبان ثبت کنید." : "Add the core title and description in both languages."}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><FormLabel label={isFa ? "عنوان فارسی" : "Persian title"}><PanelInput {...bind("titleFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.titleFa} /></div>
            <div><FormLabel label={isFa ? "عنوان انگلیسی" : "English title"}><PanelInput {...bind("titleEn")} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.titleEn} /></div>
            <div><FormLabel label={isFa ? "توضیح فارسی" : "Persian description"}><PanelTextarea {...bind("descriptionFa")} rows={5} dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.descriptionFa} /></div>
            <div><FormLabel label={isFa ? "توضیح انگلیسی" : "English description"}><PanelTextarea {...bind("descriptionEn")} rows={5} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.descriptionEn} /></div>
          </div>
        </PanelFormSection>

        <PanelFormSection title={isFa ? "مدرس‌ها و پیش‌نیازها" : "Teachers and prerequisites"} description={isFa ? "حداقل یک مدرس فعال الزامی است. پیش‌نیازها بر اساس تکمیل واقعی ترم‌های قبلی بررسی می‌شوند." : "At least one active teacher is required. Prerequisites are checked against completed prior enrollments."}>
          <div className="grid gap-6 md:grid-cols-2">
            <fieldset><legend className="text-sm font-medium">{isFa ? "مدرس‌های ترم" : "Term teachers"}</legend><div className="mt-3">
              {teachers.length ? <PanelMultiCombobox locale={locale} label={isFa ? "مدرس‌های ترم" : "Term teachers"} options={teachers.map((teacher) => ({ value: teacher.id, label: teacher.name ?? "", description: teacher.mobile }))} value={teacherIds} onValueChange={setTeacherIds} placeholder={isFa ? "مدرس‌ها را جست‌وجو و انتخاب کنید" : "Search and choose teachers"} /> : <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">{isFa ? "مدرس فعال وجود ندارد. ابتدا از بخش مدرسین یک حساب فعال بسازید." : "No active teacher exists. Create an active teacher account first."}</p>}
            </div><FieldError errors={state.fieldErrors?.teacherIds} /></fieldset>
            <fieldset><legend className="text-sm font-medium">{isFa ? "ترم‌های پیش‌نیاز (اختیاری)" : "Prerequisite terms (optional)"}</legend><div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              {prerequisiteTerms.length ? prerequisiteTerms.map((term) => <label key={term.id} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-zinc-50 dark:hover:bg-zinc-900"><input type="checkbox" checked={prerequisiteIds.includes(term.id)} onChange={() => toggle(prerequisiteIds, setPrerequisiteIds, term.id)} className="mt-1 size-4 accent-emerald-700" /><span><span className="block text-sm font-medium">{locale === "en" ? term.titleEn || term.titleFa : term.titleFa}</span><span className="mt-0.5 block text-xs text-zinc-500">{term.startDate ? date.format(new Date(`${term.startDate}T12:00:00Z`)) : ""}</span></span></label>) : <p className="text-sm text-zinc-500">{isFa ? "ترم دیگری برای انتخاب وجود ندارد." : "No other term is available."}</p>}
            </div><FieldError errors={state.fieldErrors?.prerequisiteIds} /></fieldset>
          </div>
        </PanelFormSection>

        <PanelFormSection title={isFa ? "برنامه هفتگی" : "Weekly schedule"} description={isFa ? "حداقل یک جلسه هفتگی تعریف کنید. سامانه تعداد تقریبی جلسات و برنامه همه افراد را از همین الگو می‌سازد." : "Add at least one weekly meeting. The system derives estimated sessions and everyone's schedule from this pattern."}>
          <div className="space-y-3">
            {schedules.map((schedule, index) => <div key={index} className="grid items-end gap-3 rounded-xl border border-zinc-200 p-4 sm:grid-cols-[1fr_1fr_1fr_auto] dark:border-zinc-800">
              <FormLabel label={isFa ? "روز" : "Day"}><PanelSelect value={schedule.dayOfWeek} onChange={(event) => updateSchedule(index, "dayOfWeek", Number(event.target.value))}>{termWeekDays.map((day) => <option key={day.value} value={day.value}>{day[locale]}</option>)}</PanelSelect></FormLabel>
              <FormLabel label={isFa ? "شروع" : "Starts"}><PanelTimePicker locale={locale} value={schedule.startTime} onValueChange={(value) => updateSchedule(index, "startTime", value)} required aria-label={isFa ? `زمان شروع جلسه ${number.format(index + 1)}` : `Meeting ${index + 1} start time`} /></FormLabel>
              <FormLabel label={isFa ? "پایان" : "Ends"}><PanelTimePicker locale={locale} value={schedule.endTime} onValueChange={(value) => updateSchedule(index, "endTime", value)} required aria-label={isFa ? `زمان پایان جلسه ${number.format(index + 1)}` : `Meeting ${index + 1} end time`} /></FormLabel>
              <button type="button" disabled={schedules.length === 1} onClick={() => setSchedules((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="h-12 cursor-pointer rounded-xl border border-red-200 px-4 text-sm font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900 dark:text-red-400">{isFa ? "حذف" : "Remove"}</button>
            </div>)}
            <div className="flex flex-col gap-3 rounded-xl bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-emerald-950/30"><p className="text-sm text-emerald-900 dark:text-emerald-200">{estimatedSessions ? (isFa ? `برآورد: ${number.format(estimatedSessions)} جلسه در بازه انتخاب‌شده` : `Estimate: ${number.format(estimatedSessions)} meetings in the selected date range`) : (isFa ? "با انتخاب تاریخ‌ها، تعداد تقریبی جلسات نمایش داده می‌شود." : "Choose dates to see the estimated meeting count.")}</p><button type="button" onClick={() => setSchedules((current) => [...current, { dayOfWeek: 0, startTime: "09:00", endTime: "10:30" }])} className={secondaryButtonClass}>{isFa ? "افزودن زمان" : "Add meeting"}</button></div>
            <FieldError errors={state.fieldErrors?.schedules} />
          </div>
        </PanelFormSection>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-6">
        <PanelFormSection title={isFa ? "دوره و انتشار" : "Dates and status"}>
          <div className="space-y-5">
            <div><FormLabel label={isFa ? "سطح" : "Level"}><PanelSelect {...bind("levelId")} required><option value="">{isFa ? "انتخاب سطح" : "Select level"}</option>{levels.map((level) => <option key={level.id} value={level.id}>{locale === "en" ? level.titleEn || level.titleFa : level.titleFa}</option>)}</PanelSelect></FormLabel><FieldError errors={state.fieldErrors?.levelId} />{!levels.length ? <Link href="/panel/admin/term-levels/new" className="mt-2 inline-block text-xs font-medium text-emerald-700 dark:text-emerald-400">{isFa ? "ابتدا یک سطح بسازید" : "Create a level first"}</Link> : null}</div>
            <div><FormLabel label={isFa ? "وضعیت" : "Status"}><PanelSelect {...bind("status")}><option value="draft">{isFa ? "پیش‌نویس" : "Draft"}</option><option value="enrollment_open">{isFa ? "ثبت‌نام باز" : "Enrollment open"}</option><option value="active">{isFa ? "در حال برگزاری" : "Active"}</option><option value="completed">{isFa ? "تکمیل‌شده" : "Completed"}</option><option value="cancelled">{isFa ? "لغوشده" : "Cancelled"}</option></PanelSelect></FormLabel></div>
            <div><FormLabel label={isFa ? "تاریخ شروع" : "Start date"}><PanelDatePicker {...bindValue("startDate")} locale={locale} required aria-label={isFa ? "تاریخ شروع ترم" : "Term start date"} /></FormLabel><FieldError errors={state.fieldErrors?.startDate} /></div>
            <div><FormLabel label={isFa ? "تاریخ پایان" : "End date"}><PanelDatePicker {...bindValue("endDate")} locale={locale} min={values.startDate || undefined} required aria-label={isFa ? "تاریخ پایان ترم" : "Term end date"} /></FormLabel><FieldError errors={state.fieldErrors?.endDate} /></div>
          </div>
        </PanelFormSection>

        <PanelFormSection title={isFa ? "ظرفیت و شهریه" : "Capacity and tuition"}>
          <div className="space-y-5">
            <div><FormLabel label={isFa ? "ظرفیت" : "Capacity"} hint={isFa ? "خالی یعنی بدون محدودیت." : "Leave blank for unlimited."}><PanelInput {...bind("capacity")} type="number" min="1" max="10000" inputMode="numeric" dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.capacity} /></div>
            <div><FormLabel label={isFa ? "شهریه (تومان)" : "Tuition (toman)"} hint={isFa ? "صفر یعنی رایگان." : "Use zero for a free term."}><PanelInput {...bind("tuitionToman")} type="number" min="0" inputMode="numeric" required dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.tuitionToman} /></div>
          </div>
        </PanelFormSection>

        <PanelFormSection title={isFa ? "نحوه برگزاری" : "Delivery"}>
          <div className="space-y-5">
            <div><FormLabel label={isFa ? "نوع برگزاری" : "Delivery mode"}><PanelSelect {...bind("deliveryMode")}><option value="in_person">{isFa ? "حضوری" : "In person"}</option><option value="online">{isFa ? "آنلاین" : "Online"}</option><option value="hybrid">{isFa ? "ترکیبی" : "Hybrid"}</option></PanelSelect></FormLabel></div>
            {values.deliveryMode !== "online" ? <><div><FormLabel label={isFa ? "نشانی فارسی" : "Persian location"}><PanelTextarea {...bind("locationFa")} rows={3} dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.locationFa} /></div><FormLabel label={isFa ? "نشانی انگلیسی" : "English location"}><PanelTextarea {...bind("locationEn")} rows={3} dir="ltr" /></FormLabel></> : null}
            {values.deliveryMode !== "in_person" ? <div><FormLabel label={isFa ? "پیوند کلاس آنلاین" : "Online meeting link"}><PanelInput {...bind("meetingUrl")} type="url" dir="ltr" className="nums-en" placeholder="https://…" /></FormLabel><FieldError errors={state.fieldErrors?.meetingUrl} /></div> : null}
          </div>
        </PanelFormSection>
      </aside>
    </div>

    <PanelFormFooter error={state.error} message={isFa ? "تعداد جلسات و مدت ترم از تاریخ‌ها و برنامه هفتگی محاسبه می‌شود؛ نیازی به ورود دستی آن‌ها نیست." : "Duration and session count are derived from dates and the weekly schedule."}>
      <Link href="/panel/admin/terms" className={secondaryButtonClass}>{isFa ? "انصراف" : "Cancel"}</Link>
      <button disabled={pending || !levels.length || !teachers.length} className={primaryButtonClass}>{pending ? (isFa ? "در حال ذخیره…" : "Saving…") : (isFa ? "ذخیره ترم" : "Save term")}</button>
    </PanelFormFooter>
  </form>;
}
