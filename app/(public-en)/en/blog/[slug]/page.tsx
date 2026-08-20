import { BlogPostPage } from "@/components/public/blog-post-page";

export default async function EnglishPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostPage locale="en" slug={slug} />;
}
