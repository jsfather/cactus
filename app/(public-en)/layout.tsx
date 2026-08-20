import type { Metadata } from "next";
import { vazirmatn } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cactus Robotics School",
    template: "%s | Cactus",
  },
  description:
    "Project-based robotics and programming education for children and teenagers.",
};

export default function EnglishPublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="nums-en min-h-full bg-white font-sans dark:bg-zinc-950">
        {children}
      </body>
    </html>
  );
}
