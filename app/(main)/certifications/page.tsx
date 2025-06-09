'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Tag, Award, X, Share2, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface Certificate {
  id: string;
  title: string;
  image: string;
  category: string;
  issuedDate: string;
  description: string;
  organization?: string;
  location?: string;
  rank?: string;
}

const certifications: Certificate[] = [
  {
    id: 'oxford-inventors',
    title: 'مخترعین آکسفورد',
    image: '/certifications/مخترعین-آکسفورد.jpg',
    category: 'بین المللی',
    issuedDate: '2024',
    description: 'گواهینامه شرکت در رویداد مخترعین آکسفورد',
    organization: 'دانشگاه آکسفورد',
    location: 'انگلستان',
  },
  {
    id: 'iran-open-2024',
    title: 'مقام اول لایت فوتبالیست سکندری',
    image: '/certifications/مقام اول لایت فوتبالیست سکندری- ایران اپن 2024.jpg',
    category: 'ملی',
    issuedDate: '2024',
    description: 'کسب مقام اول در مسابقات ایران اپن 2024',
    organization: 'ایران اپن',
    location: 'ایران',
    rank: 'مقام اول'
  },
  {
    id: 'gitex-2023',
    title: 'جیتکس امارات',
    image: '/certifications/جیتکس امارات 2023.JPG',
    category: 'بین المللی',
    issuedDate: '2023',
    description: 'حضور در نمایشگاه جیتکس امارات',
    organization: 'GITEX',
    location: 'امارات متحده عربی'
  },
  // ... Add the rest of the certificates with proper data structure
];

const categories = ['همه', 'بین المللی', 'ملی', 'منطقه‌ای'];

export default function Page() {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('همه');

  const filteredCertifications = selectedCategory === 'همه'
    ? certifications
    : certifications.filter(cert => cert.category === selectedCategory);

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-24 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            گواهینامه ها و افتخارات
            <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
              {' '}
              کاکتوس
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            مجموعه دستاوردها و افتخارات کسب شده توسط تیم کاکتوس
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white dark:bg-primary-500'
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCertifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group aspect-square overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50"
              onClick={() => setSelectedCertificate(cert)}
            >
              {/* Certificate Image */}
              <div className="relative h-3/5 overflow-hidden">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50" />
              </div>

              {/* Certificate Details */}
              <div className="relative h-2/5 p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                    {cert.title}
                  </h3>
                  <Trophy className="h-5 w-5 text-amber-500" />
                </div>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {cert.description}
                </p>
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-primary-500" />
                    <span className="text-gray-600 dark:text-gray-400">{cert.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary-500" />
                    <span className="text-gray-600 dark:text-gray-400">{cert.issuedDate}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificate Detail View */}
      <AnimatePresence>
        {selectedCertificate && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCertificate(null)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Detail Card */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 shadow-2xl dark:bg-gray-800 sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">جزئیات گواهینامه</h2>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={selectedCertificate.image}
                  alt={selectedCertificate.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedCertificate.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {selectedCertificate.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                    <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">دسته‌بندی</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedCertificate.category}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                    <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">تاریخ صدور</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedCertificate.issuedDate}
                    </div>
                  </div>
                  {selectedCertificate.organization && (
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">سازمان صادرکننده</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedCertificate.organization}
                      </div>
                    </div>
                  )}
                  {selectedCertificate.location && (
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">محل برگزاری</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedCertificate.location}
                      </div>
                    </div>
                  )}
                  {selectedCertificate.rank && (
                    <div className="col-span-2 rounded-xl bg-primary-50 p-4 dark:bg-primary-900/20">
                      <div className="mb-2 text-sm text-primary-600 dark:text-primary-400">رتبه کسب شده</div>
                      <div className="font-medium text-primary-700 dark:text-primary-300">
                        {selectedCertificate.rank}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      // Handle share
                    }}
                  >
                    <Share2 className="ml-2 h-4 w-4" />
                    اشتراک‌گذاری
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      // Handle download
                    }}
                  >
                    <Download className="ml-2 h-4 w-4" />
                    دانلود تصویر
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
