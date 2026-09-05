"use client";
import { useState } from "react";
import {
  FormLabel,
  PanelInput,
  PanelTextarea,
} from "@/components/panel/form-controls";
import { secondaryButtonClass } from "@/components/panel/ui";
import { text } from "@/lib/workflows";
import type { CourseSections } from "@/lib/workflow-types";
import type { Locale } from "@/lib/i18n/config";
export const emptySections: CourseSections = {
  syllabus: [],
  faqs: [],
  tools: [],
  testimonials: [],
  blogIds: [],
};
export function CourseSectionsEditor({
  locale,
  initial = emptySections,
  blogs,
}: {
  locale: Locale;
  initial?: CourseSections;
  blogs: { id: string; label: string }[];
}) {
  const [value, setValue] = useState(initial);
  const sections = [
    {
      key: "syllabus" as const,
      label: text(locale, "سرفصل‌ها", "Syllabus"),
      fields: {
        titleFa: text(locale, "عنوان فارسی", "Persian title"),
        titleEn: text(locale, "عنوان انگلیسی", "English title"),
        itemsFa: text(
          locale,
          "موضوع‌ها، هر خط یک موضوع",
          "Persian topics, one per line",
        ),
        itemsEn: text(
          locale,
          "موضوع‌های انگلیسی",
          "English topics, one per line",
        ),
      },
    },
    {
      key: "faqs" as const,
      label: text(locale, "پرسش‌های متداول", "FAQs"),
      fields: {
        questionFa: text(locale, "پرسش فارسی", "Persian question"),
        questionEn: text(locale, "پرسش انگلیسی", "English question"),
        answerFa: text(locale, "پاسخ فارسی", "Persian answer"),
        answerEn: text(locale, "پاسخ انگلیسی", "English answer"),
      },
    },
    {
      key: "tools" as const,
      label: text(locale, "ابزارهای پیشنهادی", "Recommended tools"),
      fields: {
        nameFa: text(locale, "نام فارسی", "Persian name"),
        nameEn: text(locale, "نام انگلیسی", "English name"),
        url: text(locale, "پیوند", "Link"),
      },
    },
    {
      key: "testimonials" as const,
      label: text(locale, "تجربه دانش پژوهان", "Student testimonials"),
      fields: {
        name: text(locale, "نام", "Name"),
        videoUrl: text(locale, "پیوند ویدئو", "Video URL"),
      },
    },
  ];
  return (
    <div className="space-y-6 sm:col-span-2">
      <input type="hidden" name="sections" value={JSON.stringify(value)} />
      {sections.map((section) => (
        <section
          key={section.key}
          className="space-y-3 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
        >
          <h3 className="font-bold">{section.label}</h3>
          {(value[section.key] as Record<string, string>[]).map(
            (row, index) => (
              <div
                key={index}
                className="grid gap-3 border-b border-zinc-200 pb-4 sm:grid-cols-2 dark:border-zinc-800"
              >
                {Object.entries(section.fields).map(([key, label]) => (
                  <FormLabel key={key} label={label}>
                    <PanelTextarea
                      rows={2}
                      value={row[key]}
                      dir={
                        key.endsWith("En") || key.toLowerCase().includes("url")
                          ? "ltr"
                          : undefined
                      }
                      onChange={(e) =>
                        setValue({
                          ...value,
                          [section.key]: value[section.key].map((r, i) =>
                            i === index ? { ...r, [key]: e.target.value } : r,
                          ),
                        })
                      }
                    />
                  </FormLabel>
                ))}
                <button
                  type="button"
                  className={secondaryButtonClass}
                  onClick={() =>
                    setValue({
                      ...value,
                      [section.key]: value[section.key].filter(
                        (_, i) => i !== index,
                      ),
                    })
                  }
                >
                  {text(locale, "حذف ردیف", "Remove row")}
                </button>
              </div>
            ),
          )}
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={() =>
              setValue({
                ...value,
                [section.key]: [
                  ...value[section.key],
                  Object.fromEntries(
                    Object.keys(section.fields).map((k) => [k, ""]),
                  ),
                ],
              })
            }
          >
            {text(locale, "افزودن ردیف", "Add row")}
          </button>
        </section>
      ))}
      <fieldset>
        <legend className="mb-3 font-bold">
          {text(locale, "مقاله‌های مرتبط", "Related articles")}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {blogs.map((b) => (
            <label key={b.id} className="flex items-center gap-2">
              <PanelInput
                className="!size-4"
                type="checkbox"
                checked={value.blogIds.includes(b.id)}
                onChange={(e) =>
                  setValue({
                    ...value,
                    blogIds: e.target.checked
                      ? [...value.blogIds, b.id]
                      : value.blogIds.filter((id) => id !== b.id),
                  })
                }
              />
              {b.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
