import { BlogPostPage } from "@/components/public/blog-post-page";
import type { Metadata } from "next";
import { getPostMetadata } from "@/lib/blog/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return getPostMetadata("fa", (await params).slug);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostPage locale="fa" slug={slug} />;
}
