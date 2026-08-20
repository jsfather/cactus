"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPost, type PostFormState, updatePost } from "@/app/(panel)/panel/admin/blog/actions";
import { RichTextEditor } from "@/components/content/rich-text-editor";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { FieldError, FormLabel, PanelInput, PanelSelect, PanelTextarea } from "@/components/panel/form-controls";
import { PanelFormFooter, PanelFormSection, primaryButtonClass, secondaryButtonClass } from "@/components/panel/ui";
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
  const isFa = locale === "fa";

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          <PanelFormSection
            title={dictionary.blog.baseInfo}
            description={isFa ? "عنوان‌ها و نشانی یکتای نوشته را وارد کنید." : "Add the post titles and its unique URL."}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormLabel label={dictionary.blog.slug} hint={isFa ? "فقط از حروف انگلیسی، عدد و خط تیره استفاده کنید." : "Use English letters, numbers, and hyphens only."}>
                  <PanelInput {...bind("slug")} required dir="ltr" placeholder="robotics-for-children" className="nums-en" />
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
            </div>
          </PanelFormSection>

          <PanelFormSection
            title={dictionary.blog.faContent}
            description={isFa ? "نسخه اصلی فارسی نوشته را تکمیل کنید." : "Complete the primary Persian version of this post."}
          >
            <div className="space-y-5">
              <div>
                <FormLabel label={dictionary.blog.excerpt}>
                  <PanelTextarea {...bind("excerptFa")} required rows={3} dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.excerptFa} />
              </div>
              <div>
                <p className="mb-2 text-start text-sm font-medium text-zinc-900 dark:text-zinc-100">{dictionary.blog.body}</p>
                <RichTextEditor name="contentFa" initialValue={initialValues.contentFa} locale={locale} contentDirection="rtl" required />
                <FieldError errors={state.fieldErrors?.contentFa} />
              </div>
            </div>
          </PanelFormSection>

          <PanelFormSection
            title={dictionary.blog.enContent}
            description={isFa ? "در صورت نیاز نسخه انگلیسی همین نوشته را اضافه کنید." : "Optionally add the English version of this post."}
          >
            <div className="space-y-5">
              <div>
                <FormLabel label={isFa ? "خلاصه انگلیسی" : "English excerpt"}>
                  <PanelTextarea {...bind("excerptEn")} rows={3} dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.excerptEn} />
              </div>
              <div>
                <p className="mb-2 text-start text-sm font-medium text-zinc-900 dark:text-zinc-100">{isFa ? "متن انگلیسی نوشته" : "English post body"}</p>
                <RichTextEditor name="contentEn" initialValue={initialValues.contentEn} locale={locale} contentDirection="ltr" />
                <FieldError errors={state.fieldErrors?.contentEn} />
              </div>
            </div>
          </PanelFormSection>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6">
          <PanelFormSection
            title={dictionary.blog.cover}
            description={isFa ? "تصویر افقی با کیفیت برای کارت و صفحه نوشته انتخاب کنید." : "Choose a clear landscape image for the post card and page."}
          >
            <ImageUploadField name="coverImageUrl" kind="post" locale={locale} initialValue={initialValues.coverImageUrl} label={dictionary.blog.cover} layout="stacked" />
          </PanelFormSection>
          <PanelFormSection
            title={dictionary.blog.postStatus}
            description={isFa ? "زمان نمایش نوشته در سایت عمومی را کنترل کنید." : "Control when this post appears on the public site."}
          >
            <FormLabel label={dictionary.blog.postStatus}>
              <PanelSelect {...bind("status")}>
                <option value="draft">{dictionary.common.draft}</option>
                <option value="published">{dictionary.common.published}</option>
              </PanelSelect>
            </FormLabel>
          </PanelFormSection>
        </aside>
      </div>

      <PanelFormFooter
        message={isFa ? "پیش از ذخیره، عنوان‌ها، محتوا و وضعیت انتشار را بررسی کنید." : "Review the titles, content, and publishing status before saving."}
        error={state.error}
      >
        <Link href="/panel/admin/blog" className={secondaryButtonClass}>{dictionary.common.cancel}</Link>
        <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? dictionary.common.saving : mode === "edit" ? dictionary.common.save : dictionary.blog.savePost}</button>
      </PanelFormFooter>
    </form>
  );
}
