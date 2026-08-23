"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  saveAdminTeacherProfile,
  saveOwnTeacherProfile,
  type TeacherProfileFormState,
} from "@/app/(panel)/panel/teacher-profile-actions";
import { RichTextEditor } from "@/components/content/rich-text-editor";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { FieldError, FormLabel, PanelInput, PanelTextarea } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

type SkillValue = { _key: string; nameFa: string; nameEn: string; score: number };
type WorkValue = { _key: string; companyFa: string; companyEn: string; positionFa: string; positionEn: string; periodFa: string; periodEn: string; descriptionFa: string; descriptionEn: string };
type EducationValue = { _key: string; institutionFa: string; institutionEn: string; degreeFa: string; degreeEn: string; fieldFa: string; fieldEn: string; periodFa: string; periodEn: string; descriptionFa: string; descriptionEn: string };

export type TeacherProfileFormValues = {
  mobile: string;
  firstNameFa: string;
  lastNameFa: string;
  firstNameEn: string;
  lastNameEn: string;
  email: string;
  avatarUrl: string;
  username: string;
  nationalCode: string;
  cityFa: string;
  cityEn: string;
  biographyFa: string;
  biographyEn: string;
  aboutFa: string;
  aboutEn: string;
  achievementsFa: string;
  achievementsEn: string;
  memberSince: string;
  isPublic: boolean;
  skills: SkillValue[];
  workExperiences: WorkValue[];
  educations: EducationValue[];
};

const initialState: TeacherProfileFormState = {};
const key = () => crypto.randomUUID();

