import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/public/blog-index-page";

export const metadata: Metadata = {
  title: "وبلاگ",
  description: "خبرها، تجربه‌ها و نوشته‌های مدرسه رباتیک کاکتوس.",
};

export default function BlogPage() {
  return <BlogIndexPage locale="fa" />;
}
