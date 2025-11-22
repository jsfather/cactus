'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Tag, X, Share2, Download } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useLocale } from '@/app/contexts/LocaleContext';
import { publicCertificateService } from '@/app/lib/services/public-certificate.service';
import { Certificate } from '@/lib/types/certificate';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

export default function Page() {
  const { t, dir } = useLocale();
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories from certificates
  const categories = [
    'all',
    ...new Set(certificates.flatMap((cert) => cert.categories)),
  ];

  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const response = await publicCertificateService.getList(
          selectedCategory === 'all' ? undefined : selectedCategory
        );
        setCertificates(response.data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        toast.error('خطا در بارگذاری گواهینامه‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [selectedCategory]);

  const filteredCertifications = certificates;

  // Clean string from API (remove extra quotes)
  const cleanString = (str: string) => {
    return str.replace(/^"|"$/g, '').replace(/\\"/g, '"');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-20 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold">
              افتخارات و
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                گواهینامه‌ها
              </span>
            </h1>
            <p className="mb-12 text-xl text-gray-600 dark:text-gray-300">
              مجموعه‌ای از افتخارات و گواهینامه‌های کسب شده
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-600 dark:bg-primary-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'همه' : category}
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
                    alt={cleanString(cert.title)}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50" />
                </div>

                {/* Certificate Details */}
                <div className="relative h-2/5 p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="line-clamp-1 text-xl font-bold text-gray-900 dark:text-white">
                      {cleanString(cert.title)}
                    </h3>
                    <Trophy className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {cleanString(cert.description)}
                  </p>
                  <div className="absolute right-6 bottom-6 left-6 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Tag className="text-primary-500 h-4 w-4" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {cert.categories[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="text-primary-500 h-4 w-4" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {new Date(cert.issued_at).toLocaleDateString('fa-IR')}
                      </span>
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
                className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 shadow-2xl sm:max-w-xl md:max-w-2xl lg:max-w-3xl dark:bg-gray-800"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    جزئیات گواهینامه
                  </h2>
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
                    alt={cleanString(selectedCertificate.title)}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {cleanString(selectedCertificate.title)}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {cleanString(selectedCertificate.description)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        دسته‌بندی
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedCertificate.categories.join(', ')}
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        تاریخ صدور
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {new Date(
                          selectedCertificate.issued_at
                        ).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                    {selectedCertificate.organization && (
                      <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                        <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          سازمان
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {cleanString(selectedCertificate.organization)}
                        </div>
                      </div>
                    )}
                    {selectedCertificate.location && (
                      <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                        <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          مکان
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {cleanString(selectedCertificate.location)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: cleanString(selectedCertificate.title),
                            text: cleanString(selectedCertificate.description),
                            url: window.location.href,
                          });
                        }
                      }}
                    >
                      <Share2 className="ml-2 h-4 w-4" />
                      اشتراک‌گذاری
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        window.open(selectedCertificate.image, '_blank');
                      }}
                    >
                      <Download className="ml-2 h-4 w-4" />
                      دانلود
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