export function TeacherProfileForm({
  locale,
  values: initialValues,
  teacherId,
  cancelHref,
}: {
  locale: Locale;
  values: TeacherProfileFormValues;
  teacherId?: string;
  cancelHref: string;
}) {
  const isFa = locale === "fa";
  const actionHandler = teacherId
    ? saveAdminTeacherProfile.bind(null, teacherId)
    : saveOwnTeacherProfile;
  const [state, action, pending] = useActionState(actionHandler, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({
    firstNameFa: initialValues.firstNameFa,
    lastNameFa: initialValues.lastNameFa,
    firstNameEn: initialValues.firstNameEn,
    lastNameEn: initialValues.lastNameEn,
    email: initialValues.email,
    username: initialValues.username,
    nationalCode: initialValues.nationalCode,
    cityFa: initialValues.cityFa,
    cityEn: initialValues.cityEn,
    memberSince: initialValues.memberSince,
  });
  const [isPublic, setIsPublic] = useState(initialValues.isPublic);
  const [skills, setSkills] = useState(initialValues.skills);
  const [workExperiences, setWorkExperiences] = useState(initialValues.workExperiences);
  const [educations, setEducations] = useState(initialValues.educations);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="skillsJson" value={JSON.stringify(skills)} />
      <input type="hidden" name="workExperiencesJson" value={JSON.stringify(workExperiences)} />
      <input type="hidden" name="educationsJson" value={JSON.stringify(educations)} />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          <PanelFormSection
            title={isFa ? "اطلاعات شخصی" : "Personal information"}
            description={isFa ? "نام‌های فارسی الزامی و نام‌های انگلیسی اختیاری هستند. اطلاعات خصوصی در سایت عمومی نمایش داده نمی‌شوند." : "Persian names are required and English names are optional. Private identity details are never shown publicly."}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label={isFa ? "نام فارسی *" : "Persian first name *"} errors={state.fieldErrors?.firstNameFa}><PanelInput {...bind("firstNameFa")} required dir="rtl" autoComplete="given-name" /></TextField>
              <TextField label={isFa ? "نام خانوادگی فارسی *" : "Persian last name *"} errors={state.fieldErrors?.lastNameFa}><PanelInput {...bind("lastNameFa")} required dir="rtl" autoComplete="family-name" /></TextField>
              <TextField label={isFa ? "نام انگلیسی (اختیاری)" : "English first name (optional)"} errors={state.fieldErrors?.firstNameEn}><PanelInput {...bind("firstNameEn")} dir="ltr" className="nums-en" autoComplete="given-name" /></TextField>
              <TextField label={isFa ? "نام خانوادگی انگلیسی (اختیاری)" : "English last name (optional)"} errors={state.fieldErrors?.lastNameEn}><PanelInput {...bind("lastNameEn")} dir="ltr" className="nums-en" autoComplete="family-name" /></TextField>
              <TextField label={isFa ? "ایمیل (اختیاری)" : "Email (optional)"} errors={state.fieldErrors?.email}><PanelInput {...bind("email")} type="email" dir="ltr" className="nums-en" autoComplete="email" /></TextField>
              <FormLabel label={isFa ? "شماره موبایل" : "Mobile number"} hint={isFa ? "شماره ورود از بخش حساب کاربری مدیریت می‌شود." : "The sign-in number is managed from account settings."}><PanelInput value={initialValues.mobile} readOnly disabled dir="ltr" className="nums-en" /></FormLabel>
              <TextField label={isFa ? "کد ملی *" : "National ID *"} errors={state.fieldErrors?.nationalCode}><PanelInput {...bind("nationalCode")} required inputMode="numeric" maxLength={10} dir="ltr" className="nums-en" /></TextField>
              <TextField label={isFa ? "نام کاربری *" : "Username *"} errors={state.fieldErrors?.username} hint={isFa ? "نشانی عمومی پروفایل؛ فقط حروف انگلیسی کوچک، عدد و زیرخط" : "Public profile address; lowercase letters, numbers, and underscores only"}><PanelInput {...bind("username")} required minLength={3} maxLength={32} pattern="[a-z0-9_]+" dir="ltr" className="nums-en" autoComplete="username" /></TextField>
              <TextField label={isFa ? "شهر فارسی *" : "City in Persian *"} errors={state.fieldErrors?.cityFa}><PanelInput {...bind("cityFa")} required dir="rtl" /></TextField>
              <TextField label={isFa ? "شهر انگلیسی (اختیاری)" : "City in English (optional)"} errors={state.fieldErrors?.cityEn}><PanelInput {...bind("cityEn")} dir="ltr" /></TextField>
            </div>
          </PanelFormSection>

          <RichPair title={isFa ? "بیوگرافی" : "Biography"} description={isFa ? "خلاصه حرفه‌ای کوتاه و مناسب کارت معرفی مدرس." : "A concise professional introduction suitable for the teacher card."} locale={locale} faName="biographyFa" enName="biographyEn" faValue={initialValues.biographyFa} enValue={initialValues.biographyEn} faErrors={state.fieldErrors?.biographyFa} enErrors={state.fieldErrors?.biographyEn} required />
          <RichPair title={isFa ? "درباره مدرس" : "About the teacher"} description={isFa ? "مسیر آموزشی، رویکرد تدریس و حوزه‌های تخصص را کامل‌تر توضیح دهید." : "Describe the teaching journey, approach, and areas of expertise."} locale={locale} faName="aboutFa" enName="aboutEn" faValue={initialValues.aboutFa} enValue={initialValues.aboutEn} faErrors={state.fieldErrors?.aboutFa} enErrors={state.fieldErrors?.aboutEn} required />
          <RichPair title={isFa ? "دستاوردها" : "Achievements"} description={isFa ? "افتخارات، مسابقات، پژوهش‌ها و پروژه‌های شاخص را وارد کنید؛ این بخش اختیاری است." : "Add awards, competitions, research, and notable projects. This section is optional."} locale={locale} faName="achievementsFa" enName="achievementsEn" faValue={initialValues.achievementsFa} enValue={initialValues.achievementsEn} faErrors={state.fieldErrors?.achievementsFa} enErrors={state.fieldErrors?.achievementsEn} />

          <PanelFormSection title={isFa ? "مهارت‌ها" : "Skills"} description={isFa ? "برای هر مهارت عنوان فارسی، عنوان انگلیسی اختیاری و میزان تسلط را ثبت کنید." : "Add a Persian title, optional English title, and proficiency score for each skill."}>
            <RepeatableHeader onAdd={() => setSkills((current) => [...current, { _key: key(), nameFa: "", nameEn: "", score: 50 }])} label={isFa ? "افزودن مهارت" : "Add skill"} />
            <FieldError errors={state.fieldErrors?.skills} />
            <div className="mt-5 space-y-4">
              {skills.length ? skills.map((skill, index) => (
                <RepeatableCard key={skill._key} title={isFa ? `مهارت ${index + 1}` : `Skill ${index + 1}`} removeLabel={isFa ? "حذف مهارت" : "Remove skill"} onRemove={() => setSkills((current) => current.filter((item) => item._key !== skill._key))}>
                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem]">
                    <FormLabel label={isFa ? "نام فارسی *" : "Persian name *"}><PanelInput value={skill.nameFa} onChange={(event) => updateItem(setSkills, skill._key, "nameFa", event.target.value)} required dir="rtl" /></FormLabel>
                    <FormLabel label={isFa ? "نام انگلیسی" : "English name"}><PanelInput value={skill.nameEn} onChange={(event) => updateItem(setSkills, skill._key, "nameEn", event.target.value)} dir="ltr" /></FormLabel>
                    <FormLabel label={isFa ? "امتیاز" : "Score"}><PanelInput value={skill.score} onChange={(event) => updateItem(setSkills, skill._key, "score", Number(event.target.value))} type="number" min={0} max={100} required dir="ltr" className="nums-en" /></FormLabel>
                  </div>
                </RepeatableCard>
              )) : <EmptyRows text={isFa ? "هنوز مهارتی اضافه نشده است." : "No skills added yet."} />}
            </div>
          </PanelFormSection>

          <PanelFormSection title={isFa ? "تجربیات کاری" : "Work experience"} description={isFa ? "سوابق مرتبط با آموزش، رباتیک و فعالیت حرفه‌ای را به ترتیب وارد کنید." : "Add relevant teaching, robotics, and professional experience in display order."}>
            <RepeatableHeader onAdd={() => setWorkExperiences((current) => [...current, { _key: key(), companyFa: "", companyEn: "", positionFa: "", positionEn: "", periodFa: "", periodEn: "", descriptionFa: "", descriptionEn: "" }])} label={isFa ? "افزودن تجربه کاری" : "Add experience"} />
            <FieldError errors={state.fieldErrors?.workExperiences} />
            <div className="mt-5 space-y-4">
              {workExperiences.length ? workExperiences.map((item, index) => <WorkEditor key={item._key} item={item} index={index} locale={locale} onChange={(field, value) => updateItem(setWorkExperiences, item._key, field, value)} onRemove={() => setWorkExperiences((current) => current.filter((entry) => entry._key !== item._key))} />) : <EmptyRows text={isFa ? "هنوز تجربه کاری اضافه نشده است." : "No work experience added yet."} />}
            </div>
          </PanelFormSection>

          <PanelFormSection title={isFa ? "تحصیلات" : "Education"} description={isFa ? "مدرک، رشته، مرکز آموزشی و بازه تحصیل را ثبت کنید." : "Add the degree, field, institution, and study period."}>
            <RepeatableHeader onAdd={() => setEducations((current) => [...current, { _key: key(), institutionFa: "", institutionEn: "", degreeFa: "", degreeEn: "", fieldFa: "", fieldEn: "", periodFa: "", periodEn: "", descriptionFa: "", descriptionEn: "" }])} label={isFa ? "افزودن تحصیلات" : "Add education"} />
            <FieldError errors={state.fieldErrors?.educations} />
            <div className="mt-5 space-y-4">
              {educations.length ? educations.map((item, index) => <EducationEditor key={item._key} item={item} index={index} locale={locale} onChange={(field, value) => updateItem(setEducations, item._key, field, value)} onRemove={() => setEducations((current) => current.filter((entry) => entry._key !== item._key))} />) : <EmptyRows text={isFa ? "هنوز سابقه تحصیلی اضافه نشده است." : "No education added yet."} />}
            </div>
          </PanelFormSection>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6">
          <PanelFormSection title={isFa ? "تصویر مدرس" : "Teacher image"} description={isFa ? "یک تصویر واضح و مربعی برای کارت و صفحه عمومی انتخاب کنید." : "Choose a clear square image for the public card and profile."}>
            <ImageUploadField name="avatarUrl" kind="avatar" locale={locale} initialValue={initialValues.avatarUrl} label={isFa ? "تصویر پروفایل" : "Profile image"} aspect="square" layout="stacked" />
            <FieldError errors={state.fieldErrors?.avatarUrl} />
          </PanelFormSection>
          <PanelFormSection title={isFa ? "نمایش در سایت" : "Website visibility"} description={isFa ? "فقط حساب‌های فعال با این گزینه در صفحه مدرسین و صفحه اصلی نمایش داده می‌شوند." : "Only active accounts with this option enabled appear on the Teachers page and homepage."}>
            <div className="space-y-5">
              <TextField label={isFa ? "عضو کاکتوس از تاریخ *" : "Cactus member since *"} errors={state.fieldErrors?.memberSince}><PanelInput {...bind("memberSince")} type="date" required max={new Date().toISOString().slice(0, 10)} dir="ltr" className="nums-en" /></TextField>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-start dark:border-zinc-800 dark:bg-zinc-900">
                <input type="checkbox" name="isPublic" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-emerald-700" />
                <span><span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">{isFa ? "نمایش عمومی مدرس" : "Show teacher publicly"}</span><span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">{isFa ? "با خاموش کردن این گزینه، صفحه عمومی بلافاصله از دسترس خارج می‌شود." : "Turning this off immediately removes the public profile."}</span></span>
              </label>
            </div>
          </PanelFormSection>
        </aside>
      </div>

      <PanelFormFooter error={state.error} message={isFa ? "تغییرات بدون فرآیند تأیید دانش پژوهی ذخیره می‌شوند و وضعیت نمایش عمومی بلافاصله اعمال می‌شود." : "Changes are saved without the student review workflow, and public visibility takes effect immediately."}>
        <Link href={cancelHref} className={secondaryButtonClass}>{isFa ? "انصراف" : "Cancel"}</Link>
        <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? (isFa ? "در حال ذخیره…" : "Saving…") : (isFa ? "ذخیره پروفایل حرفه‌ای" : "Save professional profile")}</button>
      </PanelFormFooter>
    </form>
  );
}

