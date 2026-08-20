"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createProduct, type ProductFormState, updateProduct } from "@/app/(panel)/panel/admin/products/actions";
import { RichTextEditor } from "@/components/content/rich-text-editor";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { FieldError, FormLabel, PanelInput, PanelSelect } from "@/components/panel/form-controls";
import { PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";

const initialState: ProductFormState = {};
export type ProductFormValues = {
  slug: string; titleFa: string; titleEn: string; summaryFa: string; summaryEn: string;
  contentFa: string; contentEn: string; coverImageUrl: string; price: string; inventory: string;
  status: "draft" | "published"; isFeatured: boolean;
};
const emptyValues: ProductFormValues = { slug: "", titleFa: "", titleEn: "", summaryFa: "", summaryEn: "", contentFa: "", contentEn: "", coverImageUrl: "", price: "", inventory: "0", status: "draft", isFeatured: false };

export function ProductForm({ locale, mode = "create", productId, initialValues = emptyValues }: { locale: Locale; mode?: "create" | "edit"; productId?: string; initialValues?: ProductFormValues }) {
  const dictionary = getPanelDictionary(locale);
  const formAction = mode === "edit" && productId ? updateProduct.bind(null, productId) : createProduct;
  const [state, action, pending] = useActionState(formAction, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({
    slug: initialValues.slug,
    titleFa: initialValues.titleFa,
    titleEn: initialValues.titleEn,
    summaryFa: initialValues.summaryFa,
    summaryEn: initialValues.summaryEn,
    price: initialValues.price,
    inventory: initialValues.inventory,
    status: initialValues.status,
  });
  const [featured, setFeatured] = useState(initialValues.isFeatured);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <PanelFormSection title={dictionary.shop.baseInfo}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><FormLabel label={dictionary.shop.slug}><PanelInput {...bind("slug")} required dir="ltr" className="nums-en text-start" placeholder="starter-robotics-kit" /></FormLabel><FieldError errors={state.fieldErrors?.slug} /></div>
          <div><FormLabel label={locale === "fa" ? "عنوان فارسی" : "Persian title"}><PanelInput {...bind("titleFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.titleFa} /></div>
          <div dir="ltr"><FormLabel label={locale === "fa" ? "عنوان انگلیسی" : "English title"}><PanelInput {...bind("titleEn")} className="nums-en text-start" /></FormLabel><FieldError errors={state.fieldErrors?.titleEn} /></div>
          <div><FormLabel label={dictionary.shop.price}><PanelInput {...bind("price")} required type="number" min="0" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.price} /></div>
          <div><FormLabel label={dictionary.shop.inventory}><PanelInput {...bind("inventory")} required type="number" min="0" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.inventory} /></div>
          <div className="sm:col-span-2"><ImageUploadField name="coverImageUrl" kind="product" locale={locale} initialValue={initialValues.coverImageUrl} label={dictionary.shop.cover} /></div>
          <label className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 sm:col-span-2 dark:border-zinc-800"><input type="checkbox" name="isFeatured" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="mt-1 size-4 accent-emerald-700" /><span><span className="block text-sm font-medium">{dictionary.shop.featured}</span><span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">{dictionary.shop.featuredHint}</span></span></label>
        </div>
      </PanelFormSection>

      <PanelFormSection title={dictionary.shop.faContent} dir="rtl">
        <div className="space-y-5"><div><FormLabel label={dictionary.shop.summary}><textarea {...bind("summaryFa")} required rows={3} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 dark:border-zinc-700 dark:bg-zinc-950" /></FormLabel><FieldError errors={state.fieldErrors?.summaryFa} /></div><div><span className="mb-2 block text-sm font-medium">{dictionary.shop.body}</span><RichTextEditor name="contentFa" initialValue={initialValues.contentFa} locale={locale} contentDirection="rtl" required /><FieldError errors={state.fieldErrors?.contentFa} /></div></div>
      </PanelFormSection>
      <PanelFormSection title={dictionary.shop.enContent} dir="ltr">
        <div className="space-y-5 nums-en"><div><FormLabel label={locale === "fa" ? "خلاصه انگلیسی" : "Summary"}><textarea {...bind("summaryEn")} rows={3} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 dark:border-zinc-700 dark:bg-zinc-950" /></FormLabel><FieldError errors={state.fieldErrors?.summaryEn} /></div><div><span className="mb-2 block text-sm font-medium">{locale === "fa" ? "توضیحات کامل انگلیسی" : "Full description"}</span><RichTextEditor name="contentEn" initialValue={initialValues.contentEn} locale={locale} contentDirection="ltr" /><FieldError errors={state.fieldErrors?.contentEn} /></div></div>
      </PanelFormSection>

      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
        <FormLabel label={dictionary.shop.productStatus}><PanelSelect {...bind("status")}><option value="draft">{dictionary.common.draft}</option><option value="published">{dictionary.common.published}</option></PanelSelect></FormLabel>
        <div><div className="flex flex-wrap gap-3"><Link href="/panel/admin/products" className={secondaryButtonClass}>{dictionary.common.cancel}</Link><button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : mode === "edit" ? dictionary.common.save : dictionary.shop.saveProduct}</button></div>{state.error ? <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}</div>
      </section>
    </form>
  );
}
