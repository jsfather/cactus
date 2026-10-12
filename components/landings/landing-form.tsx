import type { Locale } from "@/lib/i18n/config";
import type { landingPages } from "@/lib/db/schema";
import { saveLanding } from "@/lib/landings/actions";
import { ActionForm, type Field } from "@/components/workflows/action-form";
type Landing = typeof landingPages.$inferSelect;
export function LandingForm({
  locale,
  page,
}: {
  locale: Locale;
  page?: Landing;
}) {
  const fa = locale === "fa";
  const bilingual = (
    name: string,
    labelFa: string,
    labelEn: string,
    type?: string,
  ): Field[] =>
    ["Fa", "En"].map((lang) => ({
      name: `${name}${lang}`,
      label: `${fa ? labelFa : labelEn} (${fa ? (lang === "Fa" ? "فارسی" : "انگلیسی") : lang === "Fa" ? "Persian" : "English"})`,
      type,
      dir: lang === "Fa" ? "rtl" : "ltr",
      required: name === "title" && lang === "Fa",
    }));
  const fields: Field[] = [
    {
      name: "slug",
      label: fa
        ? "نشانی مستقل صفحه: example.com/slug"
        : "Root address: example.com/slug",
      dir: "ltr",
      required: true,
      hint: fa
        ? "حروف کوچک انگلیسی، عدد و خط تیره؛ نشانی‌های اصلی سایت رزرو شده‌اند."
        : "Lowercase Latin letters, digits and hyphens; built-in routes are reserved.",
    },
    ...bilingual("title", "عنوان", "Title"),
    ...bilingual("summary", "توضیح و سئو", "Summary & SEO", "textarea"),
    ...bilingual(
      "content",
      "محتوای قبل از بنر",
      "Content before banner",
      "rich",
    ),
    ...bilingual("cta-title", "عنوان بنر دعوت به اقدام", "CTA heading"),
    ...bilingual("cta-text", "متن بنر", "CTA text", "textarea"),
    ...bilingual("cta-label", "متن دکمه بنر", "CTA button label"),
    {
      name: "cta-href",
      label: fa ? "پیوند دکمه بنر" : "CTA button link",
      dir: "ltr",
      hint: fa
        ? "با خالی گذاشتن پیوند، بنر نمایش داده نمی‌شود."
        : "Leave empty to hide the banner.",
    },
    ...bilingual(
      "afterCta",
      "ادامه محتوا بعد از بنر",
      "Content after banner",
      "rich",
    ),
    {
      name: "coverImageUrl",
      label: fa ? "تصویر شاخص" : "Featured image",
      type: "image",
    },
    {
      name: "videoUrl",
      label: fa
        ? "ویدیو (بارگذاری یا لینک مستقیم)"
        : "Video (upload or direct link)",
      type: "video",
    },
    {
      name: "commentsEnabled",
      label: fa ? "دیدگاه کاربران" : "User comments",
      options: [
        {
          value: "true",
          label: fa ? "فعال؛ با تأیید مدیر" : "Enabled; moderated",
        },
        { value: "false", label: fa ? "غیرفعال" : "Disabled" },
      ],
    },
    {
      name: "status",
      label: fa ? "انتشار" : "Publication",
      options: [
        { value: "draft", label: fa ? "پیش‌نویس" : "Draft" },
        { value: "published", label: fa ? "منتشرشده" : "Published" },
      ],
    },
  ];
  const initial: Record<string, string> = {
    status: "draft",
    commentsEnabled: "true",
    ...Object.fromEntries(
      page
        ? Object.entries(page).filter(([, value]) => typeof value === "string")
        : [],
    ),
    ...(page ? { commentsEnabled: String(page.commentsEnabled) } : {}),
    ...Object.fromEntries(
      [
        "titleFa",
        "titleEn",
        "textFa",
        "textEn",
        "labelFa",
        "labelEn",
        "href",
      ].map((key) => [
        `cta-${key}`,
        page?.cta[key as keyof Landing["cta"]] ?? "",
      ]),
    ),
  };
  const sidebar = ["coverImageUrl", "videoUrl", "commentsEnabled", "status"];
  return (
    <ActionForm
      locale={locale}
      action={saveLanding.bind(null, page?.id ?? null)}
      initial={initial}
      fields={fields}
      sections={[
        {
          title: fa ? "هویت و محتوای صفحه" : "Page identity & content",
          fields: [
            "slug",
            "titleFa",
            "titleEn",
            "summaryFa",
            "summaryEn",
            "contentFa",
            "contentEn",
          ],
        },
        {
          title: fa ? "بنر میان محتوا" : "Mid-content banner",
          fields: fields
            .filter((f) => f.name.startsWith("cta-"))
            .map((f) => f.name),
        },
        {
          title: fa ? "ادامه محتوا" : "More content",
          fields: ["afterCtaFa", "afterCtaEn"],
        },
        {
          title: fa ? "رسانه و انتشار" : "Media & publication",
          fields: sidebar,
          sidebar: true,
        },
      ]}
    />
  );
}
