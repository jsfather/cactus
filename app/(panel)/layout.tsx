import type { Metadata } from "next";
import { AppFeedbackProvider } from "@/components/feedback/feedback-provider";
import { ThemeScript } from "@/components/theme/theme-script";
import { localeConfig } from "@/lib/i18n/config";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { vazirmatn } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "پنل کاکتوس",
    template: "%s | پنل کاکتوس",
  },
  robots: { index: false, follow: false },
  icons: { icon: "/cactus-logo.svg" },
};

export default async function PanelRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getPanelLocale();
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
      <body className={`${locale === "en" ? "nums-en" : ""} min-h-full bg-zinc-50 font-sans text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50`}>
        <AppFeedbackProvider locale={locale}>{children}</AppFeedbackProvider>
      </body>
    </html>
  );
}
