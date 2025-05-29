'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Calendar, Star, Users, BookOpen } from 'lucide-react';
import { Button } from '@/app/ui/button';

interface Skill {
  name: string;
  percentage: number;
}

interface Course {
  title: string;
  startDate: string;
  status: 'ongoing' | 'open' | 'closed';
  students: number;
  image: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  degree: string;
  university: string;
  period: string;
  description?: string;
}

interface Review {
  name: string;
  course: string;
  year: string;
  content: string;
  avatar: string;
}

const mainSkills: Skill[] = [
  { name: 'یادگیری ماشین', percentage: 95 },
  { name: 'یادگیری عمیق', percentage: 90 },
  { name: 'پردازش زبان طبیعی', percentage: 85 },
  { name: 'پایتون', percentage: 98 },
];

const otherSkills = [
  'TensorFlow',
  'PyTorch',
  'Keras',
  'Scikit-learn',
  'NLP',
  'Computer Vision',
];

const courses: Course[] = [
  {
    title: 'یادگیری عمیق پیشرفته',
    startDate: '15 مرداد 1402',
    status: 'ongoing',
    students: 45,
    image: '/course-deep-learning.webp',
  },
  {
    title: 'پردازش زبان طبیعی با پایتون',
    startDate: '1 شهریور 1402',
    status: 'open',
    students: 32,
    image: '/course-nlp.jpg',
  },
];

const experiences: Experience[] = [
  {
    title: 'مدرس ارشد هوش مصنوعی',
    company: 'آکادمی کاکتوس',
    period: '1399 تاکنون',
    description:
      'تدریس دوره‌های پیشرفته یادگیری ماشین و یادگیری عمیق. راهنمایی بیش از 200 پروژه دانشجویی در حوزه‌های مختلف هوش مصنوعی.',
  },
  {
    title: 'محقق هوش مصنوعی',
    company: 'شرکت فناوران هوشمند',
    period: '1396-1399',
    description:
      'توسعه مدل‌های یادگیری عمیق برای پردازش تصویر و متن. مشارکت در 5 پروژه صنعتی موفق در حوزه تشخیص چهره و تحلیل احساسات.',
  },
];

const education: Education[] = [
  {
    degree: 'دکترای هوش مصنوعی',
    university: 'دانشگاه تهران',
    period: '1392-1396',
    description:
      'پایان‌نامه: توسعه مدل‌های ترکیبی یادگیری عمیق برای پردازش زبان طبیعی',
  },
  {
    degree: 'کارشناسی ارشد مهندسی کامپیوتر',
    university: 'دانشگاه صنعتی شریف',
    period: '1389-1392',
  },
];

const reviews: Review[] = [
  {
    name: 'علیرضا حسینی',
    course: 'دوره یادگیری عمیق',
    year: '1401',
    content:
      'بهترین دوره‌ای بود که تا حالا شرکت کردم. توضیحات استاد بسیار شفاف و کاربردی بود. پروژه‌های عملی خیلی به دردم خورد.',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
  {
    name: 'فاطمه کریمی',
    course: 'دوره پردازش زبان طبیعی',
    year: '1400',
    content:
      'استاد محمدی با صبر و حوصله به تمام سوالات پاسخ می‌دادند. محتوای دوره بسیار به روز و کاربردی بود. از شرکت در این دوره بسیار راضی هستم.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'محمد رضایی',
    course: 'دوره یادگیری ماشین',
    year: '1401',
    content:
      'با شرکت در این دوره توانستم در مصاحبه‌های شغلی قبول شوم. مطالب به گونه‌ای آموزش داده شده بود که هم جنبه تئوری و هم عملی داشت.',
    avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
  },
];

export default function Page() {
  return (
    <div dir="rtl" className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6">
                <div className="relative h-32 w-32 overflow-hidden rounded-xl">
                  <img
                    src="https://randomuser.me/api/portraits/women/65.jpg"
                    alt="سارا محمدی"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      مربی
                    </h5>
                    <h1 className="text-3xl font-bold">سارا محمدی</h1>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    مربی ارشد هوش مصنوعی و یادگیری ماشین
                  </h2>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full px-3 py-1 text-sm">
                      تایید شده هوش مصنوعی یادگیری عمیق
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.9</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        (87 نظر)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="text-primary-600 dark:text-primary-400 h-5 w-5" />
                      <span>500+ دانشجو</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="text-primary-600 dark:text-primary-400 h-5 w-5" />
                      <span>15 دوره آموزشی</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 lg:text-left">
              <div className="flex items-center gap-2">
                <MapPin className="text-primary-600 dark:text-primary-400 h-5 w-5" />
                <span>تهران، ایران</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-primary-600 dark:text-primary-400 h-5 w-5" />
                <span>عضویت از 1398</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-12 lg:col-span-2">
            {/* About */}
            <section>
              <h2 className="mb-6 text-2xl font-bold">درباره من</h2>
              <p className="text-gray-600 dark:text-gray-300">
                مربی با سابقه در حوزه هوش مصنوعی و یادگیری ماشین با بیش از 8 سال
                تجربه تدریس و کار در پروژه‌های صنعتی. متخصص در پیاده‌سازی
                مدل‌های یادگیری عمیق و پردازش زبان طبیعی.
              </p>
            </section>

            {/* Current Courses */}
            <section>
              <h2 className="mb-6 text-2xl font-bold">
                دوره‌های در حال برگزاری
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {courses.map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl dark:bg-gray-800"
                  >
                    <div className="relative h-48">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold">{course.title}</h3>
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            شروع: {course.startDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {course.students} دانشجو
                          </span>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          course.status === 'ongoing'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}
                      >
                        {course.status === 'ongoing'
                          ? 'در حال برگزاری'
                          : 'ثبت نام باز'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button className="transform rounded-full px-8 py-3 transition-all duration-200 hover:scale-105">
                  مشاهده همه دوره‌ها
                </Button>
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="mb-6 text-2xl font-bold">تجربه کاری</h2>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{exp.title}</h3>
                        <p className="text-primary-600 dark:text-primary-400">
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {exp.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="mb-6 text-2xl font-bold">تحصیلات</h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{edu.degree}</h3>
                        <p className="text-primary-600 dark:text-primary-400">
                          {edu.university}
                        </p>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">
                        {edu.period}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="text-gray-600 dark:text-gray-300">
                        {edu.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="mb-6 text-2xl font-bold">نظرات دانشجویان</h2>
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
                  >
                    <div className="mb-4 flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">{review.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {review.course} | {review.year}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {review.content}
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button className="transform rounded-full px-8 py-3 transition-all duration-200 hover:scale-105">
                  مشاهده همه نظرات
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills */}
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold">مهارت‌ها</h2>
              <div className="space-y-4">
                {mainSkills.map((skill, index) => (
                  <div key={index}>
                    <div className="mb-2 flex justify-between">
                      <span>{skill.name}</span>
                      <span>{skill.percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Skills */}
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold">سایر مهارت‌ها</h2>
              <div className="flex flex-wrap gap-2">
                {otherSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full px-3 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold">افتخارات</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">مدرس برتر سال 1401</h3>
                  <p className="text-primary-600 dark:text-primary-400">
                    آکادمی کاکتوس
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    انتخاب به عنوان مدرس برتر سال بر اساس نظرسنجی دانشجویان و
                    کیفیت محتوای آموزشی
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">مقاله برتر کنفرانس</h3>
                  <p className="text-primary-600 dark:text-primary-400">
                    کنفرانس بین‌المللی هوش مصنوعی | 1398
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