function TextField({ label, hint, errors, children }: { label: string; hint?: string; errors?: string[]; children: React.ReactNode }) {
  return <div><FormLabel label={label} hint={hint}>{children}</FormLabel><FieldError errors={errors} /></div>;
}

function RichPair({ title, description, locale, faName, enName, faValue, enValue, faErrors, enErrors, required = false }: { title: string; description: string; locale: Locale; faName: string; enName: string; faValue: string; enValue: string; faErrors?: string[]; enErrors?: string[]; required?: boolean }) {
  const isFa = locale === "fa";
  return <PanelFormSection title={title} description={description}><div className="grid gap-6 2xl:grid-cols-2"><div><p className="mb-2 text-sm font-medium">{isFa ? `محتوای فارسی${required ? " *" : ""}` : `Persian content${required ? " *" : ""}`}</p><RichTextEditor name={faName} initialValue={faValue} locale={locale} contentDirection="rtl" required={required} compact /><FieldError errors={faErrors} /></div><div><p className="mb-2 text-sm font-medium">{isFa ? "محتوای انگلیسی (اختیاری)" : "English content (optional)"}</p><RichTextEditor name={enName} initialValue={enValue} locale={locale} contentDirection="ltr" compact /><FieldError errors={enErrors} /></div></div></PanelFormSection>;
}

