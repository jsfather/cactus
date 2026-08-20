import { BlogPostPage } from "@/components/public/blog-post-page";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostPage locale="fa" slug={slug} />;
}
