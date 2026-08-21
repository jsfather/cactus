"use client";

import { useActionState, useState } from "react";
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
import { PublishDateTimeField } from "@/components/blog/publish-date-time-field";

const initialState: PostFormState = {};
export type PostFormValues = {
  slug: string;
  titleFa: string;
  titleEn: string;
  coverImageUrl: string;
  excerptFa: string;
  contentFa: string;
  excerptEn: string;
  contentEn: string;
  status: "draft" | "published";
  publishedAt: string;
  tags: string;
  seoTitleFa: string;
  seoTitleEn: string;
  seoDescriptionFa: string;
  seoDescriptionEn: string;
  seoImageUrl: string;
  canonicalUrl: string;
  noIndex: boolean;
};
const emptyValues: PostFormValues = {
  slug: "", titleFa: "", titleEn: "", coverImageUrl: "", excerptFa: "", contentFa: "", excerptEn: "", contentEn: "", status: "draft", publishedAt: "", tags: "", seoTitleFa: "", seoTitleEn: "", seoDescriptionFa: "", seoDescriptionEn: "", seoImageUrl: "", canonicalUrl: "", noIndex: false,
};

export function PostForm({ locale, mode = "create", postId, initialValues = emptyValues }: { locale: Locale; mode?: "create" | "edit"; postId?: string; initialValues?: PostFormValues }) {
  const dictionary = getPanelDictionary(locale);
  const formAction = mode === "edit" && postId ? updatePost.bind(null, postId) : createPost;
  const [state, action, pending] = useActionState(formAction, initialState);
  useActionErrorToast(state);
  const { noIndex: initialNoIndex, ...initialTextValues } = initialValues;
  const { bind } = usePreservedFields(initialTextValues);
  const [noIndex, setNoIndex] = useState(initialNoIndex);
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
              <div className="sm:col-span-2">
                <FormLabel label={isFa ? "برچسب‌ها" : "Tags"} hint={isFa ? "حداکثر ۱۲ برچسب را با ویرگول جدا کنید." : "Separate up to 12 tags with commas."}>
                  <PanelInput {...bind("tags")} placeholder={isFa ? "رباتیک، برنامه‌نویسی، آموزش" : "robotics, programming, education"} />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.tags} />
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

          <PanelFormSection
            title={isFa ? "متا و سئو" : "Metadata and SEO"}
            description={isFa ? "عنوان و توضیحی بنویسید که در نتایج جست‌وجو و هنگام اشتراک‌گذاری نمایش داده شود. اگر خالی باشد، عنوان و خلاصه نوشته استفاده می‌شود." : "Control how this post appears in search results and social shares. Empty fields fall back to the post title and short description."}
          >
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FormLabel label={isFa ? "عنوان سئوی فارسی" : "Persian SEO title"} hint={isFa ? "پیشنهاد: ۵۰ تا ۶۰ نویسه" : "Recommended: 50–60 characters"}>
                    <PanelInput {...bind("seoTitleFa")} maxLength={70} dir="rtl" />
                  </FormLabel>
                  <FieldError errors={state.fieldErrors?.seoTitleFa} />
                </div>
                <div>
                  <FormLabel label={isFa ? "عنوان سئوی انگلیسی" : "English SEO title"} hint={isFa ? "حداکثر ۷۰ نویسه" : "Maximum 70 characters"}>
                    <PanelInput {...bind("seoTitleEn")} maxLength={70} dir="ltr" />
                  </FormLabel>
                  <FieldError errors={state.fieldErrors?.seoTitleEn} />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FormLabel label={isFa ? "توضیح متای فارسی" : "Persian meta description"} hint={isFa ? "پیشنهاد: ۱۲۰ تا ۱۶۰ نویسه" : "Recommended: 120–160 characters"}>
                    <PanelTextarea {...bind("seoDescriptionFa")} maxLength={170} rows={4} dir="rtl" />
                  </FormLabel>
                  <FieldError errors={state.fieldErrors?.seoDescriptionFa} />
                </div>
                <div>
                  <FormLabel label={isFa ? "توضیح متای انگلیسی" : "English meta description"} hint={isFa ? "حداکثر ۱۷۰ نویسه" : "Maximum 170 characters"}>
                    <PanelTextarea {...bind("seoDescriptionEn")} maxLength={170} rows={4} dir="ltr" />
                  </FormLabel>
                  <FieldError errors={state.fieldErrors?.seoDescriptionEn} />
                </div>
              </div>
              <div>
                <FormLabel label={isFa ? "نشانی Canonical (اختیاری)" : "Canonical URL (optional)"} hint={isFa ? "فقط وقتی همین محتوا نشانی اصلی دیگری دارد وارد کنید." : "Only set this when the same content has a different primary URL."}>
                  <PanelInput {...bind("canonicalUrl")} type="url" dir="ltr" className="nums-en" placeholder="https://example.com/original-post" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.canonicalUrl} />
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
            <div className="mt-5">
              <FormLabel label={isFa ? "زمان انتشار خودکار" : "Automatic publication time"} hint={isFa ? "زمان تهران؛ اگر خالی باشد، نوشته منتشرشده فوراً نمایش داده می‌شود." : "Tehran time; leave empty to publish immediately."}>
                <PublishDateTimeField initialValue={initialValues.publishedAt} locale={locale} />
              </FormLabel>
              <FieldError errors={state.fieldErrors?.publishedAt} />
            </div>
          </PanelFormSection>
          <PanelFormSection title={isFa ? "تصویر اشتراک‌گذاری" : "Social sharing image"} description={isFa ? "برای Open Graph و شبکه‌های اجتماعی؛ در صورت خالی بودن، تصویر کاور استفاده می‌شود." : "Used by Open Graph and social networks; falls back to the cover image."}>
            <ImageUploadField name="seoImageUrl" kind="post" locale={locale} initialValue={initialValues.seoImageUrl} label={isFa ? "تصویر سئو" : "SEO image"} layout="stacked" />
            <FieldError errors={state.fieldErrors?.seoImageUrl} />
          </PanelFormSection>
          <PanelFormSection title={isFa ? "نمایه‌سازی" : "Indexing"} description={isFa ? "تنها برای محتوایی که نباید در موتورهای جست‌وجو دیده شود فعال کنید." : "Enable only for content that search engines should not list."}>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              <input type="checkbox" name="noIndex" checked={noIndex} onChange={(event) => setNoIndex(event.target.checked)} className="mt-1 size-4 accent-emerald-700" />
              <span>{isFa ? "از موتورهای جست‌وجو بخواه این نوشته را نمایه نکنند (noindex)." : "Ask search engines not to index this post (noindex)."}</span>
            </label>
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