function RepeatableHeader({ onAdd, label }: { onAdd: () => void; label: string }) {
  return <button type="button" onClick={onAdd} className={secondaryButtonClass}><span aria-hidden="true">+</span>{label}</button>;
}

function RepeatableCard({ title, removeLabel, onRemove, children }: { title: string; removeLabel: string; onRemove: () => void; children: React.ReactNode }) {
  return <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"><div className="mb-4 flex items-center justify-between gap-4"><h3 className="text-sm font-semibold">{title}</h3><button type="button" onClick={onRemove} className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">{removeLabel}</button></div>{children}</div>;
}

function EmptyRows({ text }: { text: string }) { return <p className="rounded-xl border border-dashed border-zinc-300 p-5 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">{text}</p>; }

function updateItem<T extends { _key: string }, K extends keyof T>(setter: React.Dispatch<React.SetStateAction<T[]>>, itemKey: string, field: K, value: T[K]) {
  setter((current) => current.map((item) => item._key === itemKey ? { ...item, [field]: value } : item));
}

function WorkEditor({ item, index, locale, onChange, onRemove }: { item: WorkValue; index: number; locale: Locale; onChange: <K extends keyof WorkValue>(field: K, value: WorkValue[K]) => void; onRemove: () => void }) {
  const isFa = locale === "fa";
  return <RepeatableCard title={isFa ? `تجربه کاری ${index + 1}` : `Experience ${index + 1}`} removeLabel={isFa ? "حذف تجربه" : "Remove experience"} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><FormLabel label={isFa ? "نام مجموعه فارسی *" : "Organization in Persian *"}><PanelInput value={item.companyFa} onChange={(e) => onChange("companyFa", e.target.value)} required dir="rtl" /></FormLabel><FormLabel label={isFa ? "نام مجموعه انگلیسی" : "Organization in English"}><PanelInput value={item.companyEn} onChange={(e) => onChange("companyEn", e.target.value)} dir="ltr" /></FormLabel><FormLabel label={isFa ? "سمت فارسی *" : "Position in Persian *"}><PanelInput value={item.positionFa} onChange={(e) => onChange("positionFa", e.target.value)} required dir="rtl" /></FormLabel><FormLabel label={isFa ? "سمت انگلیسی" : "Position in English"}><PanelInput value={item.positionEn} onChange={(e) => onChange("positionEn", e.target.value)} dir="ltr" /></FormLabel><FormLabel label={isFa ? "بازه فعالیت فارسی *" : "Period in Persian *"}><PanelInput value={item.periodFa} onChange={(e) => onChange("periodFa", e.target.value)} required dir="rtl" placeholder="۱۳۹۸ تا ۱۴۰۴" /></FormLabel><FormLabel label={isFa ? "بازه فعالیت انگلیسی" : "Period in English"}><PanelInput value={item.periodEn} onChange={(e) => onChange("periodEn", e.target.value)} dir="ltr" className="nums-en" placeholder="2019–2025" /></FormLabel><div className="sm:col-span-2 grid gap-4 sm:grid-cols-2"><FormLabel label={isFa ? "توضیحات فارسی" : "Persian description"}><PanelTextarea value={item.descriptionFa} onChange={(e) => onChange("descriptionFa", e.target.value)} rows={3} dir="rtl" /></FormLabel><FormLabel label={isFa ? "توضیحات انگلیسی" : "English description"}><PanelTextarea value={item.descriptionEn} onChange={(e) => onChange("descriptionEn", e.target.value)} rows={3} dir="ltr" /></FormLabel></div></div></RepeatableCard>;
}

