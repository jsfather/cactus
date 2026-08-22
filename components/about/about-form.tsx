"use client";

import { useActionState, useEffect } from "react";
import { updateSiteContent, type AboutFormState } from "@/app/(panel)/panel/admin/about/actions";
import { RichTextEditor } from "@/components/content/rich-text-editor";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { FieldError, FormLabel, PanelInput, PanelTextarea } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";

const initialState: AboutFormState = {};
type Values = { contactNumber: string; email: string; addressFa: string; addressEn: string; aboutUsFa: string; aboutUsEn: string; missionFa: string; missionEn: string; visionFa: string; visionEn: string; footerTextFa: string; footerTextEn: string };
export function AboutForm({ locale, initialValues }: { locale: Locale; initialValues: Values }) {
  const dictionary = getPanelDictionary(locale); const [state, action, pending] = useActionState(updateSiteContent, initialState); useActionErrorToast(state); const { toast } = useFeedback();
  useEffect(() => { if (state.success) toast.success(state.success); }, [state.success, toast]);
  const { bind } = usePreservedFields({ contactNumber: initialValues.contactNumber, email: initialValues.email, addressFa: initialValues.addressFa, addressEn: initialValues.addressEn, footerTextFa: initialValues.footerTextFa, footerTextEn: initialValues.footerTextEn });
  return <form action={action} className="space-y-6"><input type="hidden" name="locale" value={locale} />
    <PanelFormSection title={locale === "fa" ? "اطلاعات تماس" : "Contact information"}><div className="grid gap-5 sm:grid-cols-2"><div><FormLabel label={locale === "fa" ? "شماره تماس" : "Phone"}><PanelInput {...bind("contactNumber")} dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.contactNumber} /></div><div><FormLabel label="Email"><PanelInput {...bind("email")} type="email" dir="ltr" className="nums-en" /></FormLabel><FieldError errors={state.fieldErrors?.email} /></div><div><FormLabel label={locale === "fa" ? "نشانی فارسی" : "Persian address"}><PanelTextarea {...bind("addressFa")} rows={3} dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.addressFa} /></div><div><FormLabel label={locale === "fa" ? "نشانی انگلیسی" : "English address"}><PanelTextarea {...bind("addressEn")} rows={3} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.addressEn} /></div></div></PanelFormSection>
    <RichSection title={locale === "fa" ? "درباره ما" : "About us"} locale={locale} faName="aboutUsFa" enName="aboutUsEn" faValue={initialValues.aboutUsFa} enValue={initialValues.aboutUsEn} faErrors={state.fieldErrors?.aboutUsFa} enErrors={state.fieldErrors?.aboutUsEn} />
    <RichSection title={locale === "fa" ? "ماموریت ما" : "Our mission"} locale={locale} faName="missionFa" enName="missionEn" faValue={initialValues.missionFa} enValue={initialValues.missionEn} faErrors={state.fieldErrors?.missionFa} enErrors={state.fieldErrors?.missionEn} />
    <RichSection title={locale === "fa" ? "چشم‌انداز ما" : "Our vision"} locale={locale} faName="visionFa" enName="visionEn" faValue={initialValues.visionFa} enValue={initialValues.visionEn} faErrors={state.fieldErrors?.visionFa} enErrors={state.fieldErrors?.visionEn} />
    <PanelFormSection title={locale === "fa" ? "متن کپی‌رایت فوتر" : "Footer copyright text"}><div className="grid gap-5 sm:grid-cols-2"><div><FormLabel label={locale === "fa" ? "متن فارسی" : "Persian text"}><PanelTextarea {...bind("footerTextFa")} required rows={3} dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.footerTextFa} /></div><div><FormLabel label={locale === "fa" ? "متن انگلیسی" : "English text"}><PanelTextarea {...bind("footerTextEn")} rows={3} dir="ltr" /></FormLabel><FieldError errors={state.fieldErrors?.footerTextEn} /></div></div></PanelFormSection>
    <PanelFormFooter error={state.error} message={locale === "fa" ? "این اطلاعات در صفحه درباره ما و فوتر عمومی نمایش داده می‌شود." : "This content appears on the public About page and website footer."}><button disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : dictionary.common.save}</button></PanelFormFooter>
  </form>;
}
function RichSection({ title, locale, faName, enName, faValue, enValue, faErrors, enErrors }: { title: string; locale: Locale; faName: string; enName: string; faValue: string; enValue: string; faErrors?: string[]; enErrors?: string[] }) { return <PanelFormSection title={title}><div className="grid gap-6 xl:grid-cols-2"><div><p className="mb-2 text-sm font-medium">{locale === "fa" ? "محتوای فارسی" : "Persian content"}</p><RichTextEditor name={faName} initialValue={faValue} locale={locale} contentDirection="rtl" required /><FieldError errors={faErrors} /></div><div><p className="mb-2 text-sm font-medium">{locale === "fa" ? "محتوای انگلیسی" : "English content"}</p><RichTextEditor name={enName} initialValue={enValue} locale={locale} contentDirection="ltr" /><FieldError errors={enErrors} /></div></div></PanelFormSection>; }
