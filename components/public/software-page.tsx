/* eslint-disable @next/next/no-img-element -- Validated managed media. */
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  getPublishedSoftware,
  getSoftwareMetadata,
} from "@/lib/resources/software-queries";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { text, title } from "@/lib/workflows";
import { RichContent } from "@/components/content/rich-content";
import { richTextToPlainText } from "@/lib/content/rich-text";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PublicIcon } from "./icons";
import { Arrow } from "./design";

export async function SoftwarePage({
  id,
  locale,
}: {
  id: string;
  locale: Locale;
}) {
  await connection();
  const item = await getPublishedSoftware(id);
  if (!item) notFound();
  const meta = await getSoftwareMetadata(id);
  const local = (fa: string | null, en: string | null) =>
    (locale === "en" ? en || fa : fa) || "";
  const specs = [
    [text(locale, "نسخه پیشنهادی", "Recommended version"), item.version],
    [text(locale, "سیستم‌عامل", "Platforms"), item.platforms],
    [text(locale, "توسعه‌دهنده", "Developer"), meta.developer],
    [text(locale, "مجوز", "License"), local(meta.licenseFa, meta.licenseEn)],
    [text(locale, "حجم دانلود", "Download size"), meta.downloadSize],
  ].filter(([, value]) => value);
  return (
    <div className="public-site public-detail">
      <SiteHeader locale={locale} currentPath={`/requirements/${id}`} />
      <main id="public-main" className="public-wrap software-detail">
        <Link
          className="public-link"
          href={localizePath(locale, "/requirements")}
        >
          {text(locale, "همه نرم‌افزارها", "All software")}
          <Arrow />
        </Link>
        <div className="software-detail-grid">
          <div className="software-detail-copy">
            <p className="public-kicker">
              {local(item.categoryFa, item.categoryEn)}
            </p>
            <h1 dir={locale === "en" && !item.titleEn ? "rtl" : undefined}>
              {title(item, locale)}
            </h1>
            <p className="public-description">
              {local(meta.summaryFa, meta.summaryEn) ||
                richTextToPlainText(
                  local(item.contentFa, item.contentEn),
                ).slice(0, 220)}
            </p>
            <dl className="software-specs">
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd dir="auto">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="software-download-panel">
            <div className="software-visual">
              {meta.imageUrl ? (
                <img src={meta.imageUrl} alt="" />
              ) : (
                <PublicIcon name="software" />
              )}
            </div>
            {item.attachmentUrl ? (
              <a
                className="public-button"
                href={item.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text(locale, "دانلود نرم‌افزار", "Download software")}
                <Arrow />
              </a>
            ) : (
              <p>
                {text(
                  locale,
                  "پیوند دانلود هنوز ثبت نشده است.",
                  "A download link is not available yet.",
                )}
              </p>
            )}
            {item.documentationUrl && (
              <a
                className="public-link"
                href={item.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text(locale, "مستندات رسمی", "Official documentation")}
                <Arrow />
              </a>
            )}
            <p className="software-note">
              {text(
                locale,
                "پیش از نصب، نسخه و سیستم مورد نیاز را بررسی کنید. دانلود ممکن است به وب‌سایت ارائه‌دهنده هدایت شود.",
                "Check the version and system requirements before installing. Downloads may open the provider’s website.",
              )}
            </p>
          </aside>
        </div>
        <article className="software-content">
          <h2>
            {text(
              locale,
              "معرفی و راهنمای نصب",
              "Overview & installation guide",
            )}
          </h2>
          <RichContent
            html={local(item.contentFa, item.contentEn)}
            dir={locale === "en" && !item.contentEn ? "rtl" : undefined}
          />
        </article>
        {local(meta.requirementsFa, meta.requirementsEn) && (
          <section className="software-content">
            <h2>{text(locale, "سیستم مورد نیاز", "System requirements")}</h2>
            <p className="whitespace-pre-line">
              {local(meta.requirementsFa, meta.requirementsEn)}
            </p>
          </section>
        )}
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
