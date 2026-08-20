import type { Metadata } from "next";
import { vazirmatn } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "ورود | کاکتوس",
  description: "ورود به پنل مدرسه رباتیک کاکتوس",
};

export default function AuthRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        {children}
      </body>
    </html>
  );
}
