"use client";
/* eslint-disable @next/next/no-img-element */

import { useActionState } from "react";
import { updateMediaAsset, type MediaFormState } from "@/app/(panel)/panel/admin/media/actions";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { FieldError, FormLabel, PanelInput } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";

const initialState: MediaFormState = {};

export function MediaEditForm({ locale, asset }: { locale: Locale; asset: { id: string; url: string; originalName: string; altFa: string | null; altEn: string | null } }) {
  const dictionary = getPanelDictionary(locale);
  const [state, action, pending] = useActionState(updateMediaAsset.bind(null, asset.id), initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({ originalName: asset.originalName, altFa: asset.altFa || "", altEn: asset.altEn || "" });

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <PanelFormSection title={dictionary.media.file}>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"><img src={asset.url} alt={locale === "fa" ? asset.altFa || "" : asset.altEn || ""} className="mx-auto max-h-[32rem] rounded-xl object-contain" /></div>
        </PanelFormSection>
        <aside className="xl:sticky xl:top-6"><PanelFormSection title={locale === "fa" ? "اطلاعات رسانه" : "Media details"}><div className="space-y-5"><div><FormLabel label={dictionary.media.originalName}><PanelInput {...bind("originalName")} required dir="auto" /></FormLabel><FieldError errors={state.fieldErrors?.originalName} /></div><div><FormLabel label={dictionary.media.altFa}><PanelInput {...bind("altFa")} dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.altFa} /></div><div><FormLabel label={dictionary.media.altEn}><PanelInput {...bind("altEn")} dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.altEn} /></div></div></PanelFormSection></aside>
      </div>
      <PanelFormFooter message={dictionary.media.description} error={state.error}><button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : dictionary.common.save}</button></PanelFormFooter>
    </form>
  );
}
