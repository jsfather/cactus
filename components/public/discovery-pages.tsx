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
} from "@/lib/db/schema";
import { text, title } from "@/lib/workflows";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { escapeLikePattern } from "@/lib/panel/pagination";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
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
  return (
    <div className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader locale={locale} currentPath={path} />
      <main className="mx-auto max-w-7xl space-y-10 px-5 py-14 sm:px-8">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {text(locale, "یادگیری با کاکتوس", "Learn with Cactus")}
          </p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">{heading}</h1>
          {description && (
            <p className="mt-5 text-lg leading-8 text-zinc-500">
              {description}
            </p>
          )}
        </header>
        {children}
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
      <form className="grid gap-3 rounded-2xl bg-zinc-50 p-5 sm:grid-cols-3 lg:grid-cols-7 dark:bg-zinc-900">
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map(({ course: c, price }) => (
          <Link
            key={c.id}
            href={localizePath(locale, `/courses/${c.slug}`)}
            className="group overflow-hidden rounded-3xl border border-zinc-200 transition hover:border-emerald-400 dark:border-zinc-800"
          >
            <div className="aspect-video bg-emerald-50 dark:bg-emerald-950">
              {c.coverImageUrl && (
                <img
                  src={c.coverImageUrl}
                  alt=""
                  className="size-full object-cover"
                />
              )}
            </div>
            <div className="space-y-3 p-6">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                {c.topic} · {c.ageGroup}
              </p>
              <h2 className="text-xl font-bold">{title(c, locale)}</h2>
              <p className="line-clamp-3 text-sm leading-7 text-zinc-500">
                {locale === "en" ? c.summaryEn || c.summaryFa : c.summaryFa}
              </p>
              <p className="font-semibold">
                {price === null
                  ? text(locale, "اطلاعات دوره", "Course information")
                  : price === 0
                    ? text(locale, "رایگان", "Free")
                    : `${price.toLocaleString(locale)} ${text(locale, "تومان", "toman")}`}
              </p>
            </div>
          </Link>
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
      description={locale === "en" ? c.summaryEn || c.summaryFa : c.summaryFa}
    >
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_340px]">
        <article className="space-y-8">
          {c.coverImageUrl && (
            <img
              src={c.coverImageUrl}
              alt=""
              className="aspect-video w-full rounded-3xl object-cover"
            />
          )}
          <RichContent
            html={locale === "en" ? c.contentEn || c.contentFa : c.contentFa}
          />
          {c.videoUrl && (
            <a
              className={primaryButtonClass}
              href={c.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {text(locale, "تماشای معرفی دوره", "Watch course introduction")}
            </a>
          )}
          {c.sections.syllabus.map((s, i) => (
            <details
              key={i}
              className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
              open
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
          {c.sections.testimonials.map((t, i) => (
            <a
              key={i}
              className="block rounded-2xl bg-emerald-50 p-5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              href={t.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶ {t.name}
            </a>
          ))}
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
      <form className="flex gap-3">
        <PanelInput
          name="q"
          defaultValue={query}
          aria-label={text(locale, "جست‌وجو", "Search")}
          placeholder={text(
            locale,
            "دوره، محصول، مقاله یا مدرس…",
            "Course, product, article, or teacher…",
          )}
        />
        <button className={primaryButtonClass}>
          {text(locale, "جست‌وجو", "Search")}
        </button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2">
        {results.map((r) => (
          <Link
            key={r.key}
            href={localizePath(locale, r.href)}
            className="rounded-2xl border border-zinc-200 p-6 hover:border-emerald-500 dark:border-zinc-800"
          >
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              {r.kind}
            </p>
            <h2 className="mt-3 font-bold">{r.label}</h2>
          </Link>
        ))}
      </div>
      {query && !results.length && (
        <PanelEmptyState
          title={text(locale, "نتیجه‌ای پیدا نشد", "No results found")}
          description=""
        />
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
    >
      <ResourceContent kind="requirements" locale={locale} />
      <ResourceContent kind="faqs" locale={locale} />
    </PublicShell>
  );
}
