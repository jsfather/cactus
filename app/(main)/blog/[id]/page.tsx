'use client';

import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye, Tag, User } from 'lucide-react';
import { publicBlogService } from '@/app/lib/services/public-blog.service';
import { Blog } from '@/app/lib/types';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import ReactMarkdown from 'react-markdown';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await publicBlogService.getById(resolvedParams.id);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [resolvedParams.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!blog) {
    return (
      <div dir="rtl" className="min-h-screen bg-white pt-20 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">مقاله یافت نشد</h1>
          <Link href="/blog" className="text-primary-600 mt-4 inline-block">
            بازگشت به لیست مقالات
          </Link>
        </div>
      </div>
    );
  }

  const postTags = blog.tags
    .flatMap((tagString) => tagString.split(',').map((t) => t.trim()))
    .filter(Boolean);

  return (
    <div dir="rtl" className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <article className="container mx-auto max-w-4xl px-4 py-12">
        <div>
          {/* Back Link */}
          <Link
            href="/blog"
            className="hover:text-primary-600 mb-6 inline-flex items-center text-sm text-gray-600 dark:text-gray-400"
          >
            ← بازگشت به لیست مقالات
          </Link>

          {/* Title */}
          <h1 className="mb-8 text-4xl font-bold">{blog.title}</h1>

          {/* Article Meta */}
          <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            {blog.user && (
              <div className="flex items-center gap-2">
                {blog.user.profile_picture ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${blog.user.profile_picture}`}
                    alt={`${blog.user.first_name} ${blog.user.last_name}`}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span>
                  {blog.user.first_name} {blog.user.last_name}
                </span>
              </div>
            )}
            <time>{blog.created_at}</time>
          </div>

          {/* Little Description */}
          <div className="mb-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {blog.little_description}
            </p>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{blog.description}</ReactMarkdown>
          </div>

          {/* Article Tags */}
          <div className="my-8 flex flex-wrap gap-2">
            {postTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="rounded-full bg-gray-100 px-4 py-1 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Tag className="mr-1 inline-block h-3 w-3" />
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
