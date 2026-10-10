import Link from "next/link";
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
  index,
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
      <div className="public-wrap page-intro-grid">
        <div>
          <p className="public-kicker">{eyebrow}</p>
          <h1 className="public-title">{title}</h1>
          {description && <p className="public-description">{description}</p>}
        </div>
        <span aria-hidden="true" className="page-index nums-en" dir="ltr">
          {index}
          <span className="sr-only">{locale}</span>
        </span>
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
    <section className="public-section home-close">
      <div className="public-wrap">
        <h2>
          {locale === "fa" ? (
            <>
              ایده بعدی،
              <br />
              از تو شروع می‌شود.
            </>
          ) : (
            <>
              The next idea
              <br />
              starts with you.
            </>
          )}
        </h2>
        <Link className="public-button" href={localizePath(locale, "/courses")}>
          {locale === "fa" ? "مسیرت را پیدا کن" : "Find your learning path"}
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
