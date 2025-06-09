'use client';

import { useState } from 'react';
import Image from 'next/image';
import Masonry from 'react-masonry-css';
import ImageModal from '@/app/components/ImageModal';

const certifications = [
  'مخترعین-آکسفورد.jpg',
  'مقام اول لایت فوتبالیست سکندری- ایران اپن 2024.jpg',
  'جیتکس امارات 2023.JPG',
  'ربوتکس ترکیه.jpg',
  'مقام اول سوپرتیم لیگ جنگنده-فیرا کاپ2019.jpg',
  'مقام دوم لیگ FOLKRACE - ربوتکس ترکیه2022.jpg',
  'مقام سوم لیگ خودرو هوشمند-ایران اوپن 2018.jpg',
  'AKK خاورمیانه.jpg',
  'مقام اول شبیه سار دو بعدی فوتبالیست-برزیل.jpg',
  'ICSI کانادا.jpg',
  'equal استرالیا.jpg',
  'مقام اول لیگ کاوشگر ماه-راینوکاپ بابل.jpg',
  'مقام سوم لیگ فوتبالیست-راینوکاپ بابل.jpg',
  'مقام اول لیگ فوتبالیست-راینوکاپ بابل.jpg',
  'کارگاه ملی رباتیک.jpg',
  'ربو کاکتوس-جنگجو-بارمان.jpg',
  'رالی-آمل روبوت-بارمان_0007.jpg',
  'دوم-جنگجو-آیندگان_0006.jpg',
  'مسیریاب-CSW1- بارمان_0005.jpg',
  'جنگجو-سوم-آیندگان_0003.jpg',
  'لیگ جنگجو-اول-آیندگان_0002.jpg',
  '- CSW2مسیریاب- بارمان.jpg',
];

const getHeight = (index: number) => {
  // Create a deterministic pattern of heights
  const pattern = [
    350, // Tall
    250, // Medium
    200, // Small
    300, // Medium-tall
    400, // Extra tall
    250, // Medium
  ];
  return pattern[index % pattern.length];
};

export default function Page() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const breakpointColumns = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 2,
    480: 1,
  };

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
        </div>

        <style jsx global>{`
          .my-masonry-grid {
            display: flex;
            width: auto;
            gap: 16px;
          }
          .my-masonry-grid_column {
            gap: 16px;
            background-clip: padding-box;
          }
        `}</style>

        <Masonry
          breakpointCols={breakpointColumns}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {certifications.map((cert, index) => (
            <div
              key={cert}
              className="group relative mb-4 cursor-pointer overflow-hidden rounded-lg bg-gray-200 transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
              onClick={() => setSelectedImage(cert)}
            >
              <div
                style={{ height: `${getHeight(index)}px` }}
                className="relative"
              >
                <Image
                  src={`/certifications/${cert}`}
                  alt={cert}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="truncate text-sm font-medium text-white">
                    {cert.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      </div>

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imagePath={`/certifications/${selectedImage}`}
          imageName={selectedImage}
        />
      )}
    </div>
  );
}
