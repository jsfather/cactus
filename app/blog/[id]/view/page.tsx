"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import BlogDetail from "../../../../components/blog/BlogDetail";

export default function ViewBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const blogId = parseInt(resolvedParams.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <BlogDetail blogId={blogId} onBack={() => router.push("/blog")} />
      </div>
    </div>
  );
}
