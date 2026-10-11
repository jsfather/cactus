/* eslint-disable @next/next/no-img-element -- Validated managed media. */
import type { Locale } from "@/lib/i18n/config";
import type { getPresentation } from "@/lib/site-content/presentation";
import { Arrow } from "./design";
import { EventCountdown } from "./event-countdown";

export function EventBanner({
  presentation: p,
  locale,
}: {
  presentation: ReturnType<typeof getPresentation>;
  locale: Locale;
}) {
  const local = (fa: string, en: string) => (locale === "en" ? en || fa : fa);
  return (
    <section className="public-wrap public-section">
      <div className={`event-banner event-banner--${p.bannerTheme}`}>
        {p.bannerBackgroundUrl && (
          <img
            className="event-backdrop"
            src={p.bannerBackgroundUrl}
            alt=""
            loading="lazy"
          />
        )}
        <div className="event-copy">
          <p className="public-kicker">
            ◉ {local(p.bannerEyebrowFa, p.bannerEyebrowEn)}
          </p>
          <h2>{local(p.bannerTitleFa, p.bannerTitleEn)}</h2>
          {p.bannerEnglishTitle && (
            <p className="event-english nums-en" lang="en" dir="ltr">
              {p.bannerEnglishTitle}
            </p>
          )}
          <h3>{local(p.bannerSubtitleFa, p.bannerSubtitleEn)}</h3>
          <p>{local(p.bannerTextFa, p.bannerTextEn)}</p>
          {p.bannerDeadline && (
            <EventCountdown deadline={p.bannerDeadline} locale={locale} />
          )}
          <div className="home-actions">
            {p.bannerLink && (
              <a
                className="public-button"
                href={p.bannerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {local(p.bannerActionFa, p.bannerActionEn)}
                <Arrow />
              </a>
            )}
            {p.bannerDetailsLink && (
              <a
                className="public-button public-button--glass"
                href={p.bannerDetailsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {locale === "fa" ? "اطلاعات بیشتر" : "Learn more"}
                <Arrow />
              </a>
            )}
          </div>
        </div>
        {p.bannerImageUrl && (
          <div className="event-visual">
            <img
              src={p.bannerImageUrl}
              alt={local(p.bannerTitleFa, p.bannerTitleEn)}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
}
