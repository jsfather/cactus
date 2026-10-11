"use client";
import { useContext, useState } from "react";
import { FormLabel, PanelInput, FieldError } from "./form-controls";
import {
  PanelFormSection,
  PanelTableActionButton,
  PanelDeleteIcon,
  secondaryButtonClass,
} from "./ui";
import { ActionFormFieldErrors } from "@/components/workflows/action-form";
import type { NavigationLink } from "@/lib/site-content/navigation";
import type { Locale } from "@/lib/i18n/config";

export function NavigationEditor({
  name,
  initial,
  locale,
}: {
  name: "headerLinks" | "footerLinks";
  initial: NavigationLink[];
  locale: Locale;
}) {
  const [links, setLinks] = useState(initial);
  const errors = useContext(ActionFormFieldErrors);
  const fa = locale === "fa";
  const limit = name === "headerLinks" ? 10 : 16;
  function move(index: number, offset: number) {
    setLinks((current) => {
      const next = [...current];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });
  }
  function update(index: number, key: keyof NavigationLink, value: string) {
    setLinks((current) =>
      current.map((link, i) =>
        i === index ? { ...link, [key]: value } : link,
      ),
    );
  }
  return (
    <PanelFormSection
      title={
        name === "headerLinks"
          ? fa
            ? "منوی هدر"
            : "Header navigation"
          : fa
            ? "پیوندهای فوتر"
            : "Footer links"
      }
      description={
        fa
          ? "پیوندهای داخلی بدون /en وارد شوند؛ زبان مسیر خودکار تنظیم می‌شود. ترتیب ردیف‌ها، ترتیب نمایش است."
          : "Enter internal paths without /en; locale is applied automatically. Rows appear in this order."
      }
    >
      <input type="hidden" name={name} value={JSON.stringify(links)} />
      <div className="space-y-4">
        {links.map((link, index) => (
          <div
            key={index}
            className="grid items-end gap-3 rounded-xl border border-zinc-200 p-4 sm:grid-cols-[1fr_1fr_1fr_auto] dark:border-zinc-800"
          >
            <FormLabel label={fa ? "عنوان فارسی" : "Persian label"}>
              <PanelInput
                dir="rtl"
                value={link.labelFa}
                onChange={(e) => update(index, "labelFa", e.target.value)}
                maxLength={80}
              />
            </FormLabel>
            <FormLabel label={fa ? "عنوان انگلیسی" : "English label"}>
              <PanelInput
                dir="ltr"
                value={link.labelEn}
                onChange={(e) => update(index, "labelEn", e.target.value)}
                maxLength={80}
              />
            </FormLabel>
            <FormLabel label={fa ? "مسیر یا پیوند" : "Path or URL"}>
              <PanelInput
                dir="ltr"
                className="nums-en"
                value={link.href}
                onChange={(e) => update(index, "href", e.target.value)}
              />
            </FormLabel>
            <div className="flex gap-1">
              <PanelTableActionButton
                label={fa ? "انتقال به بالا" : "Move up"}
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <span aria-hidden="true">↑</span>
              </PanelTableActionButton>
              <PanelTableActionButton
                label={fa ? "انتقال به پایین" : "Move down"}
                disabled={index === links.length - 1}
                onClick={() => move(index, 1)}
              >
                <span aria-hidden="true">↓</span>
              </PanelTableActionButton>
              <PanelTableActionButton
                label={fa ? "حذف پیوند" : "Remove link"}
                tone="danger"
                onClick={() => setLinks(links.filter((_, i) => i !== index))}
              >
                <PanelDeleteIcon />
              </PanelTableActionButton>
            </div>
          </div>
        ))}
      </div>
      <FieldError errors={errors?.[name]} />
      <button
        type="button"
        className={`${secondaryButtonClass} mt-4`}
        disabled={links.length >= limit}
        onClick={() =>
          setLinks([...links, { labelFa: "", labelEn: "", href: "" }])
        }
      >
        {fa ? "افزودن پیوند" : "Add link"}
      </button>
    </PanelFormSection>
  );
}
