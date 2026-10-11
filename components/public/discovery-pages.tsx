/* eslint-disable @next/next/no-img-element -- Course imagery uses validated managed or remote media. */
import { VideoPlayer, VideoGallery } from "./video-player";
import { getPresentation } from "@/lib/site-content/presentation";
import { getSiteContent } from "@/lib/site-content/queries";
import { CommentsSection } from "@/components/comments/comments-section";
import { getContentComments } from "@/lib/comments/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { getLocalizedUserName } from "@/lib/users/name";
import { Reactions } from "@/components/workflows/reactions";
import Link from "next/link";
import { and, desc, eq, ilike, inArray, or, sql, lte } from "drizzle-orm";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getDatabase } from "@/lib/db/client";
import {
  coursePages,
  terms,
  posts,
  products,
  teacherProfiles,
  users,
  termSchedules,
  termTeachers,
} from "@/lib/db/schema";
import { text, title } from "@/lib/workflows";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { escapeLikePattern } from "@/lib/panel/pagination";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PageIntro, Arrow } from "./design";
import { CourseCard } from "./course-card";
import { SearchForm } from "./search-form";
import { PanelInput, PanelSelect } from "@/components/panel/form-controls";
import { primaryButtonClass, PanelEmptyState } from "@/components/panel/ui";
import { RichContent } from "@/components/content/rich-content";
import { ResourceContent } from "@/components/workflows/resource-pages";
export async function PublicShell({
  locale,
  path,
  heading,
  description,
  children,
}: {
  locale: Locale;
  path: string;
  heading: string;
  description?: string;
  children: React.ReactNode;
}) {
  const kinds: Record<string, [string, string, string]> = {
    "/courses": ["01", "مسیرهای یادگیری", "LEARNING PATHS"],
    "/search": ["08", "کنجکاوی‌ات را دنبال کن", "FOLLOW YOUR CURIOSITY"],
    "/requirements": ["06", "آماده برای شروع", "READY TO BEGIN"],
    "/shop/checkout": [
      "09",
      "پروژه بعدی، یک قدم نزدیک‌تر",
      "ONE STEP CLOSER TO YOUR NEXT PROJECT",
    ],
  };
  const [index, fa, en] = kinds[path] ?? [
    "01",
    "یادگیری با کاکتوس",
    "LEARN WITH CACTUS",
  ];
  return (
    <div className="public-site">
      <SiteHeader locale={locale} currentPath={path} />
      <main id="public-main">
        <PageIntro
          locale={locale}
          kind={
            path === "/search"
              ? "search"
              : path === "/requirements"
                ? "requirements"
                : "course"
          }
          index={index}
          eyebrow={locale === "fa" ? fa : en}
          title={heading}
          description={description}
        />
        <div className="public-wrap public-shell-content">{children}</div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

export async function CourseIndex({
  locale,
  params = {},
}: {
  locale: Locale;
  params?: Record<string, string | undefined>;
}) {
  await connection();
  const q = (params.q ?? "").trim().slice(0, 100);
  const db = getDatabase();
  const courses = await db
    .select({ course: coursePages, price: terms.tuitionToman })
    .from(coursePages)
    .leftJoin(terms, eq(terms.id, coursePages.termId))
    .where(
      and(
        eq(coursePages.status, "published"),
        q
          ? or(
              ilike(coursePages.titleFa, `%${escapeLikePattern(q)}%`),
              ilike(coursePages.titleEn, `%${escapeLikePattern(q)}%`),
            )
          : undefined,
        params.level ? eq(coursePages.level, params.level) : undefined,
        params.topic ? eq(coursePages.topic, params.topic) : undefined,
        params.age ? eq(coursePages.ageGroup, params.age) : undefined,
        params.price === "free"
          ? eq(terms.tuitionToman, 0)
          : params.price === "paid"
            ? sql`${terms.tuitionToman}>0`
            : undefined,
      ),
    )
    .orderBy(
      ...(params.sort === "popular"
        ? [desc(coursePages.isFeatured), desc(coursePages.updatedAt)]
        : [desc(coursePages.createdAt)]),
    );
  const all = await db
    .select({ topic: coursePages.topic, age: coursePages.ageGroup })
    .from(coursePages)
    .where(eq(coursePages.status, "published"));
  return (
    <PublicShell
      locale={locale}
      path="/courses"
      heading={text(
        locale,
        "مسیر یادگیری شما از اینجا شروع می‌شود",
        "Your learning journey starts here",
      )}
      description={text(
        locale,
        "از نخستین مدار تا ساخت ربات‌های هوشمند؛ دوره مناسب خود را پیدا کنید.",
        "From your first circuit to intelligent robots, find the right course for you.",
      )}
    >
      <form className="course-filters grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <PanelInput
          name="q"
          defaultValue={q}
          placeholder={text(locale, "جست‌وجوی دوره", "Search courses")}
          aria-label={text(locale, "جست‌وجو", "Search")}
        />
        {[
          {
            name: "topic",
            label: text(locale, "همه موضوع‌ها", "All topics"),
            values: [...new Set(all.map((a) => a.topic))],
          },
          {
            name: "age",
            label: text(locale, "همه گروه‌های سنی", "All ages"),
            values: [...new Set(all.map((a) => a.age))],
          },
          {
            name: "level",
            label: text(locale, "همه سطح‌ها", "All levels"),
            values: ["beginner", "intermediate", "advanced"],
          },
          {
            name: "price",
            label: text(locale, "همه قیمت‌ها", "All prices"),
            values: ["free", "paid"],
          },
          {
            name: "sort",
            label: text(locale, "جدیدترین", "Newest"),
            values: ["popular"],
          },
        ].map((f) => (
          <PanelSelect
            key={f.name}
            name={f.name}
            defaultValue={params[f.name] ?? ""}
            aria-label={f.label}
          >
            <option value="">{f.label}</option>
            {f.values.map((v) => (
              <option key={v} value={v}>
                {text(
                  locale,
                  (
                    {
                      beginner: "مقدماتی",
                      intermediate: "متوسط",
                      advanced: "پیشرفته",
                      free: "رایگان",
                      paid: "شهریه‌دار",
                      popular: "ویژه",
                    } as Record<string, string>
                  )[v] ?? v,
                  v,
                )}
              </option>
            ))}
          </PanelSelect>
        ))}
        <button className={primaryButtonClass}>
          {text(locale, "فیلتر", "Filter")}
        </button>
      </form>
      <div className="course-grid">
        {courses.map(({ course, price }) => (
          <CourseCard
            key={course.id}
            course={course}
            price={price}
            locale={locale}
            headingLevel={2}
          />
        ))}
      </div>
      {!courses.length && (
        <PanelEmptyState
          title={text(locale, "دوره‌ای پیدا نشد", "No matching courses")}
          description={text(
            locale,
            "فیلترها را تغییر دهید.",
            "Try changing your filters.",
          )}
        />
      )}
    </PublicShell>
  );
}
export async function CourseDetail({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  await connection();
  const db = getDatabase();
  const [c] = await db
    .select()
    .from(coursePages)
    .where(
      and(eq(coursePages.slug, slug), eq(coursePages.status, "published")),
    );
  if (!c) notFound();
  const [term] = c.termId
    ? await db.select().from(terms).where(eq(terms.id, c.termId))
    : [];
  const schedule = term
    ? await db
        .select()
        .from(termSchedules)
        .where(eq(termSchedules.termId, term.id))
    : [];
  const linkedTeachers = term ? await db.select({id: termTeachers.teacherId}).from(termTeachers).where(eq(termTeachers.termId, term.id)) : [];
  const instructorIds = [...new Set([...(c.sections.teacherIds || []), ...linkedTeachers.map(t => t.id)])];
  const instructors = instructorIds.length ? await db.select({ user: users, username: sql<string | null>`case when ${teacherProfiles.isPublic} then ${teacherProfiles.username} else null end` }).from(users).leftJoin(teacherProfiles, eq(teacherProfiles.userId, users.id)).where(and(inArray(users.id, instructorIds), eq(users.role, "teacher"), eq(users.isActive, true))) : [];
  const user = await getCurrentUser();
  const courseComments = await getContentComments({ courseId: c.id }, user?.id);
  const presentation = getPresentation((await getSiteContent()).presentation);
  const related = c.sections.blogIds.length
    ? await db
        .select()
        .from(posts)
        .where(
          and(
            inArray(posts.id, c.sections.blogIds),
            eq(posts.status, "published"),
            lte(posts.publishedAt, new Date()),
          ),
        )
    : [];
  return (
    <PublicShell
      locale={locale}
      path={`/courses/${slug}`}
      heading={title(c, locale)}
    >
      <div className="course-detail-layout grid items-start gap-8 lg:grid-cols-[1fr_340px]">
        <article className="space-y-8">
          {(
            <img
              src={c.coverImageUrl || "/images/reference-v4/scene-arduino.svg"}
              alt=""
              className="aspect-video w-full rounded-3xl object-cover"
            />
          )}
          <p className="public-description" dir={locale === "en" && !c.summaryEn ? "rtl" : undefined}>{locale === "en" ? c.summaryEn || c.summaryFa : c.summaryFa}</p>
          <RichContent html={locale === "en" ? c.contentEn || c.contentFa : c.contentFa} dir={locale === "en" && !c.contentEn ? "rtl" : undefined} />
          {c.videoUrl && <VideoPlayer url={c.videoUrl} locale={locale} label={text(locale, "معرفی دوره", "Course introduction")} />}
          {instructors.length > 0 ? <section className="space-y-4"><h2 className="text-2xl font-bold">{text(locale, "مدرس‌های دوره", "Course instructors")}</h2><div className="grid gap-4 sm:grid-cols-2">{instructors.map(({user: instructor, username}) => <article className="flex items-center gap-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800" key={instructor.id}>{instructor.avatarUrl && <img className="size-16 rounded-full object-cover" src={instructor.avatarUrl} alt="" />}<div>{username ? <Link href={localizePath(locale, `/teachers/${username}`)}>{getLocalizedUserName(instructor, locale)}</Link> : <strong>{getLocalizedUserName(instructor, locale)}</strong>}</div></article>)}</div></section> : <section><h2 className="text-2xl font-bold">{text(locale, "مدرس دوره", "Course instructor")}</h2><p className="mt-3 text-zinc-500">{text(locale, "مدرس این دوره به‌زودی معرفی می‌شود.", "The instructor will be announced soon.")}</p></section>}
          {c.sections.syllabus.length > 0 && <h2 className="text-2xl font-bold">{text(locale, "سرفصل‌های دوره", "Course syllabus")}</h2>}
          {c.sections.syllabus.map((s, i) => (
            <details
              key={i}
              className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
              open
              dir={locale === "en" && !s.titleEn ? "rtl" : undefined}
            >
              <summary className="cursor-pointer font-bold">
                {locale === "en" ? s.titleEn || s.titleFa : s.titleFa}
              </summary>
              <ul className="mt-4 list-inside list-disc space-y-2">
                {(locale === "en" ? s.itemsEn || s.itemsFa : s.itemsFa)
                  .split("\n")
                  .filter(Boolean)
                  .map((v, j) => (
                    <li key={j}>{v}</li>
                  ))}
              </ul>
            </details>
          ))}
          {c.sections.faqs.map((f, i) => (
            <details
              key={i}
              dir={locale === "en" && !f.questionEn ? "rtl" : undefined}
              className="rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-900"
            >
              <summary className="cursor-pointer font-bold">
                {locale === "en" ? f.questionEn || f.questionFa : f.questionFa}
              </summary>
              <p className="mt-4 whitespace-pre-wrap leading-8">
                {locale === "en" ? f.answerEn || f.answerFa : f.answerFa}
              </p>
            </details>
          ))}
          {c.sections.tools.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold">
                {text(locale, "ابزارهای پیشنهادی", "Recommended tools")}
              </h2>
              <ul className="space-y-3">
                {c.sections.tools.map((t, i) => (
                  <li key={i}>
                    <a
                      className="text-emerald-700 dark:text-emerald-400"
                      href={t.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {locale === "en" ? t.nameEn || t.nameFa : t.nameFa}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {c.sections.testimonials.length > 0 ? <section className="space-y-4"><h2 className="text-2xl font-bold">{text(locale, "ویدیو نظرات دانش‌پژوهان", "Student video testimonials")}</h2><div className="public-video-grid">{c.sections.testimonials.map((t, i) => <VideoPlayer key={i} url={t.videoUrl} label={t.name} locale={locale} />)}</div></section> : <VideoGallery urls={presentation.testimonialVideos} frames={presentation.testimonialVideoFrames} locale={locale} title={text(locale, "رضایت دانش‌پژوهان کاکتوس", "Cactus student testimonials")} />}
          {c.certificateImageUrl && (
            <img
              src={c.certificateImageUrl}
              alt={text(
                locale,
                "نمونه گواهی دوره",
                "Sample course certificate",
              )}
              className="w-full rounded-2xl"
            />
          )}
          {related.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold">
                {text(locale, "مطالعه بیشتر", "Further reading")}
              </h2>
              {related.map((p) => (
                <Link
                  className="mb-3 block text-emerald-700 dark:text-emerald-400"
                  key={p.id}
                  href={localizePath(locale, `/blog/${p.slug}`)}
                >
                  {title(p, locale)}
                </Link>
              ))}
            </section>
          )}
        </article>
        <aside className="space-y-5 rounded-3xl border border-zinc-200 p-7 lg:sticky lg:top-6 dark:border-zinc-800">
          <p>
            {c.topic} · {c.ageGroup}
          </p>
          <p>{c.duration}</p>
          <p>{text(locale, "سطح دوره", "Course level")}: {text(locale, ({beginner:"مقدماتی",intermediate:"متوسط",advanced:"پیشرفته"} as Record<string,string>)[c.level] || c.level, c.level)}</p>
          {term && <p>{text(locale, "شیوه برگزاری", "Delivery")}: {text(locale, ({online:"آنلاین",in_person:"حضوری",hybrid:"ترکیبی"} as Record<string,string>)[term.deliveryMode] || term.deliveryMode, term.deliveryMode.replaceAll("_", " "))}</p>}
          {term && (
            <>
              <p className="text-2xl font-bold">
                {term.tuitionToman.toLocaleString(locale)}{" "}
                {text(locale, "تومان", "toman")}
              </p>
              <p>
                {new Date(`${term.startDate}T12:00:00Z`).toLocaleDateString(
                  locale,
                )}{" "}
                –{" "}
                {new Date(`${term.endDate}T12:00:00Z`).toLocaleDateString(
                  locale,
                )}
              </p>
              {schedule.map((s) => (
                <p key={s.id} className="text-sm">
                  {
                    (locale === "fa"
                      ? [
                          "شنبه",
                          "یکشنبه",
                          "دوشنبه",
                          "سه‌شنبه",
                          "چهارشنبه",
                          "پنجشنبه",
                          "جمعه",
                        ]
                      : [
                          "Saturday",
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                        ])[s.dayOfWeek]
                  }{" "}
                  · {s.startTime.slice(0, 5)} – {s.endTime.slice(0, 5)}
                </p>
              ))}
              <Link
                className={primaryButtonClass}
                href={`/panel/student/terms?termId=${term.id}`}
              >
                {text(
                  locale,
                  "مشاهده شرایط و ثبت‌نام",
                  "View availability and enroll",
                )}
              </Link>
            </>
          )}
        </aside>
      </div>
      <Reactions kind="course" id={c.id} locale={locale} />
      <CommentsSection locale={locale} targetType="course" targetId={c.id} slug={c.slug} comments={courseComments} user={user} />
    </PublicShell>
  );
}
export async function SearchPage({
  locale,
  q = "",
}: {
  locale: Locale;
  q?: string;
}) {
  await connection();
  const query = q.trim().slice(0, 100);
  const pattern = `%${escapeLikePattern(query)}%`;
  const db = getDatabase();
  const [courses, articles, shop, teachers] = query
    ? await Promise.all([
        db
          .select()
          .from(coursePages)
          .where(
            and(
              eq(coursePages.status, "published"),
              or(
                ilike(coursePages.titleFa, pattern),
                ilike(coursePages.titleEn, pattern),
              ),
            ),
          )
          .limit(30),
        db
          .select()
          .from(posts)
          .where(
            and(
              eq(posts.status, "published"),
              lte(posts.publishedAt, new Date()),
              or(ilike(posts.titleFa, pattern), ilike(posts.titleEn, pattern)),
            ),
          )
          .limit(30),
        db
          .select()
          .from(products)
          .where(
            and(
              eq(products.status, "published"),
              lte(products.publishedAt, new Date()),
              or(
                ilike(products.titleFa, pattern),
                ilike(products.titleEn, pattern),
              ),
            ),
          )
          .limit(30),
        db
          .select({
            username: teacherProfiles.username,
            titleFa: sql<string>`concat_ws(' ',${users.firstNameFa},${users.lastNameFa})`,
            titleEn: sql<string>`concat_ws(' ',${users.firstNameEn},${users.lastNameEn})`,
          })
          .from(teacherProfiles)
          .innerJoin(users, eq(users.id, teacherProfiles.userId))
          .where(
            and(
              eq(teacherProfiles.isPublic, true),
              eq(users.isActive, true),
              eq(users.role, "teacher"),
              or(
                ilike(users.firstNameFa, pattern),
                ilike(users.lastNameFa, pattern),
                ilike(users.firstNameEn, pattern),
                ilike(users.lastNameEn, pattern),
              ),
            ),
          )
          .limit(30),
      ])
    : [[], [], [], []];
  const results = [
    ...courses.map((c) => ({
      key: c.id,
      href: `/courses/${c.slug}`,
      label: title(c, locale),
      kind: text(locale, "دوره", "Course"),
    })),
    ...articles.map((p) => ({
      key: p.id,
      href: `/blog/${p.slug}`,
      label: title(p, locale),
      kind: text(locale, "مقاله", "Article"),
    })),
    ...shop.map((p) => ({
      key: p.id,
      href: `/shop/${p.slug}`,
      label: title(p, locale),
      kind: text(locale, "محصول", "Product"),
    })),
    ...teachers.map((t) => ({
      key: t.username,
      href: `/teachers/${t.username}`,
      label: title(t, locale),
      kind: text(locale, "مدرس", "Teacher"),
    })),
  ];
  return (
    <PublicShell
      locale={locale}
      path="/search"
      heading={text(locale, "در کاکتوس جست‌وجو کنید", "Search Cactus")}
    >
      <SearchForm locale={locale} query={query} />
      <p role="status" className="public-description">
        {query
          ? text(
              locale,
              `${results.length.toLocaleString("fa")} نتیجه برای «${query}»`,
              `${results.length} results for “${query}”`,
            )
          : text(
              locale,
              "چه چیزی می‌خواهید بسازید یا یاد بگیرید؟ در دوره‌ها، مقاله‌ها، محصولات و مدرس‌ها جست‌وجو کنید.",
              "What would you like to build or learn? Search courses, articles, products, and teachers.",
            )}
      </p>
      {[...new Set(results.map((r) => r.kind))].map((kind) => (
        <section key={kind} className="search-group">
          <h2>{kind}</h2>
          {results
            .filter((r) => r.kind === kind)
            .map((r) => (
              <Link
                key={`${r.kind}:${r.key}`}
                href={localizePath(locale, r.href)}
                className="search-result"
              >
                <span dir="auto">{r.label}</span>
                <Arrow />
              </Link>
            ))}
        </section>
      ))}
      {query && !results.length && (
        <PanelEmptyState
          title={text(locale, "نتیجه‌ای پیدا نشد", "No results found")}
          description={text(
            locale,
            "عبارت کوتاه‌تر یا واژه دیگری را امتحان کنید.",
            "Try a shorter phrase or a different keyword.",
          )}
        />
      )}
      {!query && (
        <nav
          className="search-suggestions"
          aria-label={text(locale, "پیشنهادهای جست‌وجو", "Explore by section")}
        >
          {[
            ["/courses", "دوره‌ها", "Courses"],
            ["/blog", "وبلاگ", "Journal"],
            ["/shop", "فروشگاه", "Shop"],
          ].map(([path, fa, en]) => (
            <Link
              key={path}
              className="public-link"
              href={localizePath(locale, path)}
            >
              {text(locale, fa, en)}
              <Arrow />
            </Link>
          ))}
        </nav>
      )}
    </PublicShell>
  );
}
export async function RequirementsPage({ locale }: { locale: Locale }) {
  await connection();
  return (
    <PublicShell
      locale={locale}
      path="/requirements"
      heading={text(locale, "برای یادگیری آماده شوید", "Get ready to learn")}
      description={text(
        locale,
        "نرم‌افزارها و راهنمای آماده‌سازی را پیدا کنید؛ پیش از شروع، با ابزارهای مسیرتان آشنا شوید.",
        "Find preparation guides and software, and get familiar with the tools for your learning path.",
      )}
    >
      <div className="preparation-intro">
        <span className="public-kicker">
          {text(locale, "ابزارهای مسیر شما", "YOUR LEARNING TOOLKIT")}
        </span>
        <Link className="public-link" href={localizePath(locale, "/courses")}>
          {text(
            locale,
            "مشاهده دوره‌ها و شرایط هر دوره",
            "Explore courses and their requirements",
          )}
          <Arrow />
        </Link>
      </div>
      <ResourceContent kind="requirements" locale={locale} />
      <h2 className="text-2xl font-bold">
        {text(locale, "پرسش‌های متداول", "Frequently asked questions")}
      </h2>
      <ResourceContent kind="faqs" locale={locale} />
    </PublicShell>
  );
}
