import type { Metadata } from "next";
import { ThemeScript } from "@/components/theme/theme-script";
import { vazirmatn } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "پنل کاکتوس",
    template: "%s | پنل کاکتوس",
  },
  robots: { index: false, follow: false },
};

export default function PanelRootLayout({
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
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">
        {children}
      </body>
    </html>
  );
}
