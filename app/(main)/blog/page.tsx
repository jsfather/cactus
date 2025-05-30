'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  readTime: string;
  category: string;
  tags: string[];
}

const categories = [
  { name: 'همه', count: 42 },
  { name: 'برنامه‌نویسی', count: 24 },
  { name: 'هوش مصنوعی', count: 18 },
  { name: 'علم داده', count: 12 },
  { name: 'توسعه وب', count: 21 },
  { name: 'توسعه موبایل', count: 9 },
];

const tags = [
  'پایتون',
  'جاوااسکریپت',
  'یادگیری ماشین',
  'React',
  'Django',
  'Node.js',
  'SQL',
  'NoSQL',
  'الگوریتم',
  'ساختار داده',
];

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'آینده رباتیک در آموزش',
    excerpt: 'کشف کنید چگونه رباتیک در حال تغییر چشم‌انداز آموزشی و آماده‌سازی دانش‌آموزان برای آینده است.',
    date: '۲۵ اسفند ۱۴۰۲',
    author: 'دکتر سارا چن',
    image: '/blog-robotics-education.png',
    readTime: '۵ دقیقه مطالعه',
    category: 'هوش مصنوعی',
    tags: ['رباتیک', 'آموزش', 'تکنولوژی'],
  },
  {
    id: '2',
    title: '۵ پروژه برتر رباتیک برای مبتدیان',
    excerpt: 'سفر خود در رباتیک را با این پروژه‌های جذاب و آموزشی مناسب برای مبتدیان آغاز کنید.',
    date: '۲۲ اسفند ۱۴۰۲',
    author: 'جیمز ویلسون',
    image: '/blog-robotics-projects.png',
    readTime: '۸ دقیقه مطالعه',
    category: 'برنامه‌نویسی',
    tags: ['رباتیک', 'پروژه', 'مبتدی'],
  },
  {
    id: '3',
    title: 'هوش مصنوعی و رباتیک: مشارکتی کامل',
    excerpt: 'بررسی کنید چگونه هوش مصنوعی در حال ارتقای قابلیت‌های رباتیک و ایجاد امکانات جدید است.',
    date: '۲۰ اسفند ۱۴۰۲',
    author: 'دکتر مایکل لی',
    image: '/blog-ai-robotics.png',
    readTime: '۶ دقیقه مطالعه',
    category: 'هوش مصنوعی',
    tags: ['هوش مصنوعی', 'رباتیک', 'تکنولوژی'],
  },
];

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'همه' || post.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => post.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pt-24 pb-16 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            وبلاگ
            <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
              {' '}کاکتوس
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            آخرین مقالات، آموزش‌ها و اخبار دنیای تکنولوژی
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 md:max-w-md">
              <input
                type="search"
                placeholder="جستجو در مقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pl-10 dark:border-gray-700 dark:bg-gray-800"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Filter className="h-5 w-5" />
              فیلترها
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Categories */}
              <div className="mb-4">
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">دسته‌بندی‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`rounded-full px-4 py-1 text-sm ${
                        selectedCategory === category.name
                          ? 'bg-primary-600 text-white dark:bg-primary-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">برچسب‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1 text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-primary-600 text-white dark:bg-primary-500'
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
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
            >
              <Link href={`/blog/${post.id}`}>
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full px-3 py-1 text-sm">
                      {post.category}
                    </span>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                    {post.title}
                  </h2>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{post.author}</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                    </div>
                    <time className="text-sm text-gray-500 dark:text-gray-400">{post.date}</time>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* No Results Message */}
        {filteredPosts.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              متأسفانه هیچ مقاله‌ای با معیارهای جستجوی شما یافت نشد.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}