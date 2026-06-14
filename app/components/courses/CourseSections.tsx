'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { publicBlogService } from '@/app/lib/services/public-blog.service';
import { Blog, CourseRecommendedTool } from '@/app/lib/types';
import { useLocale } from '@/app/contexts/LocaleContext';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

interface RelatedArticlesProps {
  tags: string[];
}

export function RelatedArticles({ tags }: RelatedArticlesProps) {
  const { t } = useLocale();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await publicBlogService.getList({
          tags: tags.length > 0 ? tags.join(',') : undefined,
        });
        setBlogs(response.data.slice(0, 3));
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [tags]);

  if (loading) return <LoadingSpinner />;
  if (!blogs.length) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t.courses.detail.relatedArticles}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.id}`}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="p-4">
              <h3 className="mb-2 font-bold text-gray-900 group-hover:text-primary-600 dark:text-white">
                {blog.title}
              </h3>
              <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                {blog.little_description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

interface RecommendedToolsProps {
  tools: CourseRecommendedTool[];
}

export function RecommendedTools({ tools }: RecommendedToolsProps) {
  const { t } = useLocale();

  if (!tools.length) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t.courses.detail.recommendedTools}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tools.map((tool, index) => (
          <a
            key={tool.id ?? index}
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:border-primary-300 dark:hover:border-primary-600 flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-colors dark:border-gray-700 dark:bg-gray-800"
          >
            <span className="text-3xl">{tool.icon || '🔧'}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {tool.name}
                </h3>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              {tool.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {tool.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

interface CourseVideoEmbedProps {
  title: string;
  videoUrl?: string;
}

export function CourseVideoEmbed({ title, videoUrl }: CourseVideoEmbedProps) {
  if (!videoUrl) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl">
        <div className="relative aspect-video w-full">
          <iframe
            src={videoUrl}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
