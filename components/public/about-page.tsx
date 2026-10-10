import { connection } from "next/server";
import { RichContent } from "@/components/content/rich-content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getSiteContent } from "@/lib/site-content/queries";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PageIntro, ClosingInvitation } from "./design";
import { Reveal } from "./public-motion";
export async function AboutPage({ locale }: { locale: Locale }) {
  await connection();
  const d = getDictionary(locale);
  const c = await getSiteContent();
  const local = (en: string | null, fa: string | null) =>
    locale === "en" ? en || fa || "" : fa || "";
  return (
    <div className="public-site">
      <SiteHeader locale={locale} currentPath="/about" />
      <main id="public-main">
        <PageIntro
          locale={locale}
          kind="about"
          index="07"
          eyebrow={
            locale === "fa"
              ? "کنجکاوی، نقطه شروع ماست"
              : "CURIOSITY IS OUR STARTING POINT"
          }
          title={d.aboutTitle}
          description={d.aboutDescription}
        />
        <section className="public-section public-wrap">
          <Reveal className="about-story">
            <div>
              <p className="public-kicker">
                {locale === "fa" ? "داستان کاکتوس" : "OUR STORY"}
              </p>
              <h2 className="mt-4">
                {locale === "fa"
                  ? "از ایده تا تجربه"
                  : "From ideas to experience"}
              </h2>
            </div>
            <div dir={locale === "en" && !c.aboutUsEn ? "rtl" : undefined}>
              <RichContent
                html={local(c.aboutUsEn, c.aboutUsFa)}
                className="text-lg"
              />
            </div>
          </Reveal>
        </section>
        <section className="public-section about-philosophy">
          <Reveal className="public-wrap about-philosophy-grid">
            {[
              [d.mission, c.missionEn, c.missionFa],
              [d.vision, c.visionEn, c.visionFa],
            ].map(([label, en, fa]) => (
              <article key={label}>
                <h2>{label}</h2>
                <div dir={locale === "en" && !en ? "rtl" : undefined}>
                  <RichContent html={local(en, fa || "")} />
                </div>
              </article>
            ))}
          </Reveal>
        </section>
        <section className="public-wrap public-section about-contact">
          <h2>{d.contact}</h2>
          <div className="contact-items">
            {c.contactNumber && (
              <ContactItem
                label={d.contactNumber}
                value={c.contactNumber}
                href={`tel:${c.contactNumber}`}
                ltr
              />
            )}
            {c.email && (
              <ContactItem
                label={d.email}
                value={c.email}
                href={`mailto:${c.email}`}
                ltr
              />
            )}
            {(c.addressFa || c.addressEn) && (
              <ContactItem
                label={d.address}
                value={local(c.addressEn, c.addressFa)}
              />
            )}
          </div>
        </section>
        <ClosingInvitation locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
function ContactItem({
  label,
  value,
  href,
  ltr = false,
}: {
  label: string;
  value: string;
  href?: string;
  ltr?: boolean;
}) {
  const children = (
    <>
      <span>{label}</span>
      <span dir={ltr ? "ltr" : undefined} className={ltr ? "nums-en" : ""}>
        {value}
      </span>
    </>
  );
  return href ? (
    <a className="contact-item" href={href}>
      {children}
    </a>
  ) : (
    <div className="contact-item">{children}</div>
  );
}
