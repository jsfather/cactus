import Link from "next/link";
import Image from "next/image";
import { localizePath, type Locale } from "@/lib/i18n/config";

export function Arrow() {
  return (
    <span aria-hidden="true" className="public-arrow">
      →
    </span>
  );
}
export function CircuitMark() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="27" y="27" width="46" height="46" rx="4" />
      <rect x="38" y="38" width="24" height="24" />
      {[35, 50, 65].map((n) => (
        <g key={n}>
          <path d={`M${n} 12v15M${n} 73v15M12 ${n}h15M73 ${n}h15`} />
          <circle cx={n} cy="9" r="3" />
          <circle cx={n} cy="91" r="3" />
        </g>
      ))}
    </svg>
  );
}
export function PageIntro({
  locale,
  kind,
  eyebrow,
  title,
  description,
}: {
  locale: Locale;
  kind: string;
  eyebrow: string;
  title: string;
  description?: string;
  index: string;
}) {
  return (
    <header className={`page-intro page-intro--${kind}`}>
      <div className="public-wrap page-intro-grid" data-locale={locale}>
        <div>
          <p className="public-kicker">{eyebrow}</p>
          <h1 className="public-title">{title}</h1>
          {description && <p className="public-description">{description}</p>}
        </div>
      </div>
    </header>
  );
}
export function SectionHeading({
  locale,
  eyebrow,
  title,
  href,
  action,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="public-heading">
      <div>
        <p className="public-kicker">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="public-link" href={localizePath(locale, href)}>
          {action}
          <Arrow />
        </Link>
      )}
    </div>
  );
}
export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="public-empty">{children}</div>;
}
export function ClosingInvitation({ locale }: { locale: Locale }) {
  return (
    <section className="public-wrap home-close">
      <div>
        <p className="public-kicker">
          {locale === "fa" ? "آینده را بساز" : "BUILD YOUR FUTURE"}
        </p>
        <h2>
          {locale === "fa"
            ? "مسیر یادگیری‌ات را با کاکتوس شروع کن"
            : "Start your learning journey with Cactus"}
        </h2>
        <p>
          {locale === "fa"
            ? "دوره‌ها و ابزارها را کشف کن و برای پروژه بعدی‌ات آماده شو."
            : "Discover courses and tools, and get ready for your next project."}
        </p>
        <Link className="public-button" href={localizePath(locale, "/courses")}>
          {locale === "fa" ? "مشاهده دوره‌ها" : "Explore courses"}
          <Arrow />
        </Link>
      </div>
      <div className="home-close-art">
        <Image
          src="/images/reference-v4/robot-mascot.svg"
          alt=""
          fill
          sizes="(max-width:600px) 100px, 240px"
        />
      </div>
    </section>
  );
}
