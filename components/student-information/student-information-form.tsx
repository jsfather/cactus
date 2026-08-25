"use client";

import { useActionState } from "react";
import { submitStudentInformation, type StudentInformationFormState } from "@/app/(panel)/panel/student/information/actions";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { PanelDatePicker } from "@/components/panel/date-time-picker";
import { FieldError, FormLabel, PanelInput, PanelSelect, PanelTextarea } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass } from "@/components/panel/ui";
import { PrivateDocumentField } from "@/components/student-information/private-document-field";
import type { StudentAllergyStatus, StudentDocumentKind } from "@/lib/db/schema";
import { getTehranTodayIso } from "@/lib/date/local";
import type { Locale } from "@/lib/i18n/config";

type InformationValue = {
  username: string;
  nationalCode: string | null;
  birthDate: string;
  educationLevelFa: string;
  educationLevelEn: string | null;
  fatherNameFa: string;
  fatherNameEn: string | null;
  motherNameFa: string;
  motherNameEn: string | null;
  fatherOccupationFa: string;
  fatherOccupationEn: string | null;
  motherOccupationFa: string;
  motherOccupationEn: string | null;
  allergyStatus: StudentAllergyStatus;
  allergyDescriptionFa: string | null;
  allergyDescriptionEn: string | null;
  interestLevel: number;
  focusLevel: number;
};

type StudentDocumentValue = {
  id: string;
  kind: StudentDocumentKind;
  originalName: string;
  mimeType: string;
  size: number;
};

const initialState: StudentInformationFormState = {};

