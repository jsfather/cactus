import "server-only";
import type { Metadata } from "next";
import { connection } from "next/server";
import type { Locale } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/seo/site";
import { getSiteNavigation } from "./navigation-server";

export async function getSiteMetadata(locale: Locale): Promise<Metadata> {
  await connection();
  const settings = await getSiteNavigation();
  const title = locale === "fa" ? settings.siteTitleFa : settings.siteTitleEn;
  const description =
    locale === "fa" ? settings.descriptionFa : settings.descriptionEn;
  return {
    metadataBase: getSiteUrl(),
    title: { default: title, template: `%s | ${title}` },
    description,
    verification: settings.googleVerification
      ? { google: settings.googleVerification }
      : undefined,
    icons: { icon: "/cactus-logo.svg" },
  };
}
