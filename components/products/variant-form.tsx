"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createVariant, updateVariant, type VariantFormState } from "@/app/(panel)/panel/admin/products/[id]/variants/actions";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { FieldError, FormLabel, PanelInput } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";

const initialState: VariantFormState = {};
const empty = { sku: "", titleFa: "", titleEn: "", price: "", inventory: "0", isActive: true };
export function VariantForm({ locale, productId, variantId, initialValues = empty }: { locale: Locale; productId: string; variantId?: string; initialValues?: typeof empty }) {
  const dictionary = getPanelDictionary(locale); const [active, setActive] = useState(initialValues.isActive);
  const [state, action, pending] = useActionState(variantId ? updateVariant.bind(null, productId, variantId) : createVariant.bind(null, productId), initialState); useActionErrorToast(state);
  const { bind } = usePreservedFields({ sku: initialValues.sku, titleFa: initialValues.titleFa, titleEn: initialValues.titleEn, price: initialValues.price, inventory: initialValues.inventory });
  return <form action={action} className="space-y-6"><input type="hidden" name="locale" value={locale} />
    <PanelFormSection title={locale === "fa" ? "اطلاعات تنوع محصول" : "Product variant information"} description={locale === "fa" ? "قیمت را خالی بگذارید تا قیمت پایه محصول استفاده شود." : "Leave price empty to inherit the product base price."}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><FormLabel label="SKU"><PanelInput {...bind("sku")} required dir="ltr" className="nums-en uppercase" /></FormLabel><FieldError errors={state.fieldErrors?.sku} /></div>
        <div><FormLabel label={locale === "fa" ? "عنوان فارسی" : "Persian title"}><PanelInput {...bind("titleFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.titleFa} /></div>
        <div><FormLabel label={locale === "fa" ? "عنوان انگلیسی" : "English title"}><PanelInput {...bind("titleEn")} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.titleEn} /></div>
        <div><FormLabel label={locale === "fa" ? "قیمت اختصاصی (تومان)" : "Override price (Toman)"}><PanelInput {...bind("price")} type="number" min="0" dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.price} /></div>
        <div><FormLabel label={dictionary.shop.inventory}><PanelInput {...bind("inventory")} type="number" min="0" required dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.inventory} /></div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 p-4 sm:col-span-2 dark:border-zinc-800"><input type="checkbox" name="isActive" checked={active} onChange={(event) => setActive(event.target.checked)} className="size-4 accent-emerald-700" /><span className="text-sm font-medium">{locale === "fa" ? "این تنوع فعال باشد" : "Keep this variant active"}</span></label>
      </div>
    </PanelFormSection>
    <PanelFormFooter error={state.error} message={locale === "fa" ? "موجودی هر تنوع مستقل از موجودی پایه محصول نگهداری می‌شود." : "Each variant keeps inventory independently from the base product."}><Link href={`/panel/admin/products/${productId}/edit`} className={secondaryButtonClass}>{dictionary.common.cancel}</Link><button disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : dictionary.common.save}</button></PanelFormFooter>
  </form>;
}