export function StudentInformationForm({
  locale,
  student,
  information,
  documents,
}: {
  locale: Locale;
  student: {
    mobile: string;
    email: string | null;
    firstNameFa: string;
    lastNameFa: string;
    firstNameEn: string;
    lastNameEn: string;
    avatarUrl: string | null;
  };
  information: InformationValue | null;
  documents: StudentDocumentValue[];
}) {
  const isFa = locale === "fa";
  const [state, action, pending] = useActionState(submitStudentInformation, initialState);
  useActionErrorToast(state);
  const { bind, bindValue, values } = usePreservedFields({
    firstNameFa: student.firstNameFa,
    lastNameFa: student.lastNameFa,
    firstNameEn: student.firstNameEn,
    lastNameEn: student.lastNameEn,
    email: student.email || "",
    username: information?.username || "",
    nationalCode: information?.nationalCode || "",
    birthDate: information?.birthDate || "",
    educationLevelFa: information?.educationLevelFa || "",
    educationLevelEn: information?.educationLevelEn || "",
    fatherNameFa: information?.fatherNameFa || "",
    fatherNameEn: information?.fatherNameEn || "",
    motherNameFa: information?.motherNameFa || "",
    motherNameEn: information?.motherNameEn || "",
    fatherOccupationFa: information?.fatherOccupationFa || "",
    fatherOccupationEn: information?.fatherOccupationEn || "",
    motherOccupationFa: information?.motherOccupationFa || "",
    motherOccupationEn: information?.motherOccupationEn || "",
    allergyStatus: information?.allergyStatus || "none",
    allergyDescriptionFa: information?.allergyDescriptionFa || "",
    allergyDescriptionEn: information?.allergyDescriptionEn || "",
    interestLevel: String(information?.interestLevel || 50),
    focusLevel: String(information?.focusLevel || 50),
  });
  const documentFor = (kind: StudentDocumentKind) => documents.find((document) => document.kind === kind) ?? null;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          <PanelFormSection
            title={isFa ? "اطلاعات شخصی" : "Personal information"}
            description={isFa ? "اطلاعات فارسی الزامی است؛ فیلدهای انگلیسی هنگام تغییر زبان نمایش داده می‌شوند و اختیاری هستند." : "Persian values are required. English values are optional and are shown when the interface language changes."}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div><FormLabel label={isFa ? "نام فارسی *" : "Persian first name *"}><PanelInput {...bind("firstNameFa")} required dir="rtl" autoComplete="given-name" /></FormLabel><FieldError errors={state.fieldErrors?.firstNameFa} /></div>
              <div><FormLabel label={isFa ? "نام خانوادگی فارسی *" : "Persian last name *"}><PanelInput {...bind("lastNameFa")} required dir="rtl" autoComplete="family-name" /></FormLabel><FieldError errors={state.fieldErrors?.lastNameFa} /></div>
              <div><FormLabel label={isFa ? "نام انگلیسی (اختیاری)" : "English first name (optional)"}><PanelInput {...bind("firstNameEn")} dir="ltr" className="nums-en" autoComplete="given-name" /></FormLabel><FieldError errors={state.fieldErrors?.firstNameEn} /></div>
              <div><FormLabel label={isFa ? "نام خانوادگی انگلیسی (اختیاری)" : "English last name (optional)"}><PanelInput {...bind("lastNameEn")} dir="ltr" className="nums-en" autoComplete="family-name" /></FormLabel><FieldError errors={state.fieldErrors?.lastNameEn} /></div>
              <div><FormLabel label={isFa ? "نام کاربری *" : "Username *"} hint={isFa ? "حروف انگلیسی کوچک، عدد و زیرخط" : "Lowercase letters, numbers, and underscores"}><PanelInput {...bind("username")} required minLength={3} maxLength={32} pattern="[a-z0-9_]+" dir="ltr" className="nums-en" autoComplete="username" /></FormLabel><FieldError errors={state.fieldErrors?.username} /></div>
              <FormLabel label={isFa ? "شماره موبایل" : "Mobile number"}><PanelInput value={student.mobile} readOnly disabled dir="ltr" className="nums-en" /></FormLabel>
              <div><FormLabel label={isFa ? "ایمیل (اختیاری)" : "Email (optional)"}><PanelInput {...bind("email")} type="email" dir="ltr" className="nums-en" autoComplete="email" /></FormLabel><FieldError errors={state.fieldErrors?.email} /></div>
              <div><FormLabel label={isFa ? "کد ملی (اختیاری)" : "National ID (optional)"}><PanelInput {...bind("nationalCode")} inputMode="numeric" maxLength={10} dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.nationalCode} /></div>
              <div><FormLabel label={isFa ? "تاریخ تولد *" : "Birth date *"}><PanelDatePicker {...bindValue("birthDate")} locale={locale} required max={getTehranTodayIso()} aria-label={isFa ? "تاریخ تولد" : "Birth date"} /></FormLabel><FieldError errors={state.fieldErrors?.birthDate} /></div>
              <div><FormLabel label={isFa ? "سطح تحصیلی فارسی *" : "Education level in Persian *"}><PanelInput {...bind("educationLevelFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.educationLevelFa} /></div>
              <div><FormLabel label={isFa ? "سطح تحصیلی انگلیسی (اختیاری)" : "Education level in English (optional)"}><PanelInput {...bind("educationLevelEn")} dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.educationLevelEn} /></div>
            </div>
          </PanelFormSection>

          <PanelFormSection title={isFa ? "اطلاعات خانوادگی" : "Family information"} description={isFa ? "نام و شغل والدین را به فارسی وارد کنید؛ نسخه انگلیسی اختیاری است." : "Enter parents' names and occupations in Persian; English values are optional."}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><FormLabel label={isFa ? "نام پدر فارسی *" : "Father's name in Persian *"}><PanelInput {...bind("fatherNameFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.fatherNameFa} /></div>
              <div><FormLabel label={isFa ? "نام پدر انگلیسی (اختیاری)" : "Father's name in English (optional)"}><PanelInput {...bind("fatherNameEn")} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.fatherNameEn} /></div>
              <div><FormLabel label={isFa ? "نام مادر فارسی *" : "Mother's name in Persian *"}><PanelInput {...bind("motherNameFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.motherNameFa} /></div>
              <div><FormLabel label={isFa ? "نام مادر انگلیسی (اختیاری)" : "Mother's name in English (optional)"}><PanelInput {...bind("motherNameEn")} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.motherNameEn} /></div>
              <div><FormLabel label={isFa ? "شغل پدر فارسی *" : "Father's occupation in Persian *"}><PanelInput {...bind("fatherOccupationFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.fatherOccupationFa} /></div>
              <div><FormLabel label={isFa ? "شغل پدر انگلیسی (اختیاری)" : "Father's occupation in English (optional)"}><PanelInput {...bind("fatherOccupationEn")} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.fatherOccupationEn} /></div>
              <div><FormLabel label={isFa ? "شغل مادر فارسی *" : "Mother's occupation in Persian *"}><PanelInput {...bind("motherOccupationFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.motherOccupationFa} /></div>
              <div><FormLabel label={isFa ? "شغل مادر انگلیسی (اختیاری)" : "Mother's occupation in English (optional)"}><PanelInput {...bind("motherOccupationEn")} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.motherOccupationEn} /></div>
            </div>
          </PanelFormSection>

          <PanelFormSection title={isFa ? "اطلاعات سلامتی و عملکرد" : "Health and performance"} description={isFa ? "این اطلاعات به مربیان کمک می‌کند تجربه آموزشی مناسب‌تری فراهم کنند." : "This information helps instructors provide a more suitable learning experience."}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><FormLabel label={isFa ? "وضعیت آلرژی *" : "Allergy status *"}><PanelSelect {...bind("allergyStatus")} required><option value="none">{isFa ? "ندارد" : "No allergies"}</option><option value="has_allergy">{isFa ? "دارد" : "Has allergies"}</option></PanelSelect></FormLabel><FieldError errors={state.fieldErrors?.allergyStatus} /></div>
              <div><FormLabel label={isFa ? "سطح علاقه (۱ تا ۱۰۰) *" : "Interest level (1–100) *"}><PanelInput {...bind("interestLevel")} type="number" min={1} max={100} required dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.interestLevel} /></div>
              <div><FormLabel label={isFa ? "سطح تمرکز (۱ تا ۱۰۰) *" : "Focus level (1–100) *"}><PanelInput {...bind("focusLevel")} type="number" min={1} max={100} required dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.focusLevel} /></div>
            </div>
            {values.allergyStatus === "has_allergy" ? <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div><FormLabel label={isFa ? "توضیح آلرژی فارسی *" : "Allergy details in Persian *"}><PanelTextarea {...bind("allergyDescriptionFa")} required rows={4} dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.allergyDescriptionFa} /></div>
              <div><FormLabel label={isFa ? "توضیح آلرژی انگلیسی (اختیاری)" : "Allergy details in English (optional)"}><PanelTextarea {...bind("allergyDescriptionEn")} rows={4} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.allergyDescriptionEn} /></div>
            </div> : null}
          </PanelFormSection>

          <PanelFormSection title={isFa ? "مدارک خصوصی" : "Private documents"} description={isFa ? "این فایل‌ها عمومی نیستند و فقط شما و مدیران مجاز می‌توانید آن‌ها را مشاهده کنید." : "These files are private and can only be viewed by you and authorized administrators."}>
            <div className="grid gap-5 md:grid-cols-2">
              <PrivateDocumentField kind="national_card" locale={locale} label={isFa ? "تصویر کارت ملی (اختیاری)" : "National ID image (optional)"} initialDocument={documentFor("national_card")} />
              <PrivateDocumentField kind="education_certificate" locale={locale} label={isFa ? "مدرک تحصیلی (اختیاری)" : "Education certificate (optional)"} initialDocument={documentFor("education_certificate")} />
            </div>
          </PanelFormSection>
        </div>

        <aside className="xl:sticky xl:top-6">
          <PanelFormSection title={isFa ? "تصویر پروفایل" : "Profile image"} description={isFa ? "این تصویر در بخش‌های عمومی حساب قابل نمایش است." : "This image may be shown in public account areas."}>
            <ImageUploadField name="avatarUrl" kind="avatar" locale={locale} initialValue={student.avatarUrl || ""} label={isFa ? "فایل تصویر" : "Image file"} aspect="square" layout="stacked" />
          </PanelFormSection>
        </aside>
      </div>

      <PanelFormFooter
        message={isFa ? "پس از ارسال، اطلاعات تا زمان بررسی مدیر قابل ویرایش نیست. در صورت رد شدن، دلیل نمایش داده می‌شود و می‌توانید دوباره ارسال کنید." : "After submission, the information is locked until admin review. If rejected, you will see the reason and can resubmit."}
        error={state.error}
      >
        <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? (isFa ? "در حال ارسال…" : "Submitting…") : (information ? (isFa ? "ارسال دوباره برای بررسی" : "Resubmit for review") : (isFa ? "ارسال برای بررسی" : "Submit for review"))}</button>
      </PanelFormFooter>
    </form>
  );
}
