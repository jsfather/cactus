'use client';

import { Star } from 'lucide-react';
import { useLocale } from '@/app/contexts/LocaleContext';

interface CourseRatingProps {
  rating: number;
  ratingCount: number;
}

export default function CourseRating({ rating, ratingCount }: CourseRatingProps) {
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
      <span className="text-lg font-bold text-gray-900 dark:text-white">
        {rating.toFixed(1)}
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        ({ratingCount} {t.courses.detail.reviews})
      </span>
    </div>
  );
}
