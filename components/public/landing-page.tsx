import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { PostCard } from "@/components/blog/post-card";
import { ProductCard } from "@/components/products/product-card";
import { PublicTeacherCard } from "@/components/teacher-profiles/public-teacher-card";
import { HonorCard } from "@/components/honors/honor-card";
import { getPublishedPosts } from "@/lib/blog/queries";
import { getPublishedProducts } from "@/lib/products/queries";
import { getPublicTeachers } from "@/lib/teacher-profiles/queries";
import { getPublishedHonors } from "@/lib/honors/queries";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Arrow, SectionHeading, ClosingInvitation } from "./design";
import { Reveal } from "./public-motion";
export async function LandingPage({ locale }: { locale: Locale }) {
  await connection();
  const d = getDictionary(locale);
  const [posts, products, teachers, honors] = await Promise.all([
    getPublishedPosts(locale, 3),
    getPublishedProducts(locale, 3),
    getPublicTeachers(2),
    getPublishedHonors(1),
  ]);
  return (
    <div className="public-site">
      <SiteHeader locale={locale} />
      <main id="public-main">
        <section className="home-hero">
          <div className="public-wrap">
            <div className="home-hero-grid">
              <div className="home-hero-copy">
                <p className="public-kicker">
                  {locale === "fa"
                    ? "رباتیک، برنامه‌نویسی، کشف دنیا"
                    : "Robotics. Programming. Discovery."}
                </p>
                <h1>
                  {locale === "fa" ? (
                    <>
                      ایده‌ات را<em>به حرکت درآور.</em>
                    </>
                  ) : (
                    <>
                      Give your ideas<em>a life of their own.</em>
                    </>
                  )}
                </h1>
                <p className="public-description">{d.heroDescription}</p>
                <div className="home-actions">
                  <Link
                    className="public-button"
                    href={localizePath(locale, "/courses")}
                  >
                    {locale === "fa" ? "شروع مسیر یادگیری" : "Explore courses"}
                    <Arrow />
                  </Link>
                  <Link
                    className="public-button public-button--outline"
                    href={localizePath(locale, "/about")}
                  >
                    {d.heroAction}
                    <Arrow />
                  </Link>
                </div>
              </div>
              <div className="robot-stage">
                <Image
                  src="/images/cactus-robot.webp"
                  alt={
                    locale === "fa"
                      ? "تصویر مفهومی یک ربات کاکتوس با قطعات مکانیکی و مدار"
                      : "Concept illustration of a Cactus robot with mechanical parts and circuitry"
                  }
                  width={1024}
                  height={1024}
                  sizes="(max-width:767px) 400px, (max-width:1400px) 45vw, 600px"
                  preload
                />
                <div className="robot-label nums-en" dir="ltr">
                  <span>CACTUS / IDEA IN MOTION</span>
                  <span>↗ EXPLORE</span>
                </div>
              </div>
            </div>
            <div className="hero-footnote">
              <span>{d.heroEyebrow}</span>
              <span>
                {locale === "fa"
                  ? "از کنجکاوی تا ساختن"
                  : "From curiosity to creation"}{" "}
                <span aria-hidden="true">↓</span>
              </span>
            </div>
          </div>
        </section>
        <div className="discipline-strip">
          <span>{locale === "fa" ? "رباتیک" : "ROBOTICS"}</span>
          <span aria-hidden="true">+</span>
          <span>{locale === "fa" ? "برنامه‌نویسی" : "PROGRAMMING"}</span>
          <span aria-hidden="true">+</span>
          <span>
            {locale === "fa" ? "تفکر مهندسی" : "ENGINEERING THINKING"}
          </span>
          <span aria-hidden="true">+</span>
          <span>{locale === "fa" ? "خلاقیت" : "CREATIVITY"}</span>
        </div>
        <section className="public-wrap public-section">
          <Reveal className="home-manifesto">
            <div>
              <p className="public-kicker">{d.whyTitle}</p>
              <h2 className="mt-5">
                {locale === "fa" ? (
                  <>
                    اینجا، یادگیری
                    <br />
                    با ساختن اتفاق می‌افتد.
                  </>
                ) : (
                  <>
                    Here, learning
                    <br />
                    happens by building.
                  </>
                )}
              </h2>
            </div>
            <div>
              {d.whyItems.map(([title, description], i) => (
                <article key={title} className="learning-row">
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>
        {products.length > 0 && (
          <section className="home-shop public-section">
            <div className="public-wrap">
              <SectionHeading
                locale={locale}
                eyebrow={locale === "fa" ? "روی میز کار" : "ON THE WORKBENCH"}
                title={d.featuredProducts}
                href="/shop"
                action={d.allProducts}
              />
              <Reveal
                pattern="image"
                className={`product-grid ${products.length === 1 ? "product-grid--single" : ""}`}
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} locale={locale} />
                ))}
              </Reveal>
            </div>
          </section>
        )}
        {posts.length > 0 && (
          <section className="public-section public-wrap">
            <SectionHeading
              locale={locale}
              eyebrow={
                locale === "fa" ? "دفتر کنجکاوی" : "THE CURIOSITY JOURNAL"
              }
              title={d.latestPosts}
              href="/blog"
              action={d.allPosts}
            />
            <Reveal className="editorial-grid">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} locale={locale} />
              ))}
            </Reveal>
          </section>
        )}
        {teachers.length > 0 && (
          <section className="public-section public-wrap">
            <SectionHeading
              locale={locale}
              eyebrow={
                locale === "fa"
                  ? "آدم‌های پشت ایده‌ها"
                  : "THE PEOPLE BEHIND THE IDEAS"
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
          <section className="public-section public-wrap home-honors">
            <SectionHeading
              locale={locale}
              eyebrow={
                locale === "fa"
                  ? "ساخته‌ایم، یاد گرفته‌ایم"
                  : "BUILT. LEARNED. ACHIEVED."
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
        <ClosingInvitation locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
