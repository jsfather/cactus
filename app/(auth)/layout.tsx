import type { Metadata } from "next";
import { AppFeedbackProvider } from "@/components/feedback/feedback-provider";
import { ThemeScript } from "@/components/theme/theme-script";
import { vazirmatn } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "ورود | کاکتوس",
  description: "ورود به پنل مدرسه رباتیک کاکتوس",
  icons: { icon: "/cactus-logo.svg" },
};

export default function AuthRootLayout({
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
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <AppFeedbackProvider locale="fa">{children}</AppFeedbackProvider>
      </body>
    </html>
  );
}
