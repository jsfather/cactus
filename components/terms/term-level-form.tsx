"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createTermLevel, updateTermLevel, type TermLevelFormState } from "@/app/(panel)/panel/admin/term-levels/actions";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { FieldError, FormLabel, PanelInput, PanelTextarea } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

const initialState: TermLevelFormState = {};
const empty = { titleFa: "", titleEn: "", descriptionFa: "", descriptionEn: "" };

export function TermLevelForm({ locale, levelId, initialValues = empty }: { locale: Locale; levelId?: string; initialValues?: typeof empty }) {
  const [state, action, pending] = useActionState(levelId ? updateTermLevel.bind(null, levelId) : createTermLevel, initialState);
  const { bind } = usePreservedFields(initialValues);
  useActionErrorToast(state);
  const isFa = locale === "fa";
  return <form action={action} className="space-y-6">
    <input type="hidden" name="locale" value={locale} />
    <PanelFormSection title={isFa ? "اطلاعات سطح" : "Level information"} description={isFa ? "سطح‌ها مستقل از ترم‌ها هستند و می‌توانید آن‌ها را در چند ترم استفاده کنید. ترتیب نمایش به‌صورت خودکار مدیریت می‌شود." : "Levels are reusable across terms. Their display order is managed automatically."}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><FormLabel label={isFa ? "عنوان فارسی" : "Persian title"}><PanelInput {...bind("titleFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.titleFa} /></div>
        <div><FormLabel label={isFa ? "عنوان انگلیسی" : "English title"}><PanelInput {...bind("titleEn")} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.titleEn} /></div>
        <div><FormLabel label={isFa ? "توضیح فارسی" : "Persian description"}><PanelTextarea {...bind("descriptionFa")} rows={4} dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.descriptionFa} /></div>
        <div><FormLabel label={isFa ? "توضیح انگلیسی" : "English description"}><PanelTextarea {...bind("descriptionEn")} rows={4} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.descriptionEn} /></div>
      </div>
    </PanelFormSection>
    <PanelFormFooter error={state.error} message={isFa ? "سطح‌های استفاده‌شده در ترم قابل حذف نیستند، اما همچنان قابل ویرایش‌اند." : "Levels used by terms cannot be deleted, but they remain editable."}>
      <Link href="/panel/admin/term-levels" className={secondaryButtonClass}>{isFa ? "انصراف" : "Cancel"}</Link>
      <button disabled={pending} className={primaryButtonClass}>{pending ? (isFa ? "در حال ذخیره…" : "Saving…") : (isFa ? "ذخیره سطح" : "Save level")}</button>
    </PanelFormFooter>
  </form>;
}
