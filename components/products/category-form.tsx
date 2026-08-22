"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createCategory, updateCategory, type CategoryFormState } from "@/app/(panel)/panel/admin/product-categories/actions";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { FieldError, FormLabel, PanelInput, PanelTextarea } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";

const initialState: CategoryFormState = {};
const empty = { slug: "", titleFa: "", titleEn: "", descriptionFa: "", descriptionEn: "" };

export function CategoryForm({ locale, categoryId, initialValues = empty }: { locale: Locale; categoryId?: string; initialValues?: typeof empty }) {
  const dictionary = getPanelDictionary(locale);
  const [state, action, pending] = useActionState(categoryId ? updateCategory.bind(null, categoryId) : createCategory, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields(initialValues);
  return <form action={action} className="space-y-6">
    <input type="hidden" name="locale" value={locale} />
    <PanelFormSection title={locale === "fa" ? "اطلاعات دسته" : "Category information"} description={locale === "fa" ? "دسته‌ها برای گروه‌بندی و فیلتر محصولات استفاده می‌شوند." : "Categories organize products and support future filtering."}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><FormLabel label={locale === "fa" ? "نشانی دسته" : "Category URL"}><PanelInput {...bind("slug")} required dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.slug} /></div>
        <div><FormLabel label={locale === "fa" ? "عنوان فارسی" : "Persian title"}><PanelInput {...bind("titleFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.titleFa} /></div>
        <div><FormLabel label={locale === "fa" ? "عنوان انگلیسی" : "English title"}><PanelInput {...bind("titleEn")} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.titleEn} /></div>
        <div><FormLabel label={locale === "fa" ? "توضیح فارسی" : "Persian description"}><PanelTextarea {...bind("descriptionFa")} rows={4} dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.descriptionFa} /></div>
        <div><FormLabel label={locale === "fa" ? "توضیح انگلیسی" : "English description"}><PanelTextarea {...bind("descriptionEn")} rows={4} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.descriptionEn} /></div>
      </div>
    </PanelFormSection>
    <PanelFormFooter error={state.error} message={locale === "fa" ? "پس از ذخیره می‌توانید این دسته را به چند محصول متصل کنید." : "After saving, this category can be assigned to multiple products."}>
      <Link href="/panel/admin/product-categories" className={secondaryButtonClass}>{dictionary.common.cancel}</Link>
      <button disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : dictionary.common.save}</button>
    </PanelFormFooter>
  </form>;
}
