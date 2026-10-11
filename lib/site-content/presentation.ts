import { z } from "zod";
import { isAllowedImageReference } from "@/lib/media/reference";
import { sanitizeRichText } from "@/lib/content/rich-text";

const url = z.string().trim().max(2048).refine(v => !v || /^https?:\/\//.test(v) && URL.canParse(v));
const image = z.string().trim().max(2048).refine(v => v === "/images/generated/tabarestan-banner.png" || isAllowedImageReference(v));
const videos = z.string().max(20000).refine(v => v.split("\n").filter(v => v.trim()).length <= 12 && v.split("\n").every(v => url.safeParse(v).success));
export const presentationSchema = z.object({
  heroEyebrowFa: z.string().trim().max(240), heroEyebrowEn: z.string().trim().max(240),
  whyTitleFa: z.string().trim().max(240), whyTitleEn: z.string().trim().max(240),
  aboutTitleFa: z.string().trim().max(240), aboutTitleEn: z.string().trim().max(240),
  coursesTitleFa: z.string().trim().max(240), coursesTitleEn: z.string().trim().max(240),
  productsTitleFa: z.string().trim().max(240), productsTitleEn: z.string().trim().max(240),
  testimonialsTitleFa: z.string().trim().max(240), testimonialsTitleEn: z.string().trim().max(240),
  newsTitleFa: z.string().trim().max(240), newsTitleEn: z.string().trim().max(240),
  footerTaglineFa: z.string().trim().max(240), footerTaglineEn: z.string().trim().max(240),

  heroTitleFa: z.string().trim().max(240), heroTitleEn: z.string().trim().max(240),
  heroDescriptionFa: z.string().trim().max(1200), heroDescriptionEn: z.string().trim().max(1200),
  heroVideoUrl: url, heroImageUrl: image,
  whyContentFa: z.string().max(20000).transform(sanitizeRichText), whyContentEn: z.string().max(20000).transform(sanitizeRichText),
  aboutVideos: videos, testimonialVideos: videos,
  aboutVideoFrames: z.string().max(240).refine(v => v.split("\n").length <= 12 && v.split("\n").every(frame => ["auto", "portrait", "landscape", "square"].includes(frame.trim()))).default("portrait\nlandscape\nlandscape"),
  testimonialVideoFrames: z.string().max(240).refine(v => v.split("\n").length <= 12 && v.split("\n").every(frame => ["auto", "portrait", "landscape", "square"].includes(frame.trim()))).default("auto"),
  bannerTitleFa: z.string().trim().max(240), bannerTitleEn: z.string().trim().max(240),
  bannerTextFa: z.string().trim().max(1200), bannerTextEn: z.string().trim().max(1200),
  bannerImageUrl: image, bannerLink: url,
  trustImageUrl: image, trustLink: url,
});
export type SitePresentation = Partial<z.infer<typeof presentationSchema>>;
export const defaultPresentation = {
  heroEyebrowFa: "رباتیک برای فردای روشن", heroEyebrowEn: "ROBOTICS FOR A BRIGHTER TOMORROW",
  whyTitleFa: "چرا کاکتوس را انتخاب می‌کنید؟", whyTitleEn: "Why choose Cactus?",
  aboutTitleFa: "درباره کاکتوس", aboutTitleEn: "About Cactus",
  coursesTitleFa: "دوره‌های آموزشی", coursesTitleEn: "Learning courses",
  productsTitleFa: "محصولات منتخب", productsTitleEn: "Featured products",
  testimonialsTitleFa: "رضایت دانش‌پژوهان", testimonialsTitleEn: "Student testimonials",
  newsTitleFa: "تازه‌های کاکتوس", newsTitleEn: "Latest from Cactus",
  footerTaglineFa: "کنجکاو باش. تجربه کن. بساز.", footerTaglineEn: "Stay curious. Experiment. Build.",

  heroTitleFa: "آینده را با کاکتوس بسازید", heroTitleEn: "Build the future with Cactus",
  heroDescriptionFa: "با آموزش عملی رباتیک، تجربه ساختن و راهنمایی مدرس‌های متخصص، مهارت‌های آینده را یاد بگیرید.",
  heroDescriptionEn: "Learn tomorrow’s skills through hands-on robotics, making and guidance from experienced instructors.",
  heroVideoUrl: "https://la.ecactus.co/site_videos/robocup-2024.mp4", heroImageUrl: "",
  whyContentFa: "<h3>یادگیری عملی</h3><p>تجربه ساختن و کار با ربات‌های واقعی.</p><h3>مدرس‌های متخصص</h3><p>یادگیری با راهنمایی مدرس‌های باتجربه رباتیک.</p><h3>آموزش پروژه‌محور</h3><p>از ایده تا ساخت یک پروژه واقعی.</p><h3>مسیر پیشرفت</h3><p>تقویت مهارت حل مسئله و آمادگی برای آینده.</p><h3>یادگیری انعطاف‌پذیر</h3><p>دوره‌های حضوری، آنلاین و ترکیبی.</p><h3>فضای نوآوری</h3><p>آشنایی با ابزارهای طراحی و ساخت ربات.</p>",
  whyContentEn: "<h3>Hands-on learning</h3><p>Build and work with real robots.</p><h3>Experienced instructors</h3><p>Learn with guidance from robotics teachers.</p><h3>Project-based courses</h3><p>Turn an idea into a working project.</p><h3>A path forward</h3><p>Develop problem-solving skills for the future.</p><h3>Flexible learning</h3><p>In-person, online and hybrid courses.</p><h3>Space to innovate</h3><p>Explore tools for designing and building robots.</p>",
  aboutVideos: "https://la.ecactus.co/site_videos/intro-1.mp4\nhttps://la.ecactus.co/site_videos/intro-2.mp4\nhttps://la.ecactus.co/site_videos/intro-3.mp4",
  testimonialVideos: "https://la.ecactus.co/site_videos/intro-2.mp4",
  aboutVideoFrames: "portrait\nlandscape\nlandscape", testimonialVideoFrames: "auto",
  bannerTitleFa: "تبرستان و کاکتوس", bannerTitleEn: "Tabarestan & Cactus", bannerTextFa: "از تبرستان تا آینده؛ با کاکتوس یاد بگیرید، تجربه کنید و بسازید.", bannerTextEn: "From Tabarestan to the future: learn, experiment and build with Cactus.", bannerImageUrl: "/images/generated/tabarestan-banner.png", bannerLink: "",
  trustImageUrl: "https://trustseal.enamad.ir/logo.aspx?id=644259&Code=NQ6KftoTWfPqW2ucLd1nKGXwRVOJWJT8",
  trustLink: "https://trustseal.enamad.ir/?id=644259&Code=NQ6KftoTWfPqW2ucLd1nKGXwRVOJWJT8",
};
export function getPresentation(value: SitePresentation) { return { ...defaultPresentation, ...value }; }
