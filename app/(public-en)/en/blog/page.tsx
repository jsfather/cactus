import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/public/blog-index-page";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, stories, and learning experiences from Cactus Robotics School.",
};

export default function EnglishBlogPage() {
  return <BlogIndexPage locale="en" />;
}
