import type { Metadata } from "next";
import { AppFeedbackProvider } from "@/components/feedback/feedback-provider";
import { ThemeScript } from "@/components/theme/theme-script";
import { vazirmatn } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "مدرسه رباتیک کاکتوس",
    template: "%s | کاکتوس",
  },
  description:
    "مدرسه رباتیک کاکتوس؛ آموزش پروژه‌محور رباتیک و برنامه‌نویسی برای کودکان و نوجوانان.",
  icons: { icon: "/cactus-logo.svg" },
};

export default function PersianPublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
      </head>
      <body className="min-h-full bg-white font-sans dark:bg-zinc-950">
        <AppFeedbackProvider locale="fa">{children}</AppFeedbackProvider>
      </body>
    </html>
  );
}
