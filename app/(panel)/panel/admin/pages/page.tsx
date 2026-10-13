import { VideoGalleryEditor } from "@/components/panel/video-gallery-editor";
import { TestimonialEditor } from "@/components/panel/testimonial-editor";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getSiteContent } from "@/lib/site-content/queries";
import { getPresentation } from "@/lib/site-content/presentation";
import { savePresentation } from "@/lib/site-content/actions";
import { ActionForm, type Field } from "@/components/workflows/action-form";
import { PanelPage, PanelPageHeader, PanelPrimaryLink } from "@/components/panel/ui";
export default async function StaticPages() {
  await requireRole("admin", "content");
  const [locale, content] = await Promise.all([getPanelLocale(), getSiteContent()]);
  const fa = locale === "fa";
  const presentation = getPresentation(content.presentation);
  const headings = [["heroEyebrow", "شعار هیرو", "Hero overline"], ["whyTitle", "عنوان چرا کاکتوس", "Why Cactus heading"], ["aboutTitle", "عنوان درباره", "About heading"], ["coursesTitle", "عنوان دوره‌ها", "Courses heading"], ["productsTitle", "عنوان محصولات", "Products heading"], ["testimonialsTitle", "عنوان رضایت‌ها", "Testimonials heading"], ["newsTitle", "عنوان اخبار", "News heading"], ["footerTagline", "شعار فوتر", "Footer tagline"]];
  const fields: Field[] = [
    ...headings.flatMap(([key, labelFa, labelEn]) => [{name: `${key}Fa`, label: fa ? `${labelFa} فارسی` : `Persian ${labelEn}`}, {name: `${key}En`, label: fa ? `${labelFa} انگلیسی` : `English ${labelEn}`}]),
    ...[ ["heroTitle", "عنوان هیرو", "Hero title"], ["heroDescription", "توضیحات هیرو", "Hero description"] ].flatMap(([key, labelFa, labelEn]) => [ { name: `${key}Fa`, label: fa ? `${labelFa} فارسی` : `Persian ${labelEn}`, type: "textarea" }, { name: `${key}En`, label: fa ? `${labelFa} انگلیسی` : `English ${labelEn}`, type: "textarea" } ]),
    { name: "heroVideoUrl", label: fa ? "ویدیو هیرو (لینک مستقیم ویدیو)" : "Hero video (direct video URL)", type: "url" },
    { name: "heroImageUrl", label: fa ? "عکس جایگزین هیرو" : "Hero poster", type: "image" },
    { name: "whyContentFa", label: fa ? "چرا کاکتوس؟ فارسی" : "Why Cactus? Persian", type: "rich" },
    { name: "whyContentEn", label: fa ? "چرا کاکتوس؟ انگلیسی" : "Why Cactus? English", type: "rich" },
    ...[["bannerTitle", "عنوان بنر تبرستان", "Tabarestan banner title"], ["bannerText", "متن بنر", "Banner text"]].flatMap(([key, labelFa, labelEn]) => [ { name: `${key}Fa`, label: fa ? `${labelFa} فارسی` : `Persian ${labelEn}`, type: "textarea" }, { name: `${key}En`, label: fa ? `${labelFa} انگلیسی` : `English ${labelEn}`, type: "textarea" } ]),
    { name: "bannerImageUrl", label: fa ? "تصویر بنر تبرستان" : "Tabarestan banner image", type: "image" },
    { name: "bannerVisibility", label: fa ? "نمایش بنر" : "Banner visibility", options: [{value: "visible", label: fa ? "نمایش" : "Visible"}, {value: "hidden", label: fa ? "پنهان" : "Hidden"}] },
    { name: "bannerLink", label: fa ? "لینک بنر" : "Banner link", type: "url" },
    ...[["bannerEyebrow", "برچسب رویداد", "Event overline"], ["bannerSubtitle", "زیرعنوان مسابقه", "Event subtitle"], ["bannerAction", "عنوان دکمه اصلی", "Primary button label"]].flatMap(([key, labelFa, labelEn]) => [{name: `${key}Fa`, label: fa ? `${labelFa} فارسی` : `Persian ${labelEn}`}, {name: `${key}En`, label: fa ? `${labelFa} انگلیسی` : `English ${labelEn}`}]),
    { name: "bannerEnglishTitle", label: fa ? "عنوان لاتین رویداد" : "Event English display title", dir: "ltr" },
    { name: "bannerDeadline", label: fa ? "زمان شروع رویداد (ساعت تهران)" : "Event starts at (Tehran time)", type: "datetime-local", hint: fa ? "با خالی گذاشتن، شمارنده پنهان می‌شود." : "Leave empty to hide the countdown." },
    { name: "bannerBackgroundUrl", label: fa ? "تصویر پس‌زمینه بنر" : "Banner background image", type: "image" },
    { name: "bannerTheme", label: fa ? "رنگ پس‌زمینه" : "Background theme", options: [{ value: "forest", label: fa ? "سبز جنگلی" : "Forest" }, { value: "emerald", label: fa ? "سبز زمردی" : "Emerald" }, { value: "night", label: fa ? "شب" : "Night" }] },
    { name: "bannerDetailsLink", label: fa ? "پیوند اطلاعات بیشتر" : "Learn more URL", type: "url" },
    { name: "trustImageUrl", label: fa ? "تصویر نماد اعتماد" : "Trust seal image", type: "image" },
    { name: "trustLink", label: fa ? "لینک اعتبارسنجی نماد اعتماد" : "Trust seal verification link", type: "url" },
  ];
  return <PanelPage><PanelPageHeader eyebrow={fa ? "محتوای عمومی" : "Public content"} title={fa ? "ویرایش صفحات ثابت" : "Edit static pages"} description={fa ? "هیرو، چرا کاکتوس، ویدیوها، بنر تبرستان و نماد اعتماد را مدیریت کنید." : "Manage the hero, Why Cactus, videos, Tabarestan banner and trust seal."} /><PanelPrimaryLink href="/panel/admin/about">{fa ? "ویرایش متن درباره، تماس و فوتر" : "Edit About, contact and footer text"}</PanelPrimaryLink><ActionForm locale={locale} action={savePresentation} fields={fields} sections={[
    {title: fa ? "هیرو صفحه اصلی" : "Homepage hero", fields: ["heroTitleFa", "heroTitleEn", "heroDescriptionFa", "heroDescriptionEn", "heroVideoUrl", "heroImageUrl"]},
    {title: fa ? "عنوان‌های بخش‌ها و متن ثابت" : "Section headings and fixed text", fields: headings.flatMap(([key]) => [`${key}Fa`, `${key}En`])},
    {title: fa ? "چرا کاکتوس؟" : "Why Cactus?", fields: ["whyContentFa", "whyContentEn"]},
    {title: fa ? "بنر تبرستان" : "Tabarestan banner", fields: ["bannerVisibility", "bannerEyebrowFa", "bannerEyebrowEn", "bannerTitleFa", "bannerTitleEn", "bannerEnglishTitle", "bannerSubtitleFa", "bannerSubtitleEn", "bannerTextFa", "bannerTextEn", "bannerDeadline", "bannerImageUrl", "bannerBackgroundUrl", "bannerTheme", "bannerLink", "bannerActionFa", "bannerActionEn", "bannerDetailsLink"], sidebar: true},
    {title: fa ? "نماد اعتماد فوتر" : "Footer trust seal", fields: ["trustImageUrl", "trustLink"], sidebar: true},
  ]} initial={Object.fromEntries(Object.entries(presentation).filter(([, value]) => typeof value === "string").map(([key, value]) => [key, key === "bannerDeadline" && value ? new Date(Date.parse(String(value)) + 210 * 60000).toISOString().slice(0, 16) : String(value)]))}><VideoGalleryEditor locale={locale} name="aboutVideos" title={fa ? "چیدمان ویدیوهای درباره" : "About video layout"} urls={presentation.aboutVideos} frames={presentation.aboutVideoFrames} /><TestimonialEditor initial={presentation.testimonials} locale={locale} /><VideoGalleryEditor locale={locale} name="testimonialVideos" title={fa ? "ویدیوهای رضایت بدون مشخصات" : "Legacy testimonial videos"} urls={presentation.testimonialVideos} frames={presentation.testimonialVideoFrames} /></ActionForm></PanelPage>;
}
