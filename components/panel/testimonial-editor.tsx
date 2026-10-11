"use client";
import { useContext, useState } from "react";
import { FormLabel, PanelInput, FieldError } from "./form-controls";
import {
  PanelFormSection,
  secondaryButtonClass,
  PanelTableActionButton,
  PanelDeleteIcon,
} from "./ui";
import { ImageUploadField } from "@/components/media/image-upload-field";
import { ActionFormFieldErrors } from "@/components/workflows/action-form";
import type { Testimonial } from "@/lib/site-content/presentation";
import type { Locale } from "@/lib/i18n/config";

export function TestimonialEditor({
  initial,
  locale,
}: {
  initial: Testimonial[];
  locale: Locale;
}) {
  const [items, setItems] = useState(() =>
    initial.map((item, index) => ({ ...item, editorId: `initial-${index}` })),
  );
  const errors = useContext(ActionFormFieldErrors);
  const fa = locale === "fa";
  function update(
    index: number,
    key: keyof Testimonial,
    value: string | number,
  ) {
    setItems((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    );
  }
  const fields = [
    ["nameFa", "نام دانش‌پژوه فارسی", "Persian student name"],
    ["nameEn", "نام دانش‌پژوه انگلیسی", "English student name"],
    ["termFa", "نام ترم فارسی", "Persian term name"],
    ["termEn", "نام ترم انگلیسی", "English term name"],
    ["achievementFa", "مقام / دستاورد فارسی", "Persian achievement"],
    ["achievementEn", "مقام / دستاورد انگلیسی", "English achievement"],
    ["videoUrl", "پیوند ویدیوی رضایت", "Testimonial video URL"],
  ] as const;
  return (
    <PanelFormSection
      title={fa ? "کارت‌های رضایت دانش‌پژوهان" : "Student testimonial cards"}
      description={
        fa
          ? "فقط اطلاعات واقعی و تأییدشده وارد کنید. درصد خالی در سایت نمایش داده نمی‌شود."
          : "Use verified information only. Empty satisfaction scores are not displayed."
      }
    >
      <input type="hidden" name="testimonials" value={JSON.stringify(items)} />
      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            className="space-y-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            key={item.editorId}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {fa ? "دانش‌پژوه" : "Student"}{" "}
                {(index + 1).toLocaleString(locale)}
              </h3>
              <PanelTableActionButton
                tone="danger"
                label={fa ? "حذف کارت" : "Remove card"}
                onClick={() => setItems(items.filter((_, i) => i !== index))}
              >
                <PanelDeleteIcon />
              </PanelTableActionButton>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(([key, labelFa, labelEn]) => (
                <FormLabel key={key} label={fa ? labelFa : labelEn}>
                  <PanelInput
                    dir={key.endsWith("Fa") ? "rtl" : "ltr"}
                    value={item[key]}
                    type={key === "videoUrl" ? "url" : "text"}
                    onChange={(e) => update(index, key, e.target.value)}
                  />
                </FormLabel>
              ))}
              {(["studentSatisfaction", "parentSatisfaction"] as const).map(
                (key) => (
                  <FormLabel
                    key={key}
                    label={
                      key === "studentSatisfaction"
                        ? fa
                          ? "رضایت دانش‌پژوه (%)"
                          : "Student satisfaction (%)"
                        : fa
                          ? "رضایت والدین (%)"
                          : "Parent satisfaction (%)"
                    }
                  >
                    <PanelInput
                      dir="ltr"
                      type="number"
                      min={0}
                      max={100}
                      value={item[key]}
                      onChange={(e) =>
                        update(
                          index,
                          key,
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    />
                  </FormLabel>
                ),
              )}
            </div>
            <ImageUploadField
              name={`testimonial-image-${index}`}
              kind="content"
              locale={locale}
              initialValue={item.imageUrl}
              label={fa ? "تصویر دانش‌پژوه" : "Student image"}
              onChange={(value) => update(index, "imageUrl", value)}
            />
          </div>
        ))}
      </div>
      <FieldError errors={errors?.testimonials} />
      <button
        type="button"
        className={`${secondaryButtonClass} mt-4`}
        disabled={items.length >= 12}
        onClick={() =>
          setItems([
            ...items,
            {
              editorId: crypto.randomUUID(),
              nameFa: "",
              nameEn: "",
              termFa: "",
              termEn: "",
              achievementFa: "",
              achievementEn: "",
              imageUrl: "",
              videoUrl: "",
              studentSatisfaction: "",
              parentSatisfaction: "",
            },
          ])
        }
      >
        {fa ? "افزودن دانش‌پژوه" : "Add student"}
      </button>
    </PanelFormSection>
  );
}
