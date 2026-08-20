import type { Metadata } from "next";
import { ThemeScript } from "@/components/theme/theme-script";
import { vazirmatn } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cactus Robotics School",
    template: "%s | Cactus",
  },
  description:
    "Project-based robotics and programming education for children and teenagers.",
  icons: { icon: "/cactus-logo.svg" },
};

export default function EnglishPublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="nums-en min-h-full bg-white font-sans dark:bg-zinc-950">
        {children}
      </body>
    </html>
  );
}
