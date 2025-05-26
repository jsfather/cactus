'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { UserMenu } from '@/app/ui/UserMenu';
import { useEffect, useState } from 'react';
import request from '@/app/lib/api/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { JSX } from 'react';

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  national_code: string | null;
  profile_picture: string | null;
}

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const data = await request<{ data: UserProfile }>('profile');
        setUser(data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error instanceof Error && error.message.includes('401')) {
          localStorage.removeItem('authToken');
          router.push('/auth/send-otp');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  return (
    <div
      dir="rtl"
      className="text-primary-900 min-h-screen bg-gradient-to-b from-gray-50 to-white p-4"
    >
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto h-20 px-4">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src="/logo.png"
                    alt="لوگو کاکتوس"
                    width={48}
                    height={48}
                    className="rounded-xl"
                  />
                </motion.div>
                <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
                  کاکتوس
                </span>
              </Link>

              <nav className="hidden items-center gap-6 md:flex">
                {[
                  { title: 'دوره‌ها', href: 'courses' },
                  { title: 'فروشگاه', href: 'shop' },
                  { title: 'بلاگ', href: 'blog' },
                  { title: 'درباره ما', href: 'about' },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={`#${item.href}`}
                    className="hover:text-primary-600 font-medium text-gray-600 transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="جستجو ..."
                  className="focus:ring-primary-500 w-64 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                />
                <span className="absolute top-2.5 left-3 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
              </div>

              {loading ? (
                <div className="h-10 w-32 animate-pulse rounded-full bg-gray-200" />
              ) : user ? (
                <UserMenu userName={user.first_name + ' ' + user.last_name} />
              ) : (
                <Link href="/auth">
                  <Button className="bg-primary-600 hover:bg-primary-700 transform rounded-full px-6 py-2 text-white transition-all duration-200 hover:scale-105">
                    ورود / ثبت نام
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
              <p className="text-xl leading-relaxed text-gray-600">
                با اساتید مجرب در حوزه رباتیک آموزش ببینید و با تجربه عملی با
                ربات‌های واقعی، به نسل آینده مبتکران بپیوندید.
              </p>
              <div className="flex gap-4">
                <Button className="bg-primary-600 hover:bg-primary-700 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
                  شروع یادگیری
                </Button>
                <Button className="text-primary-600 rounded-full bg-gray-100 px-8 py-3 text-lg transition-all duration-200 hover:bg-gray-200">
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
                    <div className="text-primary-600 text-2xl font-bold">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
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
              <div className="relative h-[500px] w-full">
                <Image
                  src="/robotic-school.png"
                  alt="آموزش رباتیک"
                  fill
                  className="rounded-2xl object-cover shadow-2xl"
                  priority
                />
                <div className="from-primary-600/20 absolute inset-0 rounded-2xl bg-gradient-to-tr to-transparent" />
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -right-6 -bottom-6 rounded-xl bg-white p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 flex h-12 w-12 items-center justify-center rounded-full">
                    <svg
                      className="text-primary-600 h-6 w-6"
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
                    <div className="font-semibold">پروژه‌های عملی</div>
                    <div className="text-sm text-gray-500">
                      یادگیری با تجربه
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -top-6 -left-6 rounded-xl bg-white p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 flex h-12 w-12 items-center justify-center rounded-full">
                    <svg
                      className="text-primary-600 h-6 w-6"
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
                    <div className="font-semibold">مرکز نوآوری</div>
                    <div className="text-sm text-gray-500">خلق و نوآوری</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
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
            <p className="text-lg text-gray-600">
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
                className="rounded-2xl bg-white p-8 shadow-lg transition-shadow duration-200 hover:shadow-xl"
              >
                <div className="bg-primary-100 mb-6 flex h-14 w-14 items-center justify-center rounded-xl">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-gray-50 py-24">
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
              <p className="text-lg leading-relaxed text-gray-600">
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
                    className="rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="text-primary-600 text-2xl font-bold">
                      {item.value}
                    </div>
                    <div className="text-gray-600">{item.title}</div>
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
                    className="bg-primary-100 text-primary-600 rounded-full px-4 py-2 text-sm font-medium"
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
              <div className="absolute right-6 -bottom-6 rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-100 flex h-12 w-12 items-center justify-center rounded-full">
                    <svg
                      className="text-primary-600 h-6 w-6"
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
                    <div className="font-bold">گواهی‌نامه بین‌المللی</div>
                    <div className="text-sm text-gray-500">
                      معتبر در سراسر دنیا
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="shop" className="py-24">
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
                <p className="mt-2 text-lg text-gray-600">
                  تجهیزات و کیت‌های آموزشی رباتیک
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="rounded-full bg-gray-100 px-6 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-200">
                  همه محصولات
                </button>
                <button className="bg-primary-600 hover:bg-primary-700 rounded-full px-6 py-2 font-medium text-white transition-colors">
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
                className="group rounded-2xl bg-white p-4 shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {product.discount && (
                    <div className="absolute top-2 left-2 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                      تخفیف
                    </div>
                  )}
                  <button className="absolute right-2 bottom-2 rounded-full bg-white/90 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white">
                    <svg
                      className="text-primary-600 h-6 w-6"
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
                  <div className="text-primary-600 text-sm font-medium">
                    {product.category}
                  </div>
                  <h3 className="font-bold">{product.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discount ? (
                        <>
                          <span className="text-primary-600 text-lg font-bold">
                            {product.discount}
                          </span>
                          <span className="mr-2 text-sm text-gray-500 line-through">
                            {product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-primary-600 text-lg font-bold">
                          {product.price}
                        </span>
                      )}
                      <span className="mr-1 text-sm text-gray-600">تومان</span>
                    </div>
                    <button className="text-primary-600 rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium transition-colors hover:bg-gray-200">
                      جزئیات
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-primary-600 hover:bg-primary-700 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
              مشاهده همه محصولات
            </Button>
          </div>
        </div>
      </section>

      <section id="courses" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              دوره‌های
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                ویژه
              </span>
            </h2>
            <p className="text-lg text-gray-600">
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
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl"
              >
                <div className="relative h-48">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute right-4 bottom-4 left-4">
                    <span className="bg-primary-600 rounded-full px-3 py-1 text-sm text-white">
                      {course.level}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold">{course.title}</h3>
                  <p className="mb-4 text-gray-600">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {course.duration}
                    </span>
                    <span className="text-primary-600 font-bold">
                      {course.price} تومان
                    </span>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <button className="text-primary-600 w-full rounded-xl bg-gray-100 py-2 font-semibold transition duration-200 hover:bg-gray-200">
                    اطلاعات بیشتر
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-primary-600 hover:bg-primary-700 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
              مشاهده همه دوره‌ها
            </Button>
          </div>
        </div>
      </section>

      <section id="blog" className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              آخرین مطالب
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                بلاگ
              </span>
            </h2>
            <p className="text-lg text-gray-600">
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
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl"
              >
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{post.title}</h3>
                  <p className="mb-4 text-gray-600">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      نویسنده: {post.author}
                    </span>
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      ادامه مطلب ←
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-primary-600 hover:bg-primary-700 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
              مشاهده همه مقالات
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="rounded-lg bg-gray-900 px-4 py-12 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-6 flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="لوگو کاکتوس"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-white">کاکتوس</span>
              </div>
              <p className="mb-6 text-gray-400">
                توانمندسازی نسل آینده مهندسان رباتیک از طریق آموزش پیشرفته و
                تجربه عملی با تجهیزات مدرن.
              </p>
              <div className="flex gap-4">
                {[
                  { name: 'توییتر', link: 'twitter' },
                  { name: 'فیسبوک', link: 'facebook' },
                  { name: 'لینکدین', link: 'linkedin' },
                  { name: 'اینستاگرام', link: 'instagram' },
                ].map((social) => (
                  <a
                    key={social.link}
                    href={`#${social.link}`}
                    className="text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="sr-only">{social.name}</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">
                دسترسی سریع
              </h3>
              <ul className="space-y-3">
                {[
                  { title: 'درباره ما', href: 'about' },
                  { title: 'دوره‌ها', href: 'courses' },
                  { title: 'وبلاگ', href: 'blog' },
                  { title: 'تماس با ما', href: 'contact' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={`#${link.href}`}
                      className="transition-colors duration-200 hover:text-white"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">
                اطلاعات تماس
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>info@cactus.ir</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>تهران، خیابان آزادی، پلاک ۱۲۳</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">خبرنامه</h3>
              <p className="mb-4 text-gray-400">
                برای دریافت آخرین اخبار و تخفیف‌های ویژه در خبرنامه ما عضو شوید.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="ایمیل خود را وارد کنید"
                  className="focus:ring-primary-500 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-right focus:border-transparent focus:ring-2 focus:outline-none"
                />
                <button className="bg-primary-600 hover:bg-primary-700 w-full rounded-lg py-2 font-medium text-white transition duration-200">
                  عضویت در خبرنامه
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} کاکتوس. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sample Data
const stats = [
  {
    value: '۱۲۰',
    label: 'فارغ‌التحصیل',
    icon: (
      <svg
        className="h-7 w-7 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422A12.083 12.083 0 0121 13.5c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5c0-.538.214-1.05.84-1.922L12 14z" />
      </svg>
    ),
  },
  {
    value: '۴۳۵',
    label: 'دانش‌آموز',
    icon: (
      <svg
        className="h-7 w-7 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21v-2a4.5 4.5 0 019 0v2" />
      </svg>
    ),
  },
  {
    value: '۳',
    label: 'دوره آموزشی',
    icon: (
      <svg
        className="h-7 w-7 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4" />
      </svg>
    ),
  },
  {
    value: '۱۷',
    label: 'استاد مدرس',
    icon: (
      <svg
        className="h-7 w-7 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M6 21v-2a4 4 0 018 0v2" />
      </svg>
    ),
  },
];

const courseTypes = [
  {
    title: 'دوره‌های پروژه محور',
    details: ['طول دوره: ۲ ماه', 'ساعات: ۴۰ جلسه / ۸۰ ساعت'],
  },
  {
    title: 'دوره‌های تکمیل ظرفیت',
    details: ['طول دوره: ۱ ماه', 'ساعات: ۲۰ جلسه / ۴۰ ساعت'],
  },
  {
    title: 'دوره‌های ترکیبی',
    details: ['طول دوره: ۱.۵ ماه', 'ساعات: ۳۰ جلسه / ۶۰ ساعت'],
  },
];

const shopBooks = [
  { title: 'عنوان کتاب', price: '۵۰۰,۰۰۰', img: '/sample-book.jpg' },
  { title: 'عنوان کتاب', price: '۵۰۰,۰۰۰', img: '/sample-book.jpg' },
  { title: 'عنوان کتاب', price: '۵۰۰,۰۰۰', img: '/sample-book.jpg' },
  { title: 'عنوان کتاب', price: '۵۰۰,۰۰۰', img: '/sample-book.jpg' },
];

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
