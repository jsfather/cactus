"use client";

import { useActionState } from "react";
import {
  createPost,
  type CreatePostState,
} from "@/app/(panel)/panel/admin/blog/actions";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";

const initialState: CreatePostState = {};

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.length ? (
    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[0]}</p>
  ) : null;
}

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

const selectClass =
  "w-full appearance-none rounded-xl border border-zinc-300 bg-white py-3 ps-4 pe-10 text-zinc-950 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

const initialValues = {
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

export function PostForm() {
  const [state, action, pending] = useActionState(createPost, initialState);
  const { bind } = usePreservedFields(initialValues);

  return (
    <form action={action} className="space-y-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
          اطلاعات پایه
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium">نشانی نوشته</span>
            <input
              {...bind("slug")}
              required
              dir="ltr"
              placeholder="robotics-for-children"
              className={`${inputClass} nums-en text-start`}
            />
            <FieldError errors={state.fieldErrors?.slug} />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">عنوان فارسی</span>
            <input {...bind("titleFa")} required className={inputClass} />
            <FieldError errors={state.fieldErrors?.titleFa} />
          </label>

          <label className="block" dir="ltr">
            <span className="mb-2 block text-sm font-medium">English title</span>
            <input
              {...bind("titleEn")}
              className={`${inputClass} nums-en text-start`}
            />
            <FieldError errors={state.fieldErrors?.titleEn} />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium">نشانی تصویر کاور</span>
            <input
              {...bind("coverImageUrl")}
              type="url"
              dir="ltr"
              placeholder="https://…"
              className={`${inputClass} nums-en text-start`}
            />
            <FieldError errors={state.fieldErrors?.coverImageUrl} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
          محتوای فارسی
        </h2>
        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">خلاصه</span>
            <textarea
              {...bind("excerptFa")}
              required
              rows={3}
              className={inputClass}
            />
            <FieldError errors={state.fieldErrors?.excerptFa} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">متن نوشته</span>
            <textarea
              {...bind("contentFa")}
              required
              rows={12}
              className={inputClass}
            />
            <FieldError errors={state.fieldErrors?.contentFa} />
          </label>
        </div>
      </section>

      <section
        dir="ltr"
        className="rounded-2xl border border-zinc-200 bg-white p-6 text-start dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
          English content (optional)
        </h2>
        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Excerpt</span>
            <textarea
              {...bind("excerptEn")}
              rows={3}
              className={`${inputClass} nums-en`}
            />
            <FieldError errors={state.fieldErrors?.excerptEn} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Post body</span>
            <textarea
              {...bind("contentEn")}
              rows={12}
              className={`${inputClass} nums-en`}
            />
            <FieldError errors={state.fieldErrors?.contentEn} />
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">وضعیت نوشته</span>
          <span className="relative block">
            <select {...bind("status")} className={selectClass}>
              <option value="draft">پیش‌نویس</option>
              <option value="published">انتشار عمومی</option>
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
            >
              <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </label>

        <div className="sm:text-end">
          {state.error ? (
            <p role="alert" className="mb-3 text-sm text-red-600 dark:text-red-400">
              {state.error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
          >
            {pending ? "در حال ذخیره…" : "ذخیره نوشته"}
          </button>
        </div>
      </section>
    </form>
  );
}
