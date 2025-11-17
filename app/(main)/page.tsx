'use client';

import Image from 'next/image';
import { Button } from '@/app/components/ui/Button';
import { motion } from 'framer-motion';
import type { JSX } from 'react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { VideoModal } from '@/app/components/ui/VideoModal';
import { Play } from 'lucide-react';
import { ClientVideo } from '@/app/components/ui/ClientVideo';
import { useLocale } from '@/app/contexts/LocaleContext';

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

interface VideoThumbnail {
  videoSrc: string;
  title: string;
  aspectRatio: 'video' | 'square';
}

export default function Page() {
  const { t, dir } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  const getFeatures = (): Feature[] => [
    {
      title: t.home.features.handsOn.title,
      description: t.home.features.handsOn.description,
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
      title: t.home.features.expertInstructors.title,
      description: t.home.features.expertInstructors.description,
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
      title: t.home.features.projectBased.title,
      description: t.home.features.projectBased.description,
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
      title: t.home.features.careerSupport.title,
      description: t.home.features.careerSupport.description,
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
      title: t.home.features.flexibleLearning.title,
      description: t.home.features.flexibleLearning.description,
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
      title: t.home.features.innovationLab.title,
      description: t.home.features.innovationLab.description,
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

  const features = getFeatures();

  const videoThumbnails: VideoThumbnail[] = [
    {
      videoSrc: 'https://kaktos.kanoonbartarha.ir/site_videos/intro-1.mp4',
      title: t.home.about.videoTitle1,
      aspectRatio: 'square',
    },
    {
      videoSrc: 'https://kaktos.kanoonbartarha.ir/site_videos/intro-2.mp4',
      title: t.home.about.videoTitle2,
      aspectRatio: 'video',
    },
    {
      videoSrc: 'https://kaktos.kanoonbartarha.ir/site_videos/intro-3.mp4',
      title: t.home.about.videoTitle3,
      aspectRatio: 'video',
    },
  ];

  return (
    <div
      dir={dir}
      className="min-h-screen text-gray-900 dark:bg-gray-900 dark:text-gray-100"
    >
      {/* Hero Section */}
      <section className="relative mt-24">
        {/* Full-width Video Container */}
        <div className="container mx-auto px-4">
          <div className="relative h-[70vh] w-full overflow-hidden rounded-3xl shadow-2xl">
            <ClientVideo
              className="h-full w-full object-cover"
              src="https://kaktos.kanoonbartarha.ir/site_videos/robocup-2024.mp4"
              muted
              playsInline
              autoPlay
              loop
              preload="metadata"
            />
            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-gray-500/10 via-gray-500/20 to-gray-500/30 dark:from-black/10 dark:via-black/20 dark:to-black/30" />
          </div>
        </div>

        {/* Content Section - Below Video */}
        <div className="relative z-10 mt-12 bg-gradient-to-b from-transparent to-gray-100 pb-24 dark:to-gray-900">
          <div className="container mx-auto px-4">
            {/* Main Content */}
            <div className="mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
                  <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                    {t.home.hero.title}
                  </span>
                  <br />
                  {t.home.hero.subtitle}
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-700 sm:text-xl dark:text-gray-300">
                  {t.home.hero.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
              >
                <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
                  {t.home.hero.startLearning}
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full px-8 py-3 text-lg"
                >
                  {t.home.hero.viewCourses}
                </Button>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-16"
              >
                <div className="relative">
                  {/* Decorative blur effect */}
                  <div className="absolute inset-0 -z-10">
                    <div className="bg-primary-600/20 absolute top-0 right-1/2 h-[200px] w-[200px] translate-x-1/2 -translate-y-1/2 transform rounded-full blur-[100px]" />
                    <div className="absolute top-0 left-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-600/20 blur-[100px]" />
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
                    {[
                      {
                        number: dir === 'rtl' ? '+۵۰۰' : '+500',
                        label: t.home.stats.students,
                        description:
                          dir === 'rtl' ? 'دانشجوی فعال' : 'Active Students',
                      },
                      {
                        number: dir === 'rtl' ? '+۵۰' : '+50',
                        label: t.home.stats.courses,
                        description:
                          dir === 'rtl' ? 'دوره تخصصی' : 'Specialized Courses',
                      },
                      {
                        number: dir === 'rtl' ? '٪۹۵' : '95%',
                        label: t.home.stats.satisfaction,
                        description:
                          dir === 'rtl'
                            ? 'رضایت دانشجویان'
                            : 'Student Satisfaction',
                      },
                      {
                        number: dir === 'rtl' ? '+۲۰' : '+20',
                        label: dir === 'rtl' ? 'مدرس' : 'Instructors',
                        description:
                          dir === 'rtl' ? 'اساتید مجرب' : 'Expert Instructors',
                      },
                    ].map((stat, index) => (
                      <div key={index} className="group relative">
                        <div className="relative space-y-2 text-center">
                          <div className="text-primary-600 dark:text-primary-400 relative text-4xl font-bold sm:text-5xl">
                            {stat.number}
                            <div className="bg-primary-400 absolute top-0 -right-2 h-2 w-2 rounded-full" />
                          </div>
                          <div className="text-sm font-medium text-gray-800 sm:text-base dark:text-gray-300">
                            {stat.label}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {stat.description}
                          </p>
                        </div>
                        {/* Hover effect line */}
                        <div className="bg-primary-500 absolute -bottom-4 left-1/2 h-1 w-0 -translate-x-1/2 transform rounded-full transition-all duration-300 group-hover:w-1/2" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {t.home.features.title}
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                {t.home.features.titleHighlight}{' '}
              </span>
              {dir === 'rtl' ? 'را انتخاب کنید؟' : '?'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t.home.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {getFeatures().map((feature, index) => (
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
                <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                  {t.home.about.title}
                </span>
              </h2>
              <div className="space-y-4">
                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  {t.home.about.description1}
                </p>

                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  {t.home.about.description2}
                </p>

                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                  {t.home.about.description3}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[
                  {
                    title: t.home.about.experience,
                    value:
                      dir === 'rtl'
                        ? t.home.about.experienceValue
                        : '+10 Years',
                  },
                  {
                    title: t.home.about.successfulProjects,
                    value:
                      dir === 'rtl'
                        ? t.home.about.successfulProjectsValue
                        : '+200',
                  },
                  {
                    title: t.home.about.awards,
                    value: dir === 'rtl' ? t.home.about.awardsValue : '+50',
                  },
                  {
                    title: t.home.about.colleagues,
                    value: dir === 'rtl' ? t.home.about.colleaguesValue : '+30',
                  },
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
                  t.home.about.specializedTraining,
                  t.home.about.advancedEquipment,
                  t.home.about.support247,
                  t.home.about.validCertificate,
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
              <div className="gap-6 space-y-6 lg:grid lg:grid-cols-2 lg:space-y-0">
                <div className="h-[400px] lg:h-[600px]">
                  <div
                    className="group relative h-full cursor-pointer overflow-hidden rounded-2xl"
                    onClick={() =>
                      videoThumbnails[0].videoSrc
                        ? setSelectedVideo(videoThumbnails[0].videoSrc)
                        : null
                    }
                  >
                    <ClientVideo
                      src={videoThumbnails[0].videoSrc}
                      className="absolute inset-0 h-full w-full object-cover"
                      preload="metadata"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/50" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      {videoThumbnails[0].videoSrc && (
                        <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                          <Play className="h-8 w-8 text-white opacity-75 group-hover:opacity-100" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {videoThumbnails[0].title}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  {videoThumbnails.slice(1).map((video, index) => (
                    <div
                      key={index}
                      className="group relative h-[290px] cursor-pointer overflow-hidden rounded-2xl lg:h-[290px]"
                      onClick={() =>
                        video.videoSrc ? setSelectedVideo(video.videoSrc) : null
                      }
                    >
                      <ClientVideo
                        src={video.videoSrc}
                        className="absolute inset-0 h-full w-full object-cover"
                        preload="metadata"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/50" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        {video.videoSrc && (
                          <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                            <Play className="h-8 w-8 text-white opacity-75 group-hover:opacity-100" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {video.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoSrc={selectedVideo}
        />
      )}

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
              >
                <Link href={`/shop/${product.id}`}>
                  <div className="group rounded-2xl bg-white p-4 shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70">
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
                      <Image
                        src={product.image || '/placeholder-image.jpg'}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110 dark:opacity-90"
                      />
                      {product.discount && (
                        <div className="absolute top-2 left-2 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white dark:bg-red-600">
                          تخفیف
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart logic will be implemented
                        }}
                        className="absolute right-2 bottom-2 rounded-full bg-white/90 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                      >
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
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // Add to cart logic will be implemented
                          }}
                          className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                            product.inStock
                              ? 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white'
                              : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                          }`}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? 'افزودن به سبد' : 'ناموجود'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/shop">
              <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transform rounded-full px-8 py-3 text-lg text-white transition-all duration-200 hover:scale-105">
                {t.home.shop.viewAllProducts}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="courses" className="py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {t.home.courses.title}
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                {t.home.courses.titleHighlight}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t.home.courses.subtitle}
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
                    src={course.image || '/placeholder-image.jpg'}
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
                {t.home.courses.viewAllCourses}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="blog" className="bg-gray-50 py-24 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {t.home.blog.title}
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                {t.home.blog.titleHighlight}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t.home.blog.subtitle}
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
                    src={post.image || '/placeholder-image.jpg'}
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
              {t.home.blog.viewAllArticles}
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
