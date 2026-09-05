"use client";
import { AttachmentField } from "./attachment-field";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { FieldError, FormLabel, PanelInput, PanelSelect, PanelTextarea } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, PanelTableActionButton, PanelDeleteIcon, primaryButtonClass } from "@/components/panel/ui";
import { RichTextEditor } from "@/components/content/rich-text-editor";
import { ImageUploadField } from "@/components/media/image-upload-field";
import type { Locale } from "@/lib/i18n/config";
import { text, type ActionState } from "@/lib/workflows";
export type Field = { name: string; label: string; type?: string; required?: boolean; hint?: string; options?: { value: string; label: string }[]; min?: number; max?: number };
export function ActionForm({ locale, action, fields, initial = {}, heading, submitLabel, children }: { locale: Locale; action: (state: ActionState, data: FormData) => Promise<ActionState>; fields: Field[]; initial?: Record<string, string>; heading?: string; submitLabel?: string; children?: React.ReactNode }) {
  const [state, submit, pending] = useActionState(action, {});
  const { bind } = usePreservedFields(Object.fromEntries(fields.map(f => [f.name, initial[f.name] ?? f.options?.[0]?.value ?? ""])));
  const { toast } = useFeedback(); const last = useRef(state);
  useActionErrorToast(state);
  useEffect(() => { if (state !== last.current && state.success) toast.success(state.success); last.current = state; }, [state, toast]);
  return <form action={submit} className="space-y-5"><input type="hidden" name="locale" value={locale}/><PanelFormSection title={heading ?? text(locale, "اطلاعات", "Details")}><div className="grid gap-5 sm:grid-cols-2">{fields.map(f => <div key={f.name} className={["rich", "textarea", "image"].includes(f.type ?? "") ? "sm:col-span-2" : ""}>
    {f.name === "attachmentUrl" ? <AttachmentField name={f.name} label={f.label} locale={locale} initialValue={initial[f.name]}/> : f.type === "rich" ? <><p className="mb-2 text-sm font-medium">{f.label}</p><RichTextEditor name={f.name} locale={locale} initialValue={initial[f.name] ?? ""} contentDirection={f.name.endsWith("En") ? "ltr" : "rtl"} required={f.required}/></> : f.type === "image" ? <ImageUploadField name={f.name} locale={locale} kind="content" initialValue={initial[f.name]} label={f.label}/> : <FormLabel label={f.label} hint={f.hint}>{f.options ? <PanelSelect {...bind(f.name)} required={f.required}>{f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</PanelSelect> : f.type === "textarea" ? <PanelTextarea {...bind(f.name)} rows={4} required={f.required} dir={f.name.endsWith("En") ? "ltr" : undefined}/> : <PanelInput {...bind(f.name)} type={f.type ?? "text"} required={f.required} min={f.min} max={f.max} dir={f.name.endsWith("En") || ["url", "number", "datetime-local", "date"].includes(f.type ?? "") ? "ltr" : undefined}/>}</FormLabel>}
    <FieldError errors={state.fieldErrors?.[f.name]}/></div>)}{children}</div></PanelFormSection><PanelFormFooter error={state.error}><button className={primaryButtonClass} disabled={pending}>{pending ? text(locale,"در حال ذخیره…","Saving…") : submitLabel ?? text(locale,"ذخیره","Save")}</button></PanelFormFooter></form>;
}
export function DeleteAction({ locale, action }: { locale: Locale; action: () => Promise<ActionState> }) {
  const { confirm, toast } = useFeedback(); const [pending, start] = useTransition();
  return <PanelTableActionButton tone="danger" label={text(locale,"حذف","Delete")} disabled={pending} onClick={async () => { if (await confirm({title:text(locale,"حذف این مورد؟","Delete this item?"),description:text(locale,"این عملیات قابل بازگشت نیست.","This action cannot be undone."),confirmLabel:text(locale,"حذف","Delete")})) start(async () => { const result = await action(); if(result.error) toast.error(result.error); else if(result.success) toast.success(result.success); }); }}><PanelDeleteIcon/></PanelTableActionButton>;
}
export function ActionButton({ locale, action, label }: { locale: Locale; action: () => Promise<ActionState>; label: string }) {
 const {toast}=useFeedback();const[pending,start]=useTransition();return <button className={primaryButtonClass} disabled={pending} onClick={()=>start(async()=>{try{const r=await action();if(r.error)toast.error(r.error);else if(r.success)toast.success(r.success);}catch{toast.error(text(locale,"عملیات انجام نشد.","The action could not be completed."));}})}>{label}</button>;
}
