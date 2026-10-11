/* eslint-disable @next/next/no-img-element -- Validated managed media. */
import type { Locale } from "@/lib/i18n/config";
import type { Testimonial } from "@/lib/site-content/presentation";
import { VideoPlayer } from "./video-player";
import { PublicIcon } from "./icons";

export function Testimonials({
  items,
  legacyUrls,
  locale,
}: {
  items: Testimonial[];
  legacyUrls: string;
  locale: Locale;
}) {
  const local = (fa: string, en: string) => (locale === "en" ? en || fa : fa);
  const entries = items.length
    ? items
    : legacyUrls
        .split("\n")
        .filter(Boolean)
        .map((videoUrl) => ({
          nameFa: "",
          nameEn: "",
          termFa: "",
          termEn: "",
          achievementFa: "",
          achievementEn: "",
          imageUrl: "",
          videoUrl,
          studentSatisfaction: "" as const,
          parentSatisfaction: "" as const,
        }));
  return (
    <div className="testimonial-grid">
      {entries.map((item, index) => (
        <article className="testimonial-card" key={index}>
          {item.videoUrl && (
            <VideoPlayer
              url={item.videoUrl}
              locale={locale}
              label={
                local(item.nameFa, item.nameEn) ||
                (locale === "fa" ? "تجربه دانش‌پژوه" : "Student story")
              }
              frame="landscape"
            />
          )}
          <div className="testimonial-copy">
            <div className="testimonial-identity">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" loading="lazy" />
              ) : (
                <span>
                  <PublicIcon name="courses" />
                </span>
              )}
              <div>
                <h3>
                  {local(item.nameFa, item.nameEn) ||
                    (locale === "fa"
                      ? "تجربه یادگیری در کاکتوس"
                      : "Learning at Cactus")}
                </h3>
                {local(item.termFa, item.termEn) && (
                  <p>{local(item.termFa, item.termEn)}</p>
                )}
              </div>
            </div>
            <div className="testimonial-metrics">
              {(["studentSatisfaction", "parentSatisfaction"] as const).map(
                (key, index) =>
                  item[key] !== "" && (
                    <div key={key}>
                      <strong>
                        {(Number(item[key]) / 100).toLocaleString(locale, {
                          style: "percent",
                          maximumFractionDigits: 0,
                        })}
                      </strong>
                      <span>
                        {locale === "fa"
                          ? ["رضایت دانش‌پژوه", "رضایت والدین"][index]
                          : ["Student satisfaction", "Parent satisfaction"][
                              index
                            ]}
                      </span>
                      <meter
                        min={0}
                        max={100}
                        value={Number(item[key])}
                        aria-label={
                          locale === "fa"
                            ? ["رضایت دانش‌پژوه", "رضایت والدین"][index]
                            : ["Student satisfaction", "Parent satisfaction"][
                                index
                              ]
                        }
                      />
                    </div>
                  ),
              )}
            </div>
            {local(item.achievementFa, item.achievementEn) && (
              <p className="testimonial-achievement">
                <PublicIcon name="honors" />
                {local(item.achievementFa, item.achievementEn)}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
