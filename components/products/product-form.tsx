"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createProduct, type ProductFormState, updateProduct } from "@/app/(panel)/panel/admin/products/actions";
import { RichTextEditor } from "@/components/content/rich-text-editor";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { FieldError, FormLabel, PanelInput, PanelSelect, PanelTextarea } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";

const initialState: ProductFormState = {};
export type ProductFormValues = {
  slug: string; titleFa: string; titleEn: string; summaryFa: string; summaryEn: string;
  contentFa: string; contentEn: string; coverImageUrl: string; price: string; inventory: string;
  status: "draft" | "published"; isFeatured: boolean;
  categoryIds: string[];
};
const emptyValues: ProductFormValues = { slug: "", titleFa: "", titleEn: "", summaryFa: "", summaryEn: "", contentFa: "", contentEn: "", coverImageUrl: "", price: "", inventory: "0", status: "draft", isFeatured: false, categoryIds: [] };

export function ProductForm({ locale, mode = "create", productId, initialValues = emptyValues, categories = [] }: { locale: Locale; mode?: "create" | "edit"; productId?: string; initialValues?: ProductFormValues; categories?: Array<{ id: string; titleFa: string; titleEn: string | null }> }) {
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
  const [categoryIds, setCategoryIds] = useState(initialValues.categoryIds);
  const isFa = locale === "fa";

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="categoryIds" value={JSON.stringify(categoryIds)} />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          <PanelFormSection
            title={dictionary.shop.baseInfo}
            description={isFa ? "عنوان‌ها، نشانی، قیمت و موجودی محصول را وارد کنید." : "Add the product titles, URL, price, and inventory."}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormLabel label={dictionary.shop.slug} hint={isFa ? "فقط از حروف انگلیسی، عدد و خط تیره استفاده کنید." : "Use English letters, numbers, and hyphens only."}>
                  <PanelInput {...bind("slug")} required dir="ltr" className="nums-en" placeholder="starter-robotics-kit" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.slug} />
              </div>
              <div>
                <FormLabel label={isFa ? "عنوان فارسی" : "Persian title"}>
                  <PanelInput {...bind("titleFa")} required dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.titleFa} />
              </div>
              <div>
                <FormLabel label={isFa ? "عنوان انگلیسی" : "English title"}>
                  <PanelInput {...bind("titleEn")} dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.titleEn} />
              </div>
              <div>
                <FormLabel label={dictionary.shop.price}>
                  <PanelInput {...bind("price")} required type="number" min="0" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.price} />
              </div>
              <div>
                <FormLabel label={dictionary.shop.inventory}>
                  <PanelInput {...bind("inventory")} required type="number" min="0" dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.inventory} />
              </div>
            </div>
          </PanelFormSection>

          <PanelFormSection
            title={dictionary.shop.faContent}
            description={isFa ? "معرفی اصلی فارسی محصول را تکمیل کنید." : "Complete the primary Persian product description."}
          >
            <div className="space-y-5">
              <div>
                <FormLabel label={dictionary.shop.summary}>
                  <PanelTextarea {...bind("summaryFa")} required rows={3} dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.summaryFa} />
              </div>
              <div>
                <p className="mb-2 text-start text-sm font-medium text-zinc-900 dark:text-zinc-100">{dictionary.shop.body}</p>
                <RichTextEditor name="contentFa" initialValue={initialValues.contentFa} locale={locale} contentDirection="rtl" required />
                <FieldError errors={state.fieldErrors?.contentFa} />
              </div>
            </div>
          </PanelFormSection>

          <PanelFormSection
            title={dictionary.shop.enContent}
            description={isFa ? "در صورت نیاز معرفی انگلیسی محصول را اضافه کنید." : "Optionally add the English product description."}
          >
            <div className="space-y-5">
              <div>
                <FormLabel label={isFa ? "خلاصه انگلیسی" : "English summary"}>
                  <PanelTextarea {...bind("summaryEn")} rows={3} dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.summaryEn} />
              </div>
              <div>
                <p className="mb-2 text-start text-sm font-medium text-zinc-900 dark:text-zinc-100">{isFa ? "توضیحات کامل انگلیسی" : "Full English description"}</p>
                <RichTextEditor name="contentEn" initialValue={initialValues.contentEn} locale={locale} contentDirection="ltr" />
                <FieldError errors={state.fieldErrors?.contentEn} />
              </div>
            </div>
          </PanelFormSection>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6">
          <PanelFormSection title={dictionary.shop.cover} description={isFa ? "تصویر افقی و واضح محصول را انتخاب کنید." : "Choose a clear landscape product image."}>
            <ImageUploadField name="coverImageUrl" kind="product" locale={locale} initialValue={initialValues.coverImageUrl} label={dictionary.shop.cover} layout="stacked" />
          </PanelFormSection>

          <PanelFormSection title={isFa ? "انتشار و نمایش" : "Publishing and display"} description={isFa ? "وضعیت انتشار و جایگاه محصول را مشخص کنید." : "Set the product's publishing status and placement."}>
            <div className="space-y-5">
              <FormLabel label={dictionary.shop.productStatus}>
                <PanelSelect {...bind("status")}>
                  <option value="draft">{dictionary.common.draft}</option>
                  <option value="published">{dictionary.common.published}</option>
                </PanelSelect>
              </FormLabel>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 text-start transition hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-emerald-800">
                <input type="checkbox" name="isFeatured" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-emerald-700" />
                <span>
                  <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">{dictionary.shop.featured}</span>
                  <span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">{dictionary.shop.featuredHint}</span>
                </span>
              </label>
            </div>
          </PanelFormSection>

          <PanelFormSection title={isFa ? "دسته‌بندی‌ها" : "Categories"} description={isFa ? "محصول می‌تواند در چند دسته قرار بگیرد." : "A product can belong to multiple categories."}>
            {categories.length ? (
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 p-3 text-start transition hover:border-emerald-300 dark:border-zinc-800 dark:hover:border-emerald-800">
                    <input
                      type="checkbox"
                      checked={categoryIds.includes(category.id)}
                      onChange={(event) => setCategoryIds((current) => event.target.checked ? [...current, category.id] : current.filter((id) => id !== category.id))}
                      className="size-4 accent-emerald-700"
                    />
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{locale === "en" ? category.titleEn || category.titleFa : category.titleFa}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-zinc-500">{isFa ? "هنوز دسته‌ای ساخته نشده است." : "No categories have been created yet."}</p>
            )}
          </PanelFormSection>
        </aside>
      </div>

      <PanelFormFooter message={dictionary.shop.description} error={state.error}>
        <Link href="/panel/admin/products" className={secondaryButtonClass}>{dictionary.common.cancel}</Link>
        <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : mode === "edit" ? dictionary.common.save : dictionary.shop.saveProduct}</button>
      </PanelFormFooter>
    </form>
  );
}
