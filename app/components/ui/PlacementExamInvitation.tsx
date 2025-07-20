'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface PlacementExamInvitationProps {
  onDismiss?: () => void;
  className?: string;
  examId?: number | string; // Optional exam ID prop
}

export default function PlacementExamInvitation({
  onDismiss,
  className,
  examId = 1, // Default exam ID
}: PlacementExamInvitationProps) {
  const router = useRouter();

  const handleStartExam = () => {
    router.push(`/student/placement-exam/${examId}`);
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <motion.div
      className={`rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                آزمون تعیین سطح
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                برای تعیین سطح مناسب شما
              </p>
            </div>
          </div>

          <p className="mb-6 text-gray-700 dark:text-gray-300">
            برای شروع یادگیری در سطح مناسب خود، ابتدا آزمون تعیین سطح را بگذرانید.
            این آزمون کوتاه به ما کمک می‌کند تا بهترین دوره‌ها را برای شما پیشنهاد
            دهیم.
          </p>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>۳۰-۶۰ دقیقه</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4 text-blue-500" />
              <span>چند انتخابی</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>رایگان</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    آزمون تعیین سطح
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    آزمون عمومی برای تعیین سطح دانش شما
                  </p>
                </div>
                <Button
                  onClick={handleStartExam}
                  className="flex items-center gap-2"
                >
                  شروع آزمون
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="بستن"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}
