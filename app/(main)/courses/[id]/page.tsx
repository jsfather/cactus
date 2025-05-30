'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  Users,
  BookOpen,
  GraduationCap,
  BarChart,
} from 'lucide-react';

interface Instructor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface Schedule {
  day: string;
  time: string;
  duration: string;
}

const courseData = {
  title: 'دوره جامع برنامه‌نویسی پایتون',
  level: 'متوسط',
  price: '۲,۵۰۰,۰۰۰ تومان',
  duration: '۴۰ ساعت',
  students: '۱۲۵',
  schedule: [
    { day: 'شنبه', time: '۱۸:۰۰', duration: '۲ ساعت' },
    { day: 'سه‌شنبه', time: '۱۸:۰۰', duration: '۲ ساعت' },
  ],
  instructor: {
    id: '1',
    name: 'امیر محمدی',
    role: 'مدرس ارشد برنامه‌نویسی',
    avatar: '/user-amirali.jpg',
    bio: 'مدرس ارشد آکادمی کاکتوس با ۱۰ سال سابقه تدریس برنامه‌نویسی و متخصص در حوزه پایتون و هوش مصنوعی',
  },
  image: '/course-robot-vision.png',
  prerequisites: [
    'آشنایی مقدماتی با کامپیوتر',
    'داشتن لپ‌تاپ شخصی',
    'انگیزه بالا برای یادگیری',
  ],
  whatYouWillLearn: [
    'مفاهیم پایه و پیشرفته پایتون',
    'برنامه‌نویسی شی‌گرا',
    'کار با پایگاه داده',
    'توسعه وب با Django',
    'هوش مصنوعی و یادگیری ماشین',
  ],
};

export default function Page() {
  return (
    <div dir="rtl" className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <article className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title */}
            <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
              {courseData.title}
            </h1>

            {/* Featured Image */}
            <div className="relative mb-8 h-[400px] overflow-hidden rounded-2xl">
              <Image
                src={courseData.image}
                alt={courseData.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Course Meta */}
            <div className="mb-8 grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-6 md:grid-cols-3 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <BarChart className="text-primary-600 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    سطح دوره
                  </p>
                  <p className="font-bold">{courseData.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-primary-600 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    مدت دوره
                  </p>
                  <p className="font-bold">{courseData.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-primary-600 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    تعداد دانشجو
                  </p>
                  <p className="font-bold">{courseData.students} نفر</p>
                </div>
              </div>
            </div>

            {/* Course Schedule */}
            <div className="mb-8 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold">زمان‌بندی دوره</h2>
              <div className="space-y-4">
                {courseData.schedule.map((session, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Calendar className="text-primary-600 h-5 w-5" />
                    <span className="font-bold">{session.day}ها</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ساعت {session.time} به مدت {session.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Description */}
            <div className="prose prose-lg dark:prose-invert mb-8 max-w-none">
              <h2>توضیحات دوره</h2>
              <p>
                در این دوره جامع، شما با مفاهیم پایه و پیشرفته برنامه‌نویسی
                پایتون آشنا خواهید شد. از صفر تا صد پایتون را به همراه کاربردهای
                عملی آن خواهید آموخت.
              </p>

              <h3>پیش‌نیازهای دوره</h3>
              <ul>
                {courseData.prerequisites.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3>چه چیزهایی یاد خواهید گرفت</h3>
              <ul>
                {courseData.whatYouWillLearn.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Instructor Info */}
            <div className="mb-12 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold">مدرس دوره</h2>
              <div className="flex items-start gap-4">
                <Image
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  width={80}
                  height={80}
                  className="rounded-xl"
                />
                <div>
                  <h3 className="mb-2 text-xl font-bold">
                    {courseData.instructor.name}
                  </h3>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    {courseData.instructor.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {courseData.instructor.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
              <div className="mb-6 text-center">
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  قیمت دوره
                </p>
                <p className="text-primary-600 text-3xl font-bold">
                  {courseData.price}
                </p>
              </div>

              <div className="mb-6 space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-primary-600 h-5 w-5" />
                  <span>دسترسی به تمام جلسات</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="text-primary-600 h-5 w-5" />
                  <span>گواهینامه معتبر</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-primary-600 h-5 w-5" />
                  <span>پشتیبانی آنلاین</span>
                </div>
              </div>

              <button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 w-full rounded-lg px-6 py-3 text-center text-white transition-colors">
                ثبت‌نام در دوره
              </button>

              <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                ۷ روز ضمانت بازگشت وجه
              </p>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
