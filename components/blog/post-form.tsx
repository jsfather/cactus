"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPost, type PostFormState, updatePost } from "@/app/(panel)/panel/admin/blog/actions";
import { RichTextEditor } from "@/components/content/rich-text-editor";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { FieldError, FormLabel, PanelInput, PanelSelect } from "@/components/panel/form-controls";
import { PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";

const initialState: PostFormState = {};
export type PostFormValues = { slug: string; titleFa: string; titleEn: string; coverImageUrl: string; excerptFa: string; contentFa: string; excerptEn: string; contentEn: string; status: "draft" | "published" };
const emptyValues: PostFormValues = { slug: "", titleFa: "", titleEn: "", coverImageUrl: "", excerptFa: "", contentFa: "", excerptEn: "", contentEn: "", status: "draft" };

export function PostForm({ locale, mode = "create", postId, initialValues = emptyValues }: { locale: Locale; mode?: "create" | "edit"; postId?: string; initialValues?: PostFormValues }) {
  const dictionary = getPanelDictionary(locale);
  const formAction = mode === "edit" && postId ? updatePost.bind(null, postId) : createPost;
  const [state, action, pending] = useActionState(formAction, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields(initialValues);
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <PanelFormSection title={dictionary.blog.baseInfo}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><FormLabel label={dictionary.blog.slug}><PanelInput {...bind("slug")} required dir="ltr" placeholder="robotics-for-children" className="nums-en text-start" /></FormLabel><FieldError errors={state.fieldErrors?.slug} /></div>
          <div><FormLabel label={locale === "fa" ? "عنوان فارسی" : "Persian title"}><PanelInput {...bind("titleFa")} required dir="rtl" /></FormLabel><FieldError errors={state.fieldErrors?.titleFa} /></div>
          <div dir="ltr"><FormLabel label={locale === "fa" ? "عنوان انگلیسی" : "English title"}><PanelInput {...bind("titleEn")} className="nums-en text-start" /></FormLabel><FieldError errors={state.fieldErrors?.titleEn} /></div>
          <div className="sm:col-span-2"><ImageUploadField name="coverImageUrl" kind="post" locale={locale} initialValue={initialValues.coverImageUrl} label={dictionary.blog.cover} /></div>
        </div>
      </PanelFormSection>
      <PanelFormSection title={dictionary.blog.faContent} dir="rtl">
        <div className="space-y-5"><div><FormLabel label={dictionary.blog.excerpt}><textarea {...bind("excerptFa")} required rows={3} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 dark:border-zinc-700 dark:bg-zinc-950" /></FormLabel><FieldError errors={state.fieldErrors?.excerptFa} /></div><div><span className="mb-2 block text-sm font-medium">{dictionary.blog.body}</span><RichTextEditor name="contentFa" initialValue={initialValues.contentFa} locale={locale} contentDirection="rtl" required /><FieldError errors={state.fieldErrors?.contentFa} /></div></div>
      </PanelFormSection>
      <PanelFormSection title={dictionary.blog.enContent} dir="ltr">
        <div className="space-y-5 nums-en"><div><FormLabel label={locale === "fa" ? "خلاصه انگلیسی" : "Excerpt"}><textarea {...bind("excerptEn")} rows={3} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 dark:border-zinc-700 dark:bg-zinc-950" /></FormLabel><FieldError errors={state.fieldErrors?.excerptEn} /></div><div><span className="mb-2 block text-sm font-medium">{locale === "fa" ? "متن انگلیسی نوشته" : "Post body"}</span><RichTextEditor name="contentEn" initialValue={initialValues.contentEn} locale={locale} contentDirection="ltr" /><FieldError errors={state.fieldErrors?.contentEn} /></div></div>
      </PanelFormSection>
      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
        <FormLabel label={dictionary.blog.postStatus}><PanelSelect {...bind("status")}><option value="draft">{dictionary.common.draft}</option><option value="published">{dictionary.common.published}</option></PanelSelect></FormLabel>
        <div><div className="flex flex-wrap gap-3"><Link href="/panel/admin/blog" className={secondaryButtonClass}>{dictionary.common.cancel}</Link><button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : mode === "edit" ? dictionary.common.save : dictionary.blog.savePost}</button></div>{state.error ? <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}</div>
      </section>
    </form>
  );
}
