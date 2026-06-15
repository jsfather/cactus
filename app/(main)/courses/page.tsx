'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Search,
  Filter,
  BookOpen,
  Clock,
  Users,
  Star,
  X,
} from 'lucide-react';
import { useLocale } from '@/app/contexts/LocaleContext';
import { publicCourseService } from '@/app/lib/services/public-course.service';
import { PublicCourse } from '@/app/lib/types/course';
import CourseFilters, {
  CourseFilterValues,
} from '@/app/components/courses/CourseFilters';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Button } from '@/app/components/ui/Button';

const emptyFilters: CourseFilterValues = {
  topic: '',
  level: '',
  age_group: '',
  price_type: '',
};

function CoursesContent() {
  const { t, dir } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [filters, setFilters] = useState<CourseFilterValues>({
    topic: (searchParams.get('topic') as CourseFilterValues['topic']) || '',
    level: (searchParams.get('level') as CourseFilterValues['level']) || '',
    age_group:
      (searchParams.get('age_group') as CourseFilterValues['age_group']) || '',
    price_type:
      (searchParams.get('price_type') as CourseFilterValues['price_type']) ||
      '',
  });
  const [sort, setSort] = useState<'newest' | 'popular'>(
    (searchParams.get('sort') as 'newest' | 'popular') || 'newest'
  );
  const [showFilters, setShowFilters] = useState(
    !!searchParams.get('topic') ||
      !!searchParams.get('level') ||
      !!searchParams.get('age_group') ||
      !!searchParams.get('price_type')
  );
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await publicCourseService.getList({
          search: searchQuery || undefined,
          topic: filters.topic || undefined,
          level: filters.level || undefined,
          age_group: filters.age_group || undefined,
          price_type: filters.price_type || undefined,
          sort,
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchQuery, filters, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (filters.topic) params.set('topic', filters.topic);
      if (filters.level) params.set('level', filters.level);
      if (filters.age_group) params.set('age_group', filters.age_group);
      if (filters.price_type) params.set('price_type', filters.price_type);
      if (sort !== 'newest') params.set('sort', sort);

      const queryString = params.toString();
      const newPath = `/courses${queryString ? `?${queryString}` : ''}`;
      router.replace(newPath, { scroll: false });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, sort, router]);

  const clearFilters = () => {
    setFilters(emptyFilters);
    setSearchQuery('');
    setShowFilters(false);
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== '').length;

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

  const stats = getStats();

  return (
    <div
      dir={dir}
      className="min-h-screen bg-white pt-20 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
    >
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

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <div className="relative max-w-md flex-1">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.courses.searchPlaceholder}
                  className="focus:ring-primary-500 w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 focus:border-transparent focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                />
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 transition-colors ${
                  activeFilterCount > 0
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="h-5 w-5" />
                {t.courses.filterCourses}
                {activeFilterCount > 0 && (
                  <span className="bg-primary-600 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

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

      <section className="py-20">
        <div className="container mx-auto px-4">
          <CourseFilters
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            show={showFilters}
          />

          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t.courses.specialCourses}</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setSort('newest')}
                className={`rounded-lg px-4 py-2 ${
                  sort === 'newest'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {t.courses.newest}
              </button>
              <button
                onClick={() => setSort('popular')}
                className={`rounded-lg px-4 py-2 ${
                  sort === 'popular'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {t.courses.popular}
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : courses.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                {t.courses.noCourses}
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-primary-600 mt-4 flex items-center gap-1 mx-auto hover:underline"
                >
                  <X className="h-4 w-4" />
                  {t.courses.filters.clear}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl dark:bg-gray-800"
                >
                  <div className="relative h-48">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover dark:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between">
                      <span className="bg-primary-600 rounded-full px-3 py-1 text-sm text-white">
                        {course.level_label}
                      </span>
                      {course.price_type === 'free' && (
                        <span className="rounded-full bg-green-500 px-3 py-1 text-sm text-white">
                          {t.courses.filters.prices.free}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                      <span>{course.topic_label}</span>
                      <span>•</span>
                      <span>{course.age_group_label}</span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold dark:text-gray-100">
                      {course.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-300">
                      {course.description}
                    </p>
                    <div className="mb-3 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {course.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({course.rating_count})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {course.duration}
                      </span>
                      <span className="text-primary-600 dark:text-primary-400 font-bold">
                        {course.price_type === 'free'
                          ? t.courses.filters.prices.free
                          : `${course.price_label} ${t.common.toman}`}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <Link href={`/courses/${course.id}`}>
                      <button className="text-primary-600 dark:text-primary-400 w-full rounded-xl bg-gray-100 py-2 font-semibold transition duration-200 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                        {t.home.courses.moreInfo}
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-gray-100 to-gray-200 py-20 dark:from-gray-700 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-900 dark:text-white">
            <h2 className="mb-4 text-3xl font-bold">{t.courses.cta.title}</h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              {t.courses.cta.subtitle}
            </p>
            <Link href="/about">
              <Button className="bg-primary-600 hover:bg-primary-700 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
                {t.courses.cta.button}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CoursesContent />
    </Suspense>
  );
}
