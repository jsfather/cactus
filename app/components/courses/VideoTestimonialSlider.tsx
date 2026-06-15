'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { CourseVideoTestimonial } from '@/app/lib/types/course';
import { useLocale } from '@/app/contexts/LocaleContext';

interface VideoTestimonialSliderProps {
  testimonials: CourseVideoTestimonial[];
}

export default function VideoTestimonialSlider({
  testimonials,
}: VideoTestimonialSliderProps) {
  const { t, dir } = useLocale();
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);

  if (!testimonials.length) return null;

  const active = testimonials[current];
  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const goTo = (index: number) => {
    setPlaying(false);
    setCurrent(index);
  };

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t.courses.detail.testimonials}
      </h2>

      <div className="overflow-hidden rounded-2xl bg-gray-900">
        <div className="relative aspect-video w-full">
          {playing ? (
            <iframe
              src={active.video_url}
              title={active.title || active.student_name}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="group relative h-full w-full"
            >
              {active.thumbnail_url ? (
                <Image
                  src={active.thumbnail_url}
                  alt={active.student_name}
                  fill
                  className="object-cover opacity-80"
                />
              ) : (
                <div className="h-full w-full bg-gray-800" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary-600 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                  <Play className="h-8 w-8 fill-white text-white" />
                </div>
              </div>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length)}
            className="rounded-full bg-gray-700 p-2 text-white hover:bg-gray-600"
            aria-label="Previous"
          >
            <PrevIcon className="h-5 w-5" />
          </button>

          <div className="text-center">
            <p className="font-bold text-white">{active.student_name}</p>
            {active.title && (
              <p className="text-sm text-gray-400">{active.title}</p>
            )}
          </div>

          <button
            onClick={() => goTo((current + 1) % testimonials.length)}
            className="rounded-full bg-gray-700 p-2 text-white hover:bg-gray-600"
            aria-label="Next"
          >
            <NextIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 pb-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? 'bg-primary-500 w-6'
                  : 'w-2 bg-gray-600'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
