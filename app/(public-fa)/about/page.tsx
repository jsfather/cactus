import type { Metadata } from "next";
import { AboutPage } from "@/components/public/about-page";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "داستان، ماموریت، چشم‌انداز و راه‌های ارتباطی مدرسه رباتیک کاکتوس.",
};

export default function Page() { return <AboutPage locale="fa" />; }
