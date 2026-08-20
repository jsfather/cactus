import type { Metadata } from "next";
import { vazirmatn } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "مدرسه رباتیک کاکتوس",
    template: "%s | کاکتوس",
  },
  description:
    "مدرسه رباتیک کاکتوس؛ آموزش پروژه‌محور رباتیک و برنامه‌نویسی برای کودکان و نوجوانان.",
};

export default function PersianPublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white font-sans dark:bg-zinc-950">
        {children}
      </body>
    </html>
  );
}
