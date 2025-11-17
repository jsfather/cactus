'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Search,
  Filter,
  BookOpen,
  Clock,
  Users,
} from 'lucide-react';
import { useLocale } from '@/app/contexts/LocaleContext';

interface Course {
  title: string;
  description: string;
  duration: string;
  level: string;
  image: string;
  price: string;
}

export default function Page() {
  const { t, dir } = useLocale();

  const getCourses = (): Course[] => [
    {
      title: t.home.courses.items.roboticsBasics.title,
      description: t.home.courses.items.roboticsBasics.description,
      duration: dir === 'rtl' ? '۸ هفته' : '8 Weeks',
      level: t.home.courses.beginner,
      image: '/course-robotics-intro.png',
      price: dir === 'rtl' ? '۲,۹۹۰,۰۰۰' : '2,990,000',
    },
    {
      title: t.home.courses.items.advancedRobotProgramming.title,
      description: t.home.courses.items.advancedRobotProgramming.description,
      duration: dir === 'rtl' ? '۱۲ هفته' : '12 Weeks',
      level: t.home.courses.advanced,
      image: '/course-robot-programming.png',
      price: dir === 'rtl' ? '۴,۹۹۰,۰۰۰' : '4,990,000',
    },
    {
      title: t.home.courses.items.robotVisionSystems.title,
      description: t.home.courses.items.robotVisionSystems.description,
      duration: dir === 'rtl' ? '۱۰ هفته' : '10 Weeks',
      level: t.home.courses.intermediate,
      image: '/course-robot-vision.png',
      price: dir === 'rtl' ? '۳,۹۹۰,۰۰۰' : '3,990,000',
    },
  ];

  const getStats = () => [
    {
      icon: <BookOpen className="h-6 w-6" />,
      value: t.courses.stats.coursesValue,
      label: t.courses.stats.courses,
    },
    {
      icon: <Clock className="h-6 w-6" />,
      value: t.courses.stats.hoursValue,
      label: t.courses.stats.hours,
    },
    {
      icon: <Users className="h-6 w-6" />,
      value: t.courses.stats.studentsValue,
      label: t.courses.stats.students,
    },
  ];

  const courses = getCourses();
  const stats = getStats();
  return (
    <div
      dir={dir}
      className="min-h-screen bg-white pt-20 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
    >
      {/* Breadcrumb */}
      <div className="border-b dark:border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="flex items-center py-4 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {t.common.home}
            </Link>
            <ChevronLeft className="mx-2 h-4 w-4 text-gray-500" />
            <span className="text-primary-600 dark:text-primary-400">
              {t.courses.pageTitle}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-4xl font-bold"
            >
              {t.courses.pageTitle}
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                {t.courses.pageTitleHighlight}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 text-xl text-gray-600 dark:text-gray-300"
            >
              {t.courses.pageSubtitle}
            </motion.p>

            {/* Search and Filter */}
            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <div className="relative max-w-md flex-1">
                <input
                  type="text"
                  placeholder={t.courses.searchPlaceholder}
                  className="focus:ring-primary-500 w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 focus:border-transparent focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                />
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                <Filter className="h-5 w-5" />
                {t.courses.filterCourses}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
                >
                  <div className="text-primary-600 dark:text-primary-400 mb-2">
                    {stat.icon}
                  </div>
                  <div className="mb-1 text-3xl font-bold">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-2xl font-bold">دوره‌های ویژه</h2>
            <div className="flex gap-4">
              <button className="rounded-lg bg-gray-100 px-4 py-2 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                جدیدترین
              </button>
              <button className="rounded-lg bg-gray-100 px-4 py-2 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                محبوب‌ترین
              </button>
            </div>
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
                      {course.price} {t.common.toman}
                    </span>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Link href={`/courses/1`}>
                    <button className="text-primary-600 dark:text-primary-400 w-full rounded-xl bg-gray-100 py-2 font-semibold transition duration-200 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                      {t.home.courses.moreInfo}
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-100 to-gray-200 py-20 dark:from-gray-700 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-900 dark:text-white">
            <h2 className="mb-4 text-3xl font-bold">{t.courses.cta.title}</h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              {t.courses.cta.subtitle}
            </p>
            <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
              {t.courses.cta.button}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
