import type { Metadata } from "next";
import { HonorsPage } from "@/components/public/honors-page";

export const metadata: Metadata = { title: "افتخارات و گواهینامه‌ها", description: "افتخارات، جوایز و گواهینامه‌های مدرسه رباتیک کاکتوس." };
export default function PersianHonorsPage() { return <HonorsPage locale="fa" />; }
