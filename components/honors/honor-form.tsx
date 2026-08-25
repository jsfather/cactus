"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createHonor, updateHonor, type HonorFormState } from "@/app/(panel)/panel/admin/honors/actions";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { PanelDatePicker } from "@/components/panel/date-time-picker";
import { FieldError, FormLabel, PanelInput, PanelSelect, PanelTextarea } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import { getTehranTodayIso } from "@/lib/date/local";

export type HonorFormValues = {
  slug: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  descriptionEn: string;
  organizationFa: string;
  organizationEn: string;
  locationFa: string;
  locationEn: string;
  categoriesFa: string;
  categoriesEn: string;
  certificateImageUrl: string;
  issuedAt: string;
  status: "draft" | "published";
};

const emptyValues: HonorFormValues = { slug: "", titleFa: "", titleEn: "", descriptionFa: "", descriptionEn: "", organizationFa: "", organizationEn: "", locationFa: "", locationEn: "", categoriesFa: "", categoriesEn: "", certificateImageUrl: "", issuedAt: "", status: "draft" };
const initialState: HonorFormState = {};

export function HonorForm({ locale, mode = "create", honorId, initialValues = emptyValues }: { locale: Locale; mode?: "create" | "edit"; honorId?: string; initialValues?: HonorFormValues }) {
  const isFa = locale === "fa";
  const formAction = mode === "edit" && honorId ? updateHonor.bind(null, honorId) : createHonor;
  const [state, action, pending] = useActionState(formAction, initialState);
  useActionErrorToast(state);
  const { certificateImageUrl, ...textValues } = initialValues;
  const { bind, bindValue } = usePreservedFields(textValues);

  return <form action={action} className="space-y-6">
    <input type="hidden" name="locale" value={locale} />
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="min-w-0 space-y-6">
        <PanelFormSection title={isFa ? "اطلاعات پایه" : "Basic information"} description={isFa ? "نشانی عمومی و اطلاعات مشترک گواهینامه را وارد کنید." : "Add the public URL and shared certificate information."}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><FormLabel label={isFa ? "نشانی عمومی *" : "Public URL *"} hint={isFa ? "فقط حروف انگلیسی کوچک، عدد و خط تیره" : "Lowercase letters, numbers, and hyphens only"}><PanelInput {...bind("slug")} required dir="ltr" className="nums-en" placeholder="national-robotics-award-2025" /></FormLabel><FieldError errors={state.fieldErrors?.slug} /></div>
            <div><FormLabel label={isFa ? "نام سازمان فارسی *" : "Organization in Persian *"}><PanelInput {...bind("organizationFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.organizationFa} /></div>
            <div><FormLabel label={isFa ? "نام سازمان انگلیسی (اختیاری)" : "Organization in English (optional)"}><PanelInput {...bind("organizationEn")} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.organizationEn} /></div>
            <div><FormLabel label={isFa ? "مکان فارسی *" : "Location in Persian *"}><PanelInput {...bind("locationFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.locationFa} /></div>
            <div><FormLabel label={isFa ? "مکان انگلیسی (اختیاری)" : "Location in English (optional)"}><PanelInput {...bind("locationEn")} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.locationEn} /></div>
          </div>
        </PanelFormSection>

        <PanelFormSection title={isFa ? "محتوای فارسی" : "Persian content"} description={isFa ? "نسخه اصلی فارسی برای نمایش در سایت عمومی الزامی است." : "The primary Persian version is required for the public website."}>
          <div className="space-y-5">
            <div><FormLabel label={isFa ? "عنوان فارسی *" : "Persian title *"}><PanelInput {...bind("titleFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.titleFa} /></div>
            <div><FormLabel label={isFa ? "توضیحات فارسی *" : "Persian description *"}><PanelTextarea {...bind("descriptionFa")} required rows={7} dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.descriptionFa} /></div>
            <div><FormLabel label={isFa ? "دسته‌بندی‌های فارسی *" : "Persian categories *"} hint={isFa ? "حداکثر ۱۲ مورد را با ویرگول جدا کنید." : "Separate up to 12 items with commas."}><PanelInput {...bind("categoriesFa")} required dir="rtl" placeholder="رباتیک، مسابقات، پژوهش" /></FormLabel><FieldError errors={state.fieldErrors?.categoriesFa} /></div>
          </div>
        </PanelFormSection>

        <PanelFormSection title={isFa ? "محتوای انگلیسی (اختیاری)" : "English content (optional)"} description={isFa ? "برای نمایش ترجمه‌شده در نسخه انگلیسی سایت تکمیل کنید." : "Complete these fields for a translated English presentation."}>
          <div className="space-y-5">
            <div><FormLabel label={isFa ? "عنوان انگلیسی" : "English title"}><PanelInput {...bind("titleEn")} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.titleEn} /></div>
            <div><FormLabel label={isFa ? "توضیحات انگلیسی" : "English description"}><PanelTextarea {...bind("descriptionEn")} rows={7} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.descriptionEn} /></div>
            <div><FormLabel label={isFa ? "دسته‌بندی‌های انگلیسی" : "English categories"} hint={isFa ? "موارد را با ویرگول انگلیسی جدا کنید." : "Separate items with commas."}><PanelInput {...bind("categoriesEn")} dir="ltr" placeholder="Robotics, Competition, Research" /></FormLabel><FieldError errors={state.fieldErrors?.categoriesEn} /></div>
          </div>
        </PanelFormSection>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-6">
        <PanelFormSection title={isFa ? "تصویر گواهینامه" : "Certificate image"} description={isFa ? "تصویر واضح و با کیفیتی انتخاب کنید؛ این تصویر در کارت و صفحه جزئیات نمایش داده می‌شود." : "Choose a clear, high-quality image for the card and detail page."}>
          <ImageUploadField name="certificateImageUrl" kind="content" locale={locale} initialValue={certificateImageUrl} label={isFa ? "فایل تصویر *" : "Image file *"} layout="stacked" />
          <FieldError errors={state.fieldErrors?.certificateImageUrl} />
        </PanelFormSection>
        <PanelFormSection title={isFa ? "تاریخ و انتشار" : "Date and publishing"} description={isFa ? "فقط موارد منتشرشده در سایت عمومی دیده می‌شوند." : "Only published items appear on the public website."}>
          <div className="space-y-5">
            <div><FormLabel label={isFa ? "تاریخ صدور *" : "Issue date *"}><PanelDatePicker {...bindValue("issuedAt")} locale={locale} required max={getTehranTodayIso()} aria-label={isFa ? "تاریخ صدور" : "Issue date"} /></FormLabel><FieldError errors={state.fieldErrors?.issuedAt} /></div>
            <div><FormLabel label={isFa ? "وضعیت انتشار" : "Publication status"}><PanelSelect {...bind("status")}><option value="draft">{isFa ? "پیش‌نویس" : "Draft"}</option><option value="published">{isFa ? "منتشرشده" : "Published"}</option></PanelSelect></FormLabel><FieldError errors={state.fieldErrors?.status} /></div>
          </div>
        </PanelFormSection>
      </aside>
    </div>
    <PanelFormFooter error={state.error} message={isFa ? "اطلاعات خصوصی یا شماره‌های قابل سوءاستفاده را داخل تصویر گواهینامه قرار ندهید." : "Do not publish private identifiers or sensitive numbers in certificate images."}>
      <Link href="/panel/admin/honors" className={secondaryButtonClass}>{isFa ? "انصراف" : "Cancel"}</Link>
      <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? (isFa ? "در حال ذخیره…" : "Saving…") : mode === "edit" ? (isFa ? "ذخیره تغییرات" : "Save changes") : (isFa ? "ساخت افتخار یا گواهینامه" : "Create honor or certificate")}</button>
    </PanelFormFooter>
  </form>;
}
