import { HeroVideo } from "./hero-video";
import { getPresentation } from "@/lib/site-content/presentation";
import { VideoGallery } from "./video-player";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { desc, eq } from "drizzle-orm";
import { PostCard } from "@/components/blog/post-card";
import { ProductCard } from "@/components/products/product-card";
import { PublicTeacherCard } from "@/components/teacher-profiles/public-teacher-card";
import { HonorCard } from "@/components/honors/honor-card";
import { RichContent } from "@/components/content/rich-content";
import { getPublishedPosts } from "@/lib/blog/queries";
import { getPublishedProducts } from "@/lib/products/queries";
import { getPublicTeachers } from "@/lib/teacher-profiles/queries";
import { getPublishedHonors } from "@/lib/honors/queries";
import { getSiteContent } from "@/lib/site-content/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDatabase } from "@/lib/db/client";
import { coursePages, terms } from "@/lib/db/schema";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Arrow, SectionHeading, ClosingInvitation } from "./design";
import { Reveal } from "./public-motion";
import { PublicIcon, type PublicIconName } from "./icons";
import { CourseCard } from "./course-card";
export async function LandingPage({ locale }: { locale: Locale }) {
  await connection();
  const d = getDictionary(locale);
  const [posts, products, teachers, honors, content, courses] =
    await Promise.all([
      getPublishedPosts(locale, 4),
      getPublishedProducts(locale, 4),
      getPublicTeachers(4),
      getPublishedHonors(1),
      getSiteContent(),
      getDatabase()
        .select({ course: coursePages, price: terms.tuitionToman })
        .from(coursePages)
        .leftJoin(terms, eq(terms.id, coursePages.termId))
        .where(eq(coursePages.status, "published"))
        .orderBy(desc(coursePages.isFeatured), desc(coursePages.createdAt))
        .limit(4),
    ]);
  const presentation = getPresentation(content.presentation);
  const local = (fa: string, en: string) => locale === "en" ? en || fa : fa;
  const features: [string, string, string, string, string, PublicIconName][] = [
    [
      "/shop",
      "محصولات تخصصی",
      "Specialist products",
      "قطعات و تجهیزات رباتیک",
      "Robotics parts and equipment",
      "shop",
    ],
    [
      "/courses",
      "دوره‌های آموزشی",
      "Learning courses",
      "مسیر یادگیری خودت را پیدا کن",
      "Find your learning path",
      "courses",
    ],
    [
      "/requirements",
      "نرم‌افزار و پیش‌نیازها",
      "Software & preparation",
      "آماده برای طراحی و ساخت",
      "Get ready to design and build",
      "software",
    ],
    [
      "/teachers",
      "مدرس‌های کاکتوس",
      "Cactus instructors",
      "با مدرس‌ها آشنا شو",
      "Meet your instructors",
      "teachers",
    ],
    [
      "/honors",
      "افتخارات کاکتوس",
      "Cactus achievements",
      "دستاوردها و گواهینامه‌ها",
      "Achievements and certificates",
      "honors",
    ],
  ];
  return (
    <div className="public-site public-home">
      <SiteHeader locale={locale} />
      <main id="public-main">
        <section className="home-hero">
          {presentation.heroVideoUrl ? <HeroVideo url={presentation.heroVideoUrl} poster={presentation.heroImageUrl} locale={locale} /> : presentation.heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="home-hero-media" src={presentation.heroImageUrl} alt="" />
          ) : <Image className="home-hero-media" src="/images/reference-v4/hero-arena.svg" alt="" fill preload sizes="100vw" />}
          <div className="home-hero-shade" />
          <div className="public-wrap home-hero-inner">
            <div className="home-hero-copy">
              <p className="hero-overline" dir={locale === "en" && !presentation.heroEyebrowEn ? "rtl" : undefined}>{local(presentation.heroEyebrowFa, presentation.heroEyebrowEn)}</p>
              <h1 dir={locale === "en" && !presentation.heroTitleEn ? "rtl" : undefined}>{local(presentation.heroTitleFa, presentation.heroTitleEn)}</h1>
              <p className="public-description" dir={locale === "en" && !presentation.heroDescriptionEn ? "rtl" : undefined}>{local(presentation.heroDescriptionFa, presentation.heroDescriptionEn)}</p>
              <div className="home-actions">
                <Link
                  className="public-button"
                  href={localizePath(locale, "/courses")}
                >
                  {locale === "fa" ? "شروع یادگیری" : "Start learning"}
                  <Arrow />
                </Link>
                <Link
                  className="public-button public-button--glass"
                  href={localizePath(locale, "/shop")}
                >
                  {d.allProducts}
                </Link>
              </div>
            </div>
            <nav
              className="hero-side-gallery"
              aria-label={
                locale === "fa" ? "مسیرهای کشف کاکتوس" : "Discover Cactus"
              }
            >
              {(
                [
                  ["/courses", "scene-arduino.svg", "یادگیری", "Learn"],
                  ["/shop", "robot-mascot.svg", "ساختن", "Build"],
                  ["/requirements", "scene-python.svg", "آمادگی", "Prepare"],
                ] as const
              ).map(([path, asset, fa, en]) => (
                <Link key={path} href={localizePath(locale, path)}>
                  <Image
                    src={`/images/reference-v4/${asset}`}
                    alt=""
                    fill
                    sizes="96px"
                  />
                  <span>{locale === "fa" ? fa : en}</span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
        <section className="public-wrap public-section home-why">
          <SectionHeading locale={locale} title={local(presentation.whyTitleFa, presentation.whyTitleEn)} eyebrow={locale === "fa" ? "یادگیری برای آینده" : "LEARN FOR THE FUTURE"} />
          <RichContent html={local(presentation.whyContentFa, presentation.whyContentEn)} dir={locale === "en" && !presentation.whyContentEn ? "rtl" : undefined} />
        </section>
        <section className="public-wrap public-section">
          <Reveal className="home-about">
            <div>
              <p className="public-kicker">{d.aboutTitle}</p>
              <h2>{local(presentation.aboutTitleFa, presentation.aboutTitleEn)}</h2>
              <RichContent
                html={
                  locale === "en"
                    ? content.aboutUsEn || content.aboutUsFa
                    : content.aboutUsFa
                }
                dir={locale === "en" && !content.aboutUsEn ? "rtl" : undefined}
              />
              <div className="home-about-pillars">
                {d.whyItems.map(([title], i) => (
                  <div key={title}>
                    <PublicIcon
                      name={(["courses", "shop", "teachers"] as const)[i % 3]}
                    />
                    <strong>{title}</strong>
                  </div>
                ))}
              </div>
              <Link
                className="public-button"
                href={localizePath(locale, "/about")}
              >
                {d.heroAction}
                <Arrow />
              </Link>
            </div>
            <div className="space-y-5">
              <VideoGallery urls={presentation.aboutVideos} frames={presentation.aboutVideoFrames} locale={locale} title={locale === "fa" ? "معرفی کاکتوس" : "Discover Cactus"} />
            </div>
          </Reveal>
        </section>
        {courses.length > 0 && (
          <section className="public-wrap public-section">
            <SectionHeading
              locale={locale}
              eyebrow={locale === "fa" ? "آکادمی کاکتوس" : "CACTUS ACADEMY"}
              title={local(presentation.coursesTitleFa, presentation.coursesTitleEn)}
              href="/courses"
              action={
                locale === "fa" ? "مشاهده همه دوره‌ها" : "View all courses"
              }
            />
            <Reveal pattern="image" className="course-grid">
              {courses.map(({ course, price }) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  price={price}
                  locale={locale}
                />
              ))}
            </Reveal>
          </section>
        )}
        {presentation.bannerImageUrl && <section className="public-wrap public-section"><div className="home-promotion">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={presentation.bannerImageUrl} alt={local(presentation.bannerTitleFa, presentation.bannerTitleEn)} loading="lazy" />
          <div><h2>{local(presentation.bannerTitleFa, presentation.bannerTitleEn)}</h2><p>{local(presentation.bannerTextFa, presentation.bannerTextEn)}</p>{presentation.bannerLink && <a className="public-button" href={presentation.bannerLink} target="_blank" rel="noopener noreferrer">{locale === "fa" ? "اطلاعات بیشتر" : "Learn more"}<Arrow /></a>}</div>
        </div></section>}
        {products.length > 0 && (
          <section className="public-wrap public-section">
            <SectionHeading
              locale={locale}
              eyebrow={
                locale === "fa" ? "برای پروژه بعدی تو" : "FOR YOUR NEXT PROJECT"
              }
              title={local(presentation.productsTitleFa, presentation.productsTitleEn)}
              href="/shop"
              action={d.allProducts}
            />
            <Reveal className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </Reveal>
          </section>
        )}
        <section className="public-wrap public-section"><VideoGallery urls={presentation.testimonialVideos} frames={presentation.testimonialVideoFrames} locale={locale} title={local(presentation.testimonialsTitleFa, presentation.testimonialsTitleEn)} /></section>
        {posts.length > 0 && (
          <section className="public-wrap public-section">
            <SectionHeading
              locale={locale}
              eyebrow={
                locale === "fa" ? "تازه‌های کاکتوس" : "LATEST FROM CACTUS"
              }
              title={local(presentation.newsTitleFa, presentation.newsTitleEn)}
              href="/blog"
              action={d.allPosts}
            />
            <Reveal className="home-post-grid">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} locale={locale} />
              ))}
            </Reveal>
          </section>
        )}
        {teachers.length > 0 && (
          <section className="public-wrap public-section">
            <SectionHeading
              locale={locale}
              eyebrow={
                locale === "fa" ? "با مدرس‌ها آشنا شو" : "MEET YOUR INSTRUCTORS"
              }
              title={d.teachersTitle}
              href="/teachers"
              action={d.allTeachers}
            />
            <Reveal className="teacher-grid">
              {teachers.map((t) => (
                <PublicTeacherCard key={t.id} teacher={t} locale={locale} />
              ))}
            </Reveal>
          </section>
        )}
        {honors.length > 0 && (
          <section className="public-wrap public-section home-honors">
            <SectionHeading
              locale={locale}
              eyebrow={
                locale === "fa"
                  ? "ساختن، یادگیری، پیشرفت"
                  : "BUILD. LEARN. PROGRESS."
              }
              title={d.honorsTitle}
              href="/honors"
              action={d.allHonors}
            />
            {honors.map((h) => (
              <HonorCard key={h.id} honor={h} locale={locale} />
            ))}
          </section>
        )}
        <nav
          className="public-wrap feature-strip"
          aria-label={
            locale === "fa" ? "بخش‌های وب‌سایت" : "Explore the website"
          }
        >
          {features.map(([path, fa, en, subFa, subEn, icon]) => (
            <Link key={path} href={localizePath(locale, path)}>
              <PublicIcon name={icon} />
              <strong>{locale === "fa" ? fa : en}</strong>
              <small>{locale === "fa" ? subFa : subEn}</small>
            </Link>
          ))}
        </nav>
        <ClosingInvitation locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
