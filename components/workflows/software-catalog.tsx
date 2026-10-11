"use client";
/* eslint-disable @next/next/no-img-element -- Validated managed media. */
import Link from "next/link";
import { localizePath } from "@/lib/i18n/config";
import { Arrow } from "@/components/public/design";
import { PublicIcon } from "@/components/public/icons";
import type { SoftwareMetadata } from "@/lib/resources/software";
import { useState } from "react";
import {
  FormLabel,
  PanelInput,
  PanelSelect,
} from "@/components/panel/form-controls";
import {
  primaryButtonClass,
  secondaryButtonClass,
  PanelEmptyState,
} from "@/components/panel/ui";
import { text, title } from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
type Software = SoftwareMetadata & {
  id: string;
  titleFa: string;
  titleEn: string | null;
  contentFa: string;
  contentEn: string | null;
  categoryFa: string | null;
  categoryEn: string | null;
  platforms: string | null;
  version: string | null;
  attachmentUrl: string | null;
  documentationUrl: string | null;
};
export function SoftwareCatalog({
  locale,
  items,
}: {
  locale: Locale;
  items: Software[];
}) {
  const [q, setQ] = useState("");
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const categories = [
    ...new Set(
      items
        .map((i) =>
          locale === "en" ? i.categoryEn || i.categoryFa : i.categoryFa,
        )
        .filter(Boolean),
    ),
  ];
  const filtered = items.filter(
    (i) =>
      title(i, locale).toLowerCase().includes(q.toLowerCase()) &&
      (!platform ||
        i.platforms
          ?.split(",")
          .map((p) => p.trim())
          .includes(platform)) &&
      (!category ||
        (locale === "en" ? i.categoryEn || i.categoryFa : i.categoryFa) ===
          category),
  );
  return (
    <div className="space-y-6">
      <div className="software-filters grid gap-4 p-5 sm:grid-cols-3">
        <FormLabel
          label={text(locale, "جست‌وجوی نرم‌افزار", "Search software")}
        >
          <PanelInput value={q} onChange={(e) => setQ(e.target.value)} />
        </FormLabel>
        <FormLabel label={text(locale, "سیستم‌عامل", "Platform")}>
          <PanelSelect
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="">{text(locale, "همه", "All")}</option>
            {[
              ...new Set(
                items.flatMap(
                  (i) =>
                    i.platforms
                      ?.split(",")
                      .map((p) => p.trim())
                      .filter(Boolean) ?? [],
                ),
              ),
            ].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </PanelSelect>
        </FormLabel>
        <FormLabel label={text(locale, "دسته", "Category")}>
          <PanelSelect
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">{text(locale, "همه", "All")}</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </PanelSelect>
        </FormLabel>
      </div>
      <div className="software-grid grid items-start gap-5 sm:grid-cols-2">
        {filtered.map((i) => (
          <article key={i.id} className="software-card">
            <Link
              className="software-visual"
              href={localizePath(locale, `/requirements/${i.id}`)}
              aria-label={title(i, locale)}
            >
              {i.imageUrl ? (
                <img src={i.imageUrl} alt="" loading="lazy" />
              ) : (
                <PublicIcon name="software" />
              )}
            </Link>
            <div className="software-copy">
              <h2
                className="text-lg font-bold"
                dir={locale === "en" && !i.titleEn ? "rtl" : undefined}
              >
                <Link href={localizePath(locale, `/requirements/${i.id}`)}>
                  {title(i, locale)}
                </Link>
              </h2>
              <span className="mt-2 block text-xs font-normal text-zinc-500">
                {i.platforms}
              </span>
              <div className="mt-5 space-y-5">
                {i.version && (
                  <p className="text-sm text-zinc-500">
                    {text(locale, "نسخه پیشنهادی", "Recommended version")}:{" "}
                    {i.version}
                  </p>
                )}
                <p
                  className="software-summary"
                  dir={locale === "en" && !i.summaryEn ? "rtl" : undefined}
                >
                  {locale === "en" ? i.summaryEn || i.summaryFa : i.summaryFa}
                </p>
                <Link
                  className="public-link"
                  href={localizePath(locale, `/requirements/${i.id}`)}
                >
                  {text(locale, "مشخصات و راهنما", "Details & guide")}
                  <Arrow />
                </Link>
                <div className="flex flex-wrap gap-3">
                  {i.attachmentUrl && (
                    <a
                      href={i.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={primaryButtonClass}
                    >
                      {text(locale, "دانلود رسمی", "Official download")}
                    </a>
                  )}
                  {i.documentationUrl && (
                    <a
                      href={i.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={secondaryButtonClass}
                    >
                      {text(
                        locale,
                        "راهنمای نصب و استفاده",
                        "Installation & documentation",
                      )}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <PanelEmptyState
          title={text(locale, "نرم‌افزاری پیدا نشد", "No software found")}
          description=""
        />
      )}
    </div>
  );
}
