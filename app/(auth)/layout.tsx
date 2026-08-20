import type { Metadata } from "next";
import { AppFeedbackProvider } from "@/components/feedback/feedback-provider";
import { ThemeScript } from "@/components/theme/theme-script";
import { getAuthDictionary } from "@/lib/i18n/auth";
import { localeConfig } from "@/lib/i18n/config";
import { getPreferredLocale } from "@/lib/i18n/server";
import { vazirmatn } from "../fonts";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = getAuthDictionary(await getPreferredLocale());

  return {
    title: dictionary.metadataTitle,
    description: dictionary.metadataDescription,
    icons: { icon: "/cactus-logo.svg" },
  };
}

export default async function AuthRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getPreferredLocale();
  const config = localeConfig[locale];

  return (
    <html
      lang={config.lang}
      dir={config.dir}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className={`${locale === "en" ? "nums-en" : ""} min-h-full bg-zinc-50 font-sans text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50`}>
        <AppFeedbackProvider locale={locale}>{children}</AppFeedbackProvider>
      </body>
    </html>
  );
}
