'use client';

import Image from 'next/image';
import { Button } from '@/app/ui/button';
import { motion } from 'framer-motion';
import type { JSX } from 'react';
import Link from 'next/link';

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface Course {
  title: string;
  description: string;
  duration: string;
  level: string;
  image: string;
  price: string;
}

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  readTime: string;
}

export default function Page() {
  return (
    <div
      dir="rtl"
      className="min-h-screen p-4 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
    >
      <section className="px-4 pt-32 pb-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-5xl leading-tight font-bold">
                <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                  آینده رباتیک
                </span>
                <br />
                را با ما بسازید
              </h1>
              <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                با اساتید مجرب در حوزه رباتیک آموزش ببینید و با تجربه عملی با
                ربات‌های واقعی، به نسل آینده مبتکران بپیوندید.
              </p>
              <div className="flex gap-4">
                <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
                  شروع یادگیری
                </Button>
                <Button className="text-primary-600 dark:text-primary-400 rounded-full bg-gray-100 px-8 py-3 text-lg transition-all duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                  مشاهده دوره‌ها
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-8">
                {[
                  { number: '+۵۰۰', label: 'دانشجو' },
                  { number: '+۵۰', label: 'دوره' },
                  { number: '٪۹۵', label: 'رضایت' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative h-[500px] w-full group">
                <Image
                  src="/robot-video.png"
                  alt="آموزش رباتیک"
                  fill
                  className="rounded-2xl object-cover shadow-2xl dark:opacity-90"
                  priority
                />
                <div className="from-primary-600/20 dark:from-primary-900/30 absolute inset-0 rounded-2xl bg-gradient-to-tr to-transparent" />
                <button 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           w-16 h-16 bg-white/30 hover:bg-white/40 backdrop-blur-sm
                           rounded-full flex items-center justify-center
                           transition-all duration-300 ease-in-out
                           group-hover:scale-110"
                  aria-label="Play video"
                >
                  <svg 
                    className="w-8 h-8 text-white fill-current" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -right-6 -bottom-6 rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800 dark:shadow-gray-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 dark:bg-primary-900/20 flex h-12 w-12 items-center justify-center rounded-full">
                    <svg
                      className="text-primary-600 dark:text-primary-400 h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold dark:text-gray-100">
                      پروژه‌های عملی
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      یادگیری با تجربه
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -top-6 -left-6 rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800 dark:shadow-gray-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 dark:bg-primary-900/20 flex h-12 w-12 items-center justify-center rounded-full">
                    <svg
                      className="text-primary-600 dark:text-primary-400 h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold dark:text-gray-100">
                      مرکز نوآوری
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      خلق و نوآوری
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              چرا
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                مدرسه رباتیک ما
              </span>
              را انتخاب کنید؟
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              تجربه آموزش پیشرفته رباتیک با یادگیری عملی و راهنمایی متخصصان
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl bg-white p-8 shadow-lg transition-shadow duration-200 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70"
              >
                <div className="bg-primary-100 dark:bg-primary-900/20 mb-6 flex h-14 w-14 items-center justify-center rounded-xl">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-gray-50 py-24 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">
                درباره
                <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                  {' '}
                  کاکتوس
                </span>
              </h2>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                شرکت کاکتوس با بیش از یک دهه تجربه در زمینه آموزش رباتیک، پیشرو
                در ارائه خدمات آموزشی و تجهیزات رباتیک در ایران است. ما با تیمی
                متشکل از متخصصان و مدرسان مجرب، به دنبال گسترش دانش و مهارت‌های
                رباتیک در کشور هستیم.
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[
                  { title: 'تجربه', value: '+۱۰ سال' },
                  { title: 'پروژه‌های موفق', value: '+۲۰۰' },
                  { title: 'جوایز', value: '+۵۰' },
                  { title: 'همکاران', value: '+۳۰' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70"
                  >
                    <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
                      {item.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  'آموزش تخصصی',
                  'تجهیزات پیشرفته',
                  'پشتیبانی ۲۴/۷',
                  'گواهینامه معتبر',
                ].map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-48 overflow-hidden rounded-2xl">
                    <Image
                      src="/about-1.png"
                      alt="تصویر آموزش رباتیک"
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="h-64 overflow-hidden rounded-2xl">
                    <Image
                      src="/about-2.png"
                      alt="تصویر کارگاه رباتیک"
                      width={300}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="h-64 overflow-hidden rounded-2xl">
                    <Image
                      src="/about-3.png"
                      alt="تصویر آزمایشگاه رباتیک"
                      width={300}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="h-48 overflow-hidden rounded-2xl">
                    <Image
                      src="/about-4.png"
                      alt="تصویر دانشجویان رباتیک"
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute right-6 -bottom-6 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 dark:shadow-gray-900/50">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-100 dark:bg-primary-900/20 flex h-12 w-12 items-center justify-center rounded-full">
                    <svg
                      className="text-primary-600 dark:text-primary-400 h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold dark:text-gray-100">
                      گواهی‌نامه بین‌المللی
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      معتبر در سراسر دنیا
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="shop" className="py-24 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  فروشگاه
                  <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                    {' '}
                    کاکتوس
                  </span>
                </h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                  تجهیزات و کیت‌های آموزشی رباتیک
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="rounded-full bg-gray-100 px-6 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                  همه محصولات
                </button>
                <button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 rounded-full px-6 py-2 font-medium text-white transition-colors">
                  تخفیف‌دار
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'کیت آموزشی ربات مسیریاب',
                price: '۲,۵۰۰,۰۰۰',
                discount: '۲,۱۰۰,۰۰۰',
                image: '/product-1.jpg',
                category: 'کیت آموزشی',
                rating: 4.5,
                reviews: 28,
              },
              {
                title: 'بورد کنترلر آردوینو پرو',
                price: '۸۵۰,۰۰۰',
                discount: null,
                image: '/product-2.jpg',
                category: 'قطعات الکترونیکی',
                rating: 5,
                reviews: 42,
              },
              {
                title: 'ربات انسان‌نمای آموزشی',
                price: '۱۲,۰۰۰,۰۰۰',
                discount: '۱۰,۸۰۰,۰۰۰',
                image: '/product-3.jpg',
                category: 'ربات کامل',
                rating: 4.8,
                reviews: 16,
              },
              {
                title: 'سنسور فاصله‌سنج لیزری',
                price: '۹۵۰,۰۰۰',
                discount: null,
                image: '/product-4.jpg',
                category: 'سنسور',
                rating: 4.2,
                reviews: 35,
              },
            ].map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl bg-white p-4 shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70"
              >
                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110 dark:opacity-90"
                  />
                  {product.discount && (
                    <div className="absolute top-2 left-2 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white dark:bg-red-600">
                      تخفیف
                    </div>
                  )}
                  <button className="absolute right-2 bottom-2 rounded-full bg-white/90 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800">
                    <svg
                      className="text-primary-600 dark:text-primary-400 h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                    {product.category}
                  </div>
                  <h3 className="font-bold dark:text-gray-100">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 dark:text-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discount ? (
                        <>
                          <span className="text-primary-600 dark:text-primary-400 text-lg font-bold">
                            {product.discount}
                          </span>
                          <span className="mr-2 text-sm text-gray-500 line-through dark:text-gray-400">
                            {product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-primary-600 dark:text-primary-400 text-lg font-bold">
                          {product.price}
                        </span>
                      )}
                      <span className="mr-1 text-sm text-gray-600 dark:text-gray-300">
                        تومان
                      </span>
                    </div>
                    <button className="text-primary-600 dark:text-primary-400 rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                      جزئیات
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
              مشاهده همه محصولات
            </Button>
          </div>
        </div>
      </section>

      <section id="courses" className="py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              دوره‌های
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                ویژه
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              سفر خود را در دنیای رباتیک با محبوب‌ترین دوره‌های ما آغاز کنید
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70"
              >
                <div className="relative h-48">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover dark:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute right-4 bottom-4 left-4">
                    <span className="bg-primary-600 dark:bg-primary-700 rounded-full px-3 py-1 text-sm text-white">
                      {course.level}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold dark:text-gray-100">
                    {course.title}
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {course.duration}
                    </span>
                    <span className="text-primary-600 dark:text-primary-400 font-bold">
                      {course.price} تومان
                    </span>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <button className="text-primary-600 dark:text-primary-400 w-full rounded-xl bg-gray-100 py-2 font-semibold transition duration-200 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                    اطلاعات بیشتر
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/courses">
            <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
              مشاهده همه دوره‌ها
            </Button></Link>
          </div>
        </div>
      </section>

      <section id="blog" className="bg-gray-50 py-24 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              آخرین مطالب
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                بلاگ
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              از آخرین اخبار و بینش‌ها در دنیای رباتیک مطلع شوید
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70"
              >
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover dark:opacity-90"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {post.date}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      •
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold dark:text-gray-100">
                    {post.title}
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      نویسنده: {post.author}
                    </span>
                    <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                      ادامه مطلب ←
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
              مشاهده همه مقالات
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

const blogPosts: BlogPost[] = [
  {
    title: 'آینده رباتیک در آموزش',
    excerpt:
      'کشف کنید چگونه رباتیک در حال تغییر چشم‌انداز آموزشی و آماده‌سازی دانش‌آموزان برای آینده است.',
    date: '۲۵ اسفند ۱۴۰۲',
    author: 'دکتر سارا چن',
    image: '/blog-robotics-education.png',
    readTime: '۵ دقیقه مطالعه',
  },
  {
    title: '۵ پروژه برتر رباتیک برای مبتدیان',
    excerpt:
      'سفر خود در رباتیک را با این پروژه‌های جذاب و آموزشی مناسب برای مبتدیان آغاز کنید.',
    date: '۲۲ اسفند ۱۴۰۲',
    author: 'جیمز ویلسون',
    image: '/blog-robotics-projects.png',
    readTime: '۸ دقیقه مطالعه',
  },
  {
    title: 'هوش مصنوعی و رباتیک: مشارکتی کامل',
    excerpt:
      'بررسی کنید چگونه هوش مصنوعی در حال ارتقای قابلیت‌های رباتیک و ایجاد امکانات جدید است.',
    date: '۲۰ اسفند ۱۴۰۲',
    author: 'دکتر مایکل لی',
    image: '/blog-ai-robotics.png',
    readTime: '۶ دقیقه مطالعه',
  },
];

const features: Feature[] = [
  {
    title: 'یادگیری عملی',
    description:
      'کار با ربات‌های واقعی و کسب تجربه عملی در امکانات پیشرفته ما.',
    icon: (
      <svg
        className="text-primary-600 h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    title: 'اساتید متخصص',
    description:
      'یادگیری از متخصصان صنعت با سال‌ها تجربه در زمینه رباتیک و اتوماسیون.',
    icon: (
      <svg
        className="text-primary-600 h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    title: 'یادگیری پروژه محور',
    description:
      'ساخت نمونه کار با پروژه‌های دنیای واقعی و نمایش مهارت‌های خود به کارفرمایان بالقوه.',
    icon: (
      <svg
        className="text-primary-600 h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: 'پشتیبانی شغلی',
    description:
      'راهنمایی در فرصت‌های شغلی و ارتباط با شرکای صنعتی ما برای کاریابی.',
    icon: (
      <svg
        className="text-primary-600 h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: 'یادگیری انعطاف‌پذیر',
    description:
      'انتخاب از بین فرمت‌های مختلف دوره شامل آنلاین، ترکیبی و آموزش حضوری.',
    icon: (
      <svg
        className="text-primary-600 h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: 'آزمایشگاه نوآوری',
    description:
      'دسترسی به آزمایشگاه پیشرفته رباتیک مجهز به جدیدترین فناوری ها و ابزارها.',
    icon: (
      <svg
        className="text-primary-600 h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
];

const courses: Course[] = [
  {
    title: 'مبانی رباتیک',
    description:
      'آشنایی با اصول اولیه رباتیک، شامل مکانیک، الکترونیک و برنامه‌نویسی.',
    duration: '۸ هفته',
    level: 'مبتدی',
    image: '/course-robotics-intro.png',
    price: '۲,۹۹۰,۰۰۰',
  },
  {
    title: 'برنامه‌نویسی پیشرفته ربات',
    description:
      'تسلط بر مفاهیم پیچیده برنامه‌نویسی و الگوریتم‌ها برای ربات‌های خودکار.',
    duration: '۱۲ هفته',
    level: 'پیشرفته',
    image: '/course-robot-programming.png',
    price: '۴,۹۹۰,۰۰۰',
  },
  {
    title: 'سیستم‌های بینایی ربات',
    description:
      'بررسی تکنیک‌های بینایی کامپیوتر و پیاده‌سازی پردازش تصویر در ربات‌ها.',
    duration: '۱۰ هفته',
    level: 'متوسط',
    image: '/course-robot-vision.png',
    price: '۳,۹۹۰,۰۰۰',
  },
];
