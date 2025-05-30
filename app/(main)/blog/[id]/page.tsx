'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye, ThumbsUp, MessageCircle, Tag } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  avatar: string;
  isAuthor?: boolean;
}

interface RelatedPost {
  id: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  image: string;
}

const comments: Comment[] = [
  {
    id: '1',
    author: 'نازنین احمدی',
    content:
      'مقاله بسیار عالی و کاربردی بود. مخصوصاً بخش تکنیک پومودورو خیلی به من کمک کرد. ممنون از آکادمی کاکتوس',
    date: '۲ روز پیش',
    avatar: '/user-nazanin.jpg',
  },
  {
    id: '2',
    author: 'امیر محمدی',
    content: 'خوشحالم که براتون مفید بوده نازنین جان. موفق باشید',
    date: '۱ روز پیش',
    avatar: '/user-amirali.jpg',
    isAuthor: true,
  },
  {
    id: '3',
    author: 'رضا موسوی',
    content:
      'من تازه یادگیری برنامه‌نویسی رو شروع کردم. میشه لطفاً منابع بیشتری برای شروع معرفی کنید؟',
    date: '۱ هفته پیش',
    avatar: '/user-amirali.jpg',
  },
];

const relatedPosts: RelatedPost[] = [
  {
    id: '1',
    title: '۱۰ عادت برنامه‌نویسان حرفه‌ای',
    category: 'برنامه‌نویسی',
    tags: ['برنامه‌نویسی', 'تکنیک‌ها'],
    date: '۱۵ اردیبهشت ۱۴۰۲',
    readTime: '۸ دقیقه',
    image: '/blog-ai-robotics.png',
  },
  {
    id: '2',
    title: 'بهترین منابع رایگان یادگیری پایتون در ۲۰۲۳',
    category: 'پایتون',
    tags: ['پایتون', 'یادگیری'],
    date: '۲ خرداد ۱۴۰۲',
    readTime: '۶ دقیقه',
    image: '/blog-robotics-education.png',
  },
  {
    id: '3',
    title: 'مقایسه React و Vue در سال ۲۰۲۳',
    category: 'توسعه وب',
    tags: ['جاوااسکریپت', 'توسعه وب'],
    date: '۱۰ فروردین ۱۴۰۲',
    readTime: '۱۰ دقیقه',
    image: '/blog-robotics-projects.png',
  },
];

