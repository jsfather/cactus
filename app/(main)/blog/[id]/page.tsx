'use client';

import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  Eye,
  Tag,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from 'lucide-react';
import { publicBlogService } from '@/app/lib/services/public-blog.service';
import { Blog, BlogComment } from '@/app/lib/types';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { useLocale } from '@/app/contexts/LocaleContext';
import { useUser } from '@/app/hooks/useUser';
import { toast } from 'react-toastify';
import { Button } from '@/app/components/ui/Button';
import Textarea from '@/app/components/ui/Textarea';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { t, dir } = useLocale();
  const { user } = useUser();
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [reactionLoading, setReactionLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

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

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) {
      toast.error('برای ثبت نظر باید وارد شوید');
      return;
    }

    try {
      setReactionLoading(true);
      const response = await publicBlogService.addReaction(resolvedParams.id, {
        type,
      });

      // Update local state
      if (blog) {
        setBlog({
          ...blog,
          likes_count: response.likes_count,
          dislikes_count: response.dislikes_count,
          user_reaction: response.user_reaction,
        });
      }

      if (response.status === 'removed') {
        toast.info('واکنش شما حذف شد');
      } else if (response.status === 'updated') {
        toast.success('واکنش شما بروزرسانی شد');
      } else {
        toast.success('واکنش شما ثبت شد');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در ثبت واکنش');
    } finally {
      setReactionLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('برای ارسال نظر باید وارد شوید');
      return;
    }

    if (!commentContent.trim()) {
      toast.error('لطفا محتوای نظر را وارد کنید');
      return;
    }

    try {
      setCommentLoading(true);
      const response = await publicBlogService.addComment(resolvedParams.id, {
        content: commentContent,
      });

      toast.success(
        'نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد'
      );
      setCommentContent('');

      // Refresh blog to get updated comments
      const updatedBlog = await publicBlogService.getById(resolvedParams.id);
      setBlog(updatedBlog.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در ارسال نظر');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!blog) {
    return (
      <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">مقاله یافت نشد</h1>
          <Link href="/blog" className="text-primary-600 mt-4 inline-block">
            {t.blog.backToList}
          </Link>
        </div>
      </div>
    );
  }

  const postTags = blog.tags
    .flatMap((tagString) => tagString.split(',').map((t) => t.trim()))
    .filter(Boolean);

  return (
    <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <article className="container mx-auto max-w-4xl px-4 py-12">
        <div>
          {/* Back Link */}
          <Link
            href="/blog"
            className="hover:text-primary-600 mb-6 inline-flex items-center text-sm text-gray-600 dark:text-gray-400"
          >
            ← {t.blog.backToList}
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
            <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
              {blog.description}
            </ReactMarkdown>
          </div>

          {/* Article Tags */}
          <div className="my-8 flex flex-wrap gap-2">
            {postTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tags=${encodeURIComponent(tag)}`}
                className="rounded-full bg-gray-100 px-4 py-1 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Tag className="mr-1 inline-block h-3 w-3" />
                {tag}
              </Link>
            ))}
          </div>

          {/* Reactions Section */}
          <div className="my-8 border-t border-gray-200 pt-8 dark:border-gray-700">
            <h3 className="mb-4 text-lg font-semibold">نظر شما چیست؟</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleReaction('like')}
                disabled={reactionLoading}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 transition-colors ${
                  blog.user_reaction === 'like'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <ThumbsUp
                  className={`h-5 w-5 ${blog.user_reaction === 'like' ? 'fill-current' : ''}`}
                />
                <span>پسندیدم</span>
                <span className="font-semibold">{blog.likes_count || 0}</span>
              </button>

              <button
                onClick={() => handleReaction('dislike')}
                disabled={reactionLoading}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 transition-colors ${
                  blog.user_reaction === 'dislike'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <ThumbsDown
                  className={`h-5 w-5 ${blog.user_reaction === 'dislike' ? 'fill-current' : ''}`}
                />
                <span>نپسندیدم</span>
                <span className="font-semibold">
                  {blog.dislikes_count || 0}
                </span>
              </button>
            </div>
            {!user && (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                برای ثبت واکنش ابتدا{' '}
                <Link href="/send-otp" className="text-primary-600 underline">
                  وارد شوید
                </Link>
              </p>
            )}
          </div>

          {/* Comments Section */}
          <div className="my-8 border-t border-gray-200 pt-8 dark:border-gray-700">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <MessageSquare className="h-6 w-6" />
              نظرات ({blog.comments?.length || 0})
            </h3>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <Textarea
                  id="comment"
                  label="نظر خود را بنویسید"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                  placeholder="نظر خود را درباره این مقاله بنویسید..."
                  required
                />
                <Button
                  type="submit"
                  disabled={commentLoading}
                  className="mt-4"
                >
                  {commentLoading ? 'در حال ارسال...' : 'ارسال نظر'}
                </Button>
              </form>
            ) : (
              <div className="mb-8 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">
                  برای ارسال نظر ابتدا{' '}
                  <Link
                    href="/send-otp"
                    className="text-primary-600 font-semibold underline"
                  >
                    وارد شوید
                  </Link>
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments
                  .filter((comment) => comment.approved)
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {comment.user?.profile_picture ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${comment.user.profile_picture}`}
                              alt={`${comment.user.first_name} ${comment.user.last_name}`}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">
                              {comment.user?.first_name}{' '}
                              {comment.user?.last_name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {comment.created_at}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                  هنوز نظری ثبت نشده است. اولین نفر باشید!
                </p>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
