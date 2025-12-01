'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, User, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { publicBlogService } from '@/app/lib/services/public-blog.service';
import { Blog } from '@/app/lib/types';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useLocale } from '@/app/contexts/LocaleContext';

function BlogContent() {
  const { t, dir } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params
  const initialTag = searchParams.get('tags') || '';
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTag ? [initialTag] : []
  );
  const [showFilters, setShowFilters] = useState(!!initialTag);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await publicBlogService.getTags();
        setAllTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await publicBlogService.getList({
          search: searchQuery || undefined,
          tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
        });
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [searchQuery, selectedTags]);

  // Update URL when search query changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
      
      const queryString = params.toString();
      const newPath = `/blog${queryString ? `?${queryString}` : ''}`;
      
      // Only update if path is different
      if (window.location.pathname + window.location.search !== newPath) {
        router.replace(newPath, { scroll: false });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedTags, router]);

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);

    // Update URL
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (newTags.length > 0) params.set('tags', newTags.join(','));

    const queryString = params.toString();
    router.push(`/blog${queryString ? `?${queryString}` : ''}`, {
      scroll: false,
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    router.push('/blog', { scroll: false });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-20 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold">
              {t.blog.title}
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                {t.common.siteName}
              </span>
            </h1>
            <p className="mb-12 text-xl text-gray-600 dark:text-gray-300">
              {t.blog.description}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="relative flex-1 md:max-w-md">
                <input
                  type="search"
                  placeholder={t.blog.searchPlaceholder || t.common.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pl-10 dark:border-gray-700 dark:bg-gray-800"
                />
                <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTags.length > 0
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="h-5 w-5" />
                {t.common.filter}
                {selectedTags.length > 0 && (
                  <span className="bg-primary-600 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                    {selectedTags.length}
                  </span>
                )}
              </button>
            </div>

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  فیلتر برچسب:
                </span>
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="rounded-full p-0.5 transition-colors hover:bg-blue-200 dark:hover:bg-blue-800"
                      aria-label={`حذف فیلتر ${tag}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  پاک کردن همه
                </button>
              </div>
            )}

            {/* Filters Panel */}
            {showFilters && allTags.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Tags */}
                <div>
                  <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                    {t.blog.tags}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full px-3 py-1 text-sm ${
                          selectedTags.includes(tag)
                            ? 'bg-primary-600 dark:bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post, index) => {
              const postTags = post.tags
                .flatMap((tagString) =>
                  tagString.split(',').map((t) => t.trim())
                )
                .filter(Boolean);

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 relative h-48 bg-gradient-to-br">
                      <div className="text-primary-600 dark:text-primary-300 flex h-full items-center justify-center">
                        <svg
                          className="h-16 w-16 opacity-50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {postTags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {postTags.length > 3 && (
                          <span className="text-sm text-gray-500">
                            +{postTags.length - 3}
                          </span>
                        )}
                      </div>
                      <h2 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2 text-xl font-bold text-gray-900 dark:text-white">
                        {post.title}
                      </h2>
                      <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300">
                        {post.little_description}
                      </p>
                      <div className="mb-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                        {post.user && (
                          <div className="flex items-center gap-2">
                            {post.user.profile_picture ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${post.user.profile_picture}`}
                                alt={`${post.user.first_name} ${post.user.last_name}`}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            ) : (
                              <User className="h-5 w-5 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {post.user.first_name} {post.user.last_name}
                            </span>
                          </div>
                        )}
                        <time className="text-sm text-gray-500 dark:text-gray-400">
                          {post.created_at}
                        </time>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                          <ThumbsDown className="h-4 w-4" />
                          <span>{post.dislikes_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>

          {/* No Results Message */}
          {blogs.length === 0 && !loading && (
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t.blog.noPosts}
              </p>
              {(selectedTags.length > 0 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 mt-4 inline-flex items-center gap-1 text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  پاک کردن فیلترها
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BlogContent />
    </Suspense>
  );
}