const popularTags = [
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

const categories = [
  { name: 'برنامه‌نویسی', count: 24 },
  { name: 'هوش مصنوعی', count: 18 },
  { name: 'علم داده', count: 12 },
  { name: 'توسعه وب', count: 21 },
  { name: 'توسعه موبایل', count: 9 },
];

export default function Page() {
  return (
    <div dir="rtl" className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <article className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Categories */}
            <div className="mb-6 flex flex-wrap gap-2">
              {['برنامه‌نویسی', 'یادگیری', 'تکنیک‌ها'].map((category) => (
                <Link
                  key={category}
                  href={`/blog/category/${category}`}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
                >
                  {category}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="mb-8 text-4xl font-bold">
              راهکارهای افزایش بهره‌وری در یادگیری برنامه‌نویسی
            </h1>

            {/* Featured Image */}
            <div className="relative mb-8 h-[400px] overflow-hidden rounded-2xl">
              <Image
                src="/blog-robotics-education.png"
                alt="راهکارهای افزایش بهره‌وری در یادگیری برنامه‌نویسی"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article Meta */}
            <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Image
                  src="/user-amirali.jpg"
                  alt="امیر محمدی"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span>امیر محمدی</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>زمان مطالعه: ۸ دقیقه</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>۱,۲۴۵ بازدید</span>
              </div>
              <time>۲۵ خرداد ۱۴۰۲</time>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="lead">
                یادگیری برنامه‌نویسی می‌تواند هم چالش‌برانگیز و هم بسیار لذت‌بخش
                باشد. بسیاری از افراد در مسیر یادگیری برنامه‌نویسی با مشکلاتی
                مانند عدم تمرکز، فراموشی مفاهیم و کاهش انگیزه مواجه می‌شوند. در
                این مقاله قصد داریم راهکارهای عملی و اثبات‌شده‌ای را برای افزایش
                بهره‌وری در یادگیری برنامه‌نویسی با شما به اشتراک بگذاریم.
              </p>

              <h2>۱. تعیین هدف مشخص</h2>
              <p>
                اولین و مهمترین قدم در یادگیری مؤثر برنامه‌نویسی، تعیین هدف مشخص
                است. آیا می‌خواهید وب‌سایت بسازید؟ اپلیکیشن موبایل توسعه دهید؟
                یا در حوزه هوش مصنوعی فعالیت کنید؟
              </p>
              <blockquote>
                بدون هدف مشخص، مانند کشتی‌ای بدون سکان هستید که در اقیانوس
                برنامه‌نویسی سرگردان خواهد شد.
              </blockquote>
              <p>پیشنهاد می‌کنیم:</p>
              <ul>
                <li>
                  اهداف خود را به صورت SMART تعیین کنید (خاص، قابل اندازه‌گیری،
                  قابل دستیابی، مرتبط و زمان‌بندی شده)
                </li>
                <li>اهداف بلندمدت را به اهداف کوتاه‌مدت تقسیم کنید</li>
                <li>پیشرفت خود را به صورت هفتگی ثبت و بررسی کنید</li>
              </ul>

              <h2>۲. تمرین روزانه و مستمر</h2>
              <p>
                برنامه‌نویسی مانند یادگیری یک زبان جدید است. برای تسلط یافتن،
                نیاز به تمرین مداوم دارید. تحقیقات نشان می‌دهد که تمرین روزانه
                ۳۰ دقیقه‌ای بسیار مؤثرتر از تمرین ۵ ساعته در یک روز است.
              </p>

              <h2>۳. پروژه‌محور یاد بگیرید</h2>
              <p>
                به جای صرفاً مطالعه مفاهیم تئوری، سعی کنید هر مفهوم جدیدی را در
                قالب یک پروژه کوچک پیاده‌سازی کنید. این کار به درک عمیق‌تر
                مفاهیم کمک می‌کند.
              </p>
              <p>برخی ایده‌های پروژه برای شروع:</p>
              <ul>
                <li>ماشین حساب ساده</li>
                <li>لیست کارهای روزانه</li>
                <li>سیستم مدیریت مخاطبین</li>
                <li>بازی حدس عدد</li>
              </ul>

              <h2>۴. استفاده از تکنیک پومودورو</h2>
              <p>
                تکنیک پومودورو یکی از مؤثرترین روش‌ها برای افزایش تمرکز و
                بهره‌وری است. در این روش:
              </p>
              <ul>
                <li>۲۵ دقیقه با تمرکز کامل کدنویسی کنید</li>
                <li>۵ دقیقه استراحت کنید</li>
                <li>این چرخه را ۴ بار تکرار کنید</li>
                <li>
                  پس از ۴ پومودورو، ۱۵-۳۰ دقیقه استراحت طولانی‌تر داشته باشید
                </li>
              </ul>

              <h2>۵. مشارکت در جامعه برنامه‌نویسان</h2>
              <p>
                عضویت در جامعه برنامه‌نویسان و مشارکت در بحث‌های تخصصی می‌تواند
                به رشد سریع‌تر شما کمک کند. برخی از راه‌های مشارکت:
              </p>
              <ul>
                <li>شرکت در رویدادهای برنامه‌نویسی (هکاتون، مسابقات)</li>
                <li>فعالیت در فروم‌ها و گروه‌های تخصصی</li>
                <li>همکاری در پروژه‌های اوپن‌سورس</li>
                <li>نوشتن مقالات آموزشی و اشتراک دانش</li>
              </ul>
            </div>

            {/* Article Tags */}
            <div className="my-8 flex flex-wrap gap-2">
              {[
                'برنامه‌نویسی',
                'یادگیری',
                'بهره‌وری',
                'تکنیک‌ها',
                'پومودورو',
              ].map((tag) => (
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

            {/* Article Rating */}
            <div className="mb-12 flex items-center gap-4 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
              <div className="text-center">
                <p className="mb-2 text-sm">
                  این مقاله را چگونه ارزیابی می‌کنید؟
                </p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm shadow-sm dark:bg-gray-700">
                    <ThumbsUp className="h-4 w-4" />
                    <span>۸۴</span>
                  </button>
                  <button className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm shadow-sm dark:bg-gray-700">
                    <MessageCircle className="h-4 w-4" />
                    <span>۳</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="mb-12 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
              <div className="flex items-start gap-4">
                <Image
                  src="/user-amirali.jpg"
                  alt="امیر محمدی"
                  width={80}
                  height={80}
                  className="rounded-xl"
                />
                <div>
                  <h3 className="mb-2 text-xl font-bold">امیر محمدی</h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    مدرس ارشد آکادمی کاکتوس با ۱۰ سال سابقه تدریس برنامه‌نویسی
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    امیر محمدی مدرس دوره‌های پیشرفته برنامه‌نویسی و مهندسی
                    نرم‌افزار در آکادمی کاکتوس است. او علاقه‌مند به اشتراک‌گذاری
                    دانش و تجربیات خود در زمینه‌های مختلف فناوری است.
                  </p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <section>
              <h2 className="mb-6 text-2xl font-bold">
                دیدگاه‌ها ({comments.length})
              </h2>
              <div className="space-y-6">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={comment.avatar}
                          alt={comment.author}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold">{comment.author}</h4>
                            {comment.isAuthor && (
                              <span className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full px-2 py-0.5 text-xs">
                                نویسنده
                              </span>
                            )}
                          </div>
                          <time className="text-sm text-gray-500 dark:text-gray-400">
                            {comment.date}
                          </time>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Comment Form */}
              <form className="mt-8 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
                <h3 className="mb-6 text-xl font-bold">دیدگاه شما</h3>
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm">نام *</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-200 p-3 dark:border-gray-700 dark:bg-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm">ایمیل *</label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-gray-200 p-3 dark:border-gray-700 dark:bg-gray-900"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="mb-2 block text-sm">دیدگاه شما *</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border border-gray-200 p-3 dark:border-gray-700 dark:bg-gray-900"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">
                      نام و ایمیل من را برای دفعات بعد ذخیره کن
                    </span>
                  </label>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 rounded-lg px-6 py-3 text-white">
                  ارسال دیدگاه
                </button>
              </form>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Search */}
            <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold">جستجو در وبلاگ</h2>
              <div className="relative">
                <input
                  type="search"
                  placeholder="جستجو..."
                  className="w-full rounded-lg border border-gray-200 p-3 dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
            </div>

            {/* Popular Posts */}
            <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold">مقالات پرطرفدار</h2>
              <div className="space-y-6">
                {relatedPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <div className="group m-1 flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-1 font-bold">
                          {post.title}
                        </h3>
                        <time className="text-sm text-gray-500 dark:text-gray-400">
                          {post.date}
                        </time>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold">دسته‌بندی‌ها</h2>
              <div className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/blog/category/${category.name}`}
                    className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center justify-between"
                  >
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold">برچسب‌ها</h2>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag}`}
                    className="rounded-full bg-white px-3 py-1 text-sm hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6 text-center">
              <h2 className="mb-4 text-xl font-bold">
                آماده شروع یادگیری هستید؟
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                به جمع ۵۰۰۰+ دانشجوی آکادمی کاکتوس بپیوندید
              </p>
              <Link
                href="/courses"
                className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 inline-block rounded-lg px-6 py-3 text-white"
              >
                مشاهده دوره‌ها
              </Link>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">مقالات مرتبط</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
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
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full px-3 py-1 text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2 text-xl font-bold">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <time>{post.date}</time>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
