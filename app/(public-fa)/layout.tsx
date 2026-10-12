import type { Metadata } from "next";
import { connection } from "next/server";
import { PublicSettingsProvider } from "@/components/public/public-settings-provider";
import { getSiteNavigation } from "@/lib/site-content/navigation-server";
import { getSiteAppearance } from "@/lib/site-content/appearance-server";
import { appearanceCss } from "@/lib/site-content/appearance";
import { LiveChat } from "@/components/support/live-chat";
import { AppFeedbackProvider } from "@/components/feedback/feedback-provider";
import { ThemeScript } from "@/components/theme/theme-script";
import { vazirmatn } from "../fonts";
import "../globals.css";
import "@/components/public/public.css";
import { getSiteMetadata } from "@/lib/site-content/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata("fa");
}

export default async function PersianPublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const [navigation, appearance] = await Promise.all([getSiteNavigation(), getSiteAppearance()]);
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
        <style>{appearanceCss(appearance)}</style>
      </head>
      <body className="min-h-full bg-white font-sans dark:bg-zinc-950">
        <PublicSettingsProvider loadingIconUrl={navigation.loadingIconUrl}><AppFeedbackProvider locale="fa">{children}<LiveChat locale="fa" /></AppFeedbackProvider></PublicSettingsProvider>
      </body>
    </html>
  );
}
