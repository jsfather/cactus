'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { UserMenu } from '@/app/ui/UserMenu';
import { useEffect, useState } from 'react';
import request from '@/app/lib/api/client';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  national_code: string | null;
  profile_picture: string | null;
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

        if (!token) {
          return;
        }

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
    <div dir="rtl" className="bg-gray-50 text-gray-900">
      {/* Header/Navbar */}
      <header
        className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white shadow-sm"
        style={{ height: 80 }}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="لوگو" width={56} height={56} />
            <span className="text-2xl font-bold tracking-tight text-green-700">
              کاکتوس
            </span>
          </div>
          <nav className="hidden gap-8 text-base md:flex">
            <Link href="#about" className="transition hover:text-green-600">
              درباره ما
            </Link>
            <Link href="#shop" className="transition hover:text-green-600">
              فروشگاه
            </Link>
            <Link href="#courses" className="transition hover:text-green-600">
              دوره‌های آموزشی
            </Link>
            <Link href="#blog" className="transition hover:text-green-600">
              بلاگ
            </Link>
            <Link href="#contact" className="transition hover:text-green-600">
              ارتباط با ما
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="rounded-md border border-gray-200 px-4 py-1 font-medium transition hover:bg-gray-100">
              EN
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو کنید"
                className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-sm focus:ring-2 focus:ring-green-100 focus:outline-none"
              />
              <span className="absolute top-1.5 left-2 text-gray-400">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-2-2" />
                </svg>
              </span>
            </div>
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200" />
            ) : user ? (
              <UserMenu userName={user.first_name + ' ' + user.last_name} />
            ) : (
              <Link href="/auth">
                <Button>ورود / ثبت نام</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative flex w-full items-center justify-center bg-gradient-to-b from-white to-gray-100"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        <Image
          src="/sample-hero.png"
          alt="hero"
          fill
          className="object-cover shadow-sm"
          style={{ zIndex: 1 }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"
          style={{ zIndex: 2 }}
        />
        <button
          className="bg-opacity-90 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-green-100 bg-white p-7 shadow transition hover:scale-110"
          style={{ zIndex: 3 }}
        >
          <svg
            width="56"
            height="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polygon points="9.5,7.5 16.5,12 9.5,16.5" fill="#16a34a" />
          </svg>
        </button>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto grid grid-cols-2 gap-8 py-14 text-center md:grid-cols-4">
        {stats.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-8 shadow-md transition-all duration-200 hover:shadow-sm"
          >
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 shadow">
              {item.icon}
            </div>
            <div className="text-3xl font-bold text-green-700">
              {item.value}
            </div>
            <div className="text-base font-medium text-gray-600">
              {item.label}
            </div>
          </div>
        ))}
      </section>

      {/* About Us Section */}
      <section id="about" className="container mx-auto py-14">
        <h2 className="mb-6 text-center text-3xl font-bold text-green-700">
          درباره ما
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-lg leading-8 text-gray-700">
          شرکت کاکتوس بیان گستر با شماره ثبت ۱۳۷۸، با برند کاکتوس در دو بخش فنی
          و مهندسی و دپارتمان الکترونیک در حال فعالیت می‌باشد... (متن نمونه)
        </p>
        <div className="flex flex-col justify-center gap-10 md:flex-row">
          {[1, 2, 3].map((v) => (
            <div
              key={v}
              className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-200 hover:shadow-2xl md:w-1/3"
            >
              <Image
                src="/sample-person.jpg"
                alt="video"
                fill
                className="object-cover"
              />
              <button className="bg-opacity-90 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-green-100 bg-white p-5 shadow-xl transition hover:scale-110">
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polygon points="9.5,7.5 16.5,12 9.5,16.5" fill="#16a34a" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Course Types Section */}
      <section id="courses" className="container mx-auto py-14">
        <h2 className="mb-10 text-center text-3xl font-bold text-green-700">
          دوره‌های آموزشی رایگان
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {courseTypes.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-10 shadow-md transition-all duration-200 hover:shadow-xl"
            >
              <div className="mb-2 text-xl font-bold text-green-700">
                {c.title}
              </div>
              <ul className="mb-2 space-y-1 text-base text-gray-600">
                {c.details.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
              <button className="w-full rounded-lg bg-green-600 py-2 text-base font-semibold text-white shadow transition hover:bg-green-700">
                ثبت نام دوره
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="container mx-auto py-14">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-green-700">فروشگاه</h2>
          <span className="text-lg font-semibold text-green-600">
            فروش ویژه
          </span>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-2">
          {shopBooks.map((book, i) => (
            <div
              key={i}
              className="flex max-w-[220px] min-w-[220px] flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-md transition-all duration-200 hover:shadow-xl"
            >
              <Image
                src={book.img}
                alt={book.title}
                width={160}
                height={200}
                className="mb-2 rounded-xl object-cover"
              />
              <div className="mb-1 text-lg font-bold text-green-700">
                {book.title}
              </div>
              <div className="mb-2 text-sm text-gray-500">
                {book.price} تومان
              </div>
              <button className="w-full rounded-lg bg-green-600 py-2 font-semibold text-white shadow transition hover:bg-green-700">
                افزودن به سبد خرید
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="container mx-auto py-14">
        <h2 className="mb-8 text-center text-3xl font-bold text-green-700">
          بلاگ کاکتوس
        </h2>
        <div className="flex gap-8 overflow-x-auto pb-2">
          {blogPosts.map((post, i) => (
            <div
              key={i}
              className="flex max-w-[320px] min-w-[320px] flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-200 hover:shadow-xl"
            >
              <Image
                src={post.img}
                alt={post.title}
                width={300}
                height={180}
                className="mb-2 rounded-xl object-cover"
              />
              <div className="mb-1 text-lg font-bold text-green-700">
                {post.title}
              </div>
              <div className="mb-2 text-sm text-gray-500">{post.excerpt}</div>
              <div className="flex justify-between text-sm text-green-700">
                <span className="cursor-pointer hover:underline">
                  مطالعه بیشتر
                </span>
                <span>{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-gray-200 bg-gray-100 pt-12 pb-4">
        <div className="container mx-auto flex flex-col items-center justify-between gap-10 md:flex-row">
          <div className="flex flex-col gap-2 text-base text-gray-700">
            <span>شماره تماس: ۰۹۱۲۳۴۵۶۷۸۹</span>
            <span>ایمیل: cactus@gmail.com</span>
            <span>آدرس: تهران، خیابان مثال</span>
            <div className="mt-2 flex gap-4">
              <a
                href="#"
                className="text-green-600 transition hover:text-green-800"
              >
                <i className="fab fa-instagram"></i>اینستاگرام
              </a>
              <a
                href="#"
                className="text-green-600 transition hover:text-green-800"
              >
                <i className="fab fa-telegram"></i>تلگرام
              </a>
            </div>
          </div>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="ایمیل خود را وارد کنید"
              className="rounded border border-gray-200 bg-white px-3 py-2 text-base focus:ring-2 focus:ring-green-100 focus:outline-none"
            />
            <button className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white shadow transition hover:bg-green-700">
              ارسال
            </button>
          </form>
          <div className="flex flex-col items-center gap-2">
            <Image src="/logo.png" alt="لوگو" width={56} height={56} />
            <span className="text-sm text-gray-500">
              کلیه حقوق متعلق به شرکت کاکتوس می‌باشد © ۱۴۰۳
            </span>
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

const blogPosts = [
  {
    title: 'عنوان مقاله...',
    excerpt: 'لورم ایپسوم متن ساختگی با تولید سادگی...',
    date: '۱۴۰۳/۰۲/۰۱',
    img: '/sample-blog.jpg',
  },
  {
    title: 'عنوان مقاله...',
    excerpt: 'لورم ایپسوم متن ساختگی با تولید سادگی...',
    date: '۱۴۰۳/۰۲/۰۲',
    img: '/sample-blog.jpg',
  },
  {
    title: 'عنوان مقاله...',
    excerpt: 'لورم ایپسوم متن ساختگی با تولید سادگی...',
    date: '۱۴۰۳/۰۲/۰۳',
    img: '/sample-blog.jpg',
  },
];
