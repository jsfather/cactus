"use client";

import { useActionState } from "react";
import {
  createPost,
  type PostFormState,
  updatePost,
} from "@/app/(panel)/panel/admin/blog/actions";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { FieldError, FormLabel, PanelSelect } from "@/components/panel/form-controls";
import {
  PanelFormSection,
  panelInputClass,
  primaryButtonClass,
} from "@/components/panel/ui";

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
};

const emptyValues: PostFormValues = {
  slug: "",
  titleFa: "",
  titleEn: "",
  coverImageUrl: "",
  excerptFa: "",
  contentFa: "",
  excerptEn: "",
  contentEn: "",
  status: "draft",
};

export function PostForm({
  mode = "create",
  postId,
  initialValues = emptyValues,
}: {
  mode?: "create" | "edit";
  postId?: string;
  initialValues?: PostFormValues;
}) {
  const formAction =
    mode === "edit" && postId ? updatePost.bind(null, postId) : createPost;
  const [state, action, pending] = useActionState(formAction, initialState);
  const { bind } = usePreservedFields(initialValues);

  return (
    <form action={action} className="space-y-8">
      <PanelFormSection title="اطلاعات پایه">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormLabel label="نشانی نوشته">
            <input
              {...bind("slug")}
              required
              dir="ltr"
              placeholder="robotics-for-children"
              className={`${panelInputClass} nums-en text-start`}
            />
            </FormLabel>
            <FieldError errors={state.fieldErrors?.slug} />
          </div>

          <div>
            <FormLabel label="عنوان فارسی">
              <input {...bind("titleFa")} required className={panelInputClass} />
            </FormLabel>
            <FieldError errors={state.fieldErrors?.titleFa} />
          </div>

          <div dir="ltr">
            <FormLabel label="English title">
              <input
                {...bind("titleEn")}
                className={`${panelInputClass} nums-en text-start`}
              />
            </FormLabel>
            <FieldError errors={state.fieldErrors?.titleEn} />
          </div>

          <div className="sm:col-span-2">
            <FormLabel label="نشانی تصویر کاور">
            <input
              {...bind("coverImageUrl")}
              type="url"
              dir="ltr"
              placeholder="https://…"
              className={`${panelInputClass} nums-en text-start`}
            />
            </FormLabel>
            <FieldError errors={state.fieldErrors?.coverImageUrl} />
          </div>
        </div>
      </PanelFormSection>

      <PanelFormSection title="محتوای فارسی">
        <div className="space-y-5">
          <div>
            <FormLabel label="خلاصه">
            <textarea
              {...bind("excerptFa")}
              required
              rows={3}
              className={panelInputClass}
            />
            </FormLabel>
            <FieldError errors={state.fieldErrors?.excerptFa} />
          </div>
          <div>
            <FormLabel label="متن نوشته">
            <textarea
              {...bind("contentFa")}
              required
              rows={12}
              className={panelInputClass}
            />
            </FormLabel>
            <FieldError errors={state.fieldErrors?.contentFa} />
          </div>
        </div>
      </PanelFormSection>

      <PanelFormSection title="English content (optional)" dir="ltr">
        <div className="space-y-5">
          <div>
            <FormLabel label="Excerpt">
            <textarea
              {...bind("excerptEn")}
              rows={3}
              className={`${panelInputClass} nums-en`}
            />
            </FormLabel>
            <FieldError errors={state.fieldErrors?.excerptEn} />
          </div>
          <div>
            <FormLabel label="Post body">
            <textarea
              {...bind("contentEn")}
              rows={12}
              className={`${panelInputClass} nums-en`}
            />
            </FormLabel>
            <FieldError errors={state.fieldErrors?.contentEn} />
          </div>
        </div>
      </PanelFormSection>

      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
        <FormLabel label="وضعیت نوشته">
            <PanelSelect {...bind("status")}>
              <option value="draft">پیش‌نویس</option>
              <option value="published">انتشار عمومی</option>
            </PanelSelect>
        </FormLabel>

        <div className="sm:text-end">
          {state.error ? (
            <p role="alert" className="mb-3 text-sm text-red-600 dark:text-red-400">
              {state.error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className={primaryButtonClass}
          >
            {pending
              ? "در حال ذخیره…"
              : mode === "edit"
                ? "ذخیره تغییرات"
                : "ذخیره نوشته"}
          </button>
        </div>
      </section>
    </form>
  );
}