function EducationEditor({ item, index, locale, onChange, onRemove }: { item: EducationValue; index: number; locale: Locale; onChange: <K extends keyof EducationValue>(field: K, value: EducationValue[K]) => void; onRemove: () => void }) {
  const isFa = locale === "fa";
  return <RepeatableCard title={isFa ? `تحصیلات ${index + 1}` : `Education ${index + 1}`} removeLabel={isFa ? "حذف تحصیلات" : "Remove education"} onRemove={onRemove}><div className="grid gap-4 sm:grid-cols-2"><FormLabel label={isFa ? "مرکز آموزشی فارسی *" : "Institution in Persian *"}><PanelInput value={item.institutionFa} onChange={(e) => onChange("institutionFa", e.target.value)} required dir="rtl" /></FormLabel><FormLabel label={isFa ? "مرکز آموزشی انگلیسی" : "Institution in English"}><PanelInput value={item.institutionEn} onChange={(e) => onChange("institutionEn", e.target.value)} dir="ltr" /></FormLabel><FormLabel label={isFa ? "مدرک فارسی *" : "Degree in Persian *"}><PanelInput value={item.degreeFa} onChange={(e) => onChange("degreeFa", e.target.value)} required dir="rtl" /></FormLabel><FormLabel label={isFa ? "مدرک انگلیسی" : "Degree in English"}><PanelInput value={item.degreeEn} onChange={(e) => onChange("degreeEn", e.target.value)} dir="ltr" /></FormLabel><FormLabel label={isFa ? "رشته فارسی *" : "Field in Persian *"}><PanelInput value={item.fieldFa} onChange={(e) => onChange("fieldFa", e.target.value)} required dir="rtl" /></FormLabel><FormLabel label={isFa ? "رشته انگلیسی" : "Field in English"}><PanelInput value={item.fieldEn} onChange={(e) => onChange("fieldEn", e.target.value)} dir="ltr" /></FormLabel><FormLabel label={isFa ? "بازه تحصیل فارسی *" : "Study period in Persian *"}><PanelInput value={item.periodFa} onChange={(e) => onChange("periodFa", e.target.value)} required dir="rtl" /></FormLabel><FormLabel label={isFa ? "بازه تحصیل انگلیسی" : "Study period in English"}><PanelInput value={item.periodEn} onChange={(e) => onChange("periodEn", e.target.value)} dir="ltr" className="nums-en" /></FormLabel><div className="sm:col-span-2 grid gap-4 sm:grid-cols-2"><FormLabel label={isFa ? "توضیحات فارسی" : "Persian description"}><PanelTextarea value={item.descriptionFa} onChange={(e) => onChange("descriptionFa", e.target.value)} rows={3} dir="rtl" /></FormLabel><FormLabel label={isFa ? "توضیحات انگلیسی" : "English description"}><PanelTextarea value={item.descriptionEn} onChange={(e) => onChange("descriptionEn", e.target.value)} rows={3} dir="ltr" /></FormLabel></div></div></RepeatableCard>;
}
