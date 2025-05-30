'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, BookOpen } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  rating: number;
  reviewCount: number;
  studentCount: number;
  courseCount: number;
  image: string;
}

const teachers: Teacher[] = [
  {
    id: '1',
    name: 'سارا محمدی',
    title: 'مربی ارشد هوش مصنوعی و یادگیری ماشین',
    expertise: ['هوش مصنوعی', 'یادگیری عمیق', 'پردازش زبان طبیعی'],
    rating: 4.9,
    reviewCount: 87,
    studentCount: 500,
    courseCount: 15,
    image: '/sara-mohammadi.jpg',
  },
  {
    id: '2',
    name: 'علی رضایی',
    title: 'متخصص برنامه‌نویسی وب و موبایل',
    expertise: ['React', 'Next.js', 'React Native'],
    rating: 4.8,
    reviewCount: 92,
    studentCount: 450,
    courseCount: 12,
    image: '/sara-mohammadi.jpg',
  },
  {
    id: '3',
    name: 'مریم حسینی',
    title: 'مدرس ارشد علوم داده',
    expertise: ['تحلیل داده', 'یادگیری ماشین', 'پایتون'],
    rating: 4.9,
    reviewCount: 75,
    studentCount: 380,
    courseCount: 10,
    image: '/sara-mohammadi.jpg',
  },
  {
    id: '4',
    name: 'محمد کریمی',
    title: 'متخصص امنیت سایبری',
    expertise: ['امنیت شبکه', 'رمزنگاری', 'تست نفوذ'],
    rating: 4.7,
    reviewCount: 68,
    studentCount: 320,
    courseCount: 8,
    image: '/sara-mohammadi.jpg',
  },
  {
    id: '5',
    name: 'زهرا نوری',
    title: 'مدرس طراحی رابط کاربری',
    expertise: ['UI/UX', 'طراحی تجربه کاربری', 'Figma'],
    rating: 4.8,
    reviewCount: 82,
    studentCount: 420,
    courseCount: 11,
    image: '/sara-mohammadi.jpg',
  },
  {
    id: '6',
    name: 'امیر حیدری',
    title: 'متخصص DevOps و مهندسی نرم‌افزار',
    expertise: ['Docker', 'Kubernetes', 'CI/CD'],
    rating: 4.9,
    reviewCount: 71,
    studentCount: 290,
    courseCount: 9,
    image: '/sara-mohammadi.jpg',
  },
];

export default function Page() {
  return (
    <div dir="rtl" className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-4 text-4xl font-bold">
                مربیان برتر آکادمی کاکتوس
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                با بهترین اساتید و متخصصان در حوزه‌های مختلف فناوری آشنا شوید.
                مربیان ما با تجربه عملی و دانش تخصصی، مسیر یادگیری شما را هموار
                می‌کنند.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/teachers/${teacher.id}`}>
                  <div className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                    <div className="relative h-64">
                      <Image
                        src={teacher.image}
                        alt={teacher.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="mb-2 text-xl font-bold">{teacher.name}</h2>
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        {teacher.title}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {teacher.expertise.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-full px-3 py-1 text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{teacher.rating}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({teacher.reviewCount} نظر)
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {teacher.studentCount}+
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {teacher.courseCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
