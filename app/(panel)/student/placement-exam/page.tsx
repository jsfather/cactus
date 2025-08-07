'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';

export default function PlacementExamListPage() {
  const router = useRouter();

  const [examId, setExamId] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleStartExam = async (inputExamId: string) => {
    const trimmedId = inputExamId.trim();

    if (!trimmedId) {
      toast.error('لطفاً شناسه آزمون را وارد کنید');
      return;
    }

    // Basic validation for exam ID format
    if (!/^[a-zA-Z0-9]+$/.test(trimmedId)) {
      toast.error('شناسه آزمون فقط می‌تواند شامل حروف و اعداد باشد');
      return;
    }

    setIsValidating(true);

    try {
      // Navigate to exam page - validation will happen there
      router.push(`/student/placement-exam/${trimmedId}`);
    } catch (error) {
      toast.error('خطا در انتقال به صفحه آزمون');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <main className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'داشبورد', href: '/student/dashboard' },
          {
            label: 'آزمون تعیین سطح',
            href: '/student/placement-exam',
            active: true,
          },
        ]}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              آزمون تعیین سطح
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              برای تعیین سطح مناسب خود آزمون دهید
            </p>
          </div>
        </div>

        {/* Information Section */}
        <div className="mb-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
          <h2 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
            درباره آزمون تعیین سطح
          </h2>
          <div className="space-y-3 text-blue-800 dark:text-blue-200">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span className="text-sm">
                آزمون تعیین سطح به ما کمک می‌کند تا بهترین دوره‌ها را برای شما
                پیشنهاد دهیم
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span className="text-sm">
                این آزمون رایگان است و نتیجه آن تأثیری بر نمرات شما ندارد
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span className="text-sm">
                پس از تکمیل آزمون، نتایج ظرف ۲۴ ساعت اعلام می‌شود
              </span>
            </div>
          </div>
        </div>

        {/* Start Exam Section */}
        <div className="py-8 text-center">
          <div className="bg-primary-100 dark:bg-primary-900/30 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <BookOpen className="text-primary-600 dark:text-primary-400 h-10 w-10" />
          </div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            آماده برای شروع آزمون؟
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            برای شروع آزمون تعیین سطح، شناسه آزمون را وارد کنید یا از لینک ارائه
            شده استفاده کنید.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <input
              type="text"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              placeholder="شناسه آزمون را وارد کنید"
              className="focus:border-primary-500 focus:ring-primary-200 dark:focus:border-primary-500 w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2 text-center focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleStartExam(examId);
                }
              }}
              disabled={isValidating}
            />
            <Button
              onClick={() => handleStartExam(examId)}
              loading={isValidating}
              disabled={!examId.trim() || isValidating}
              className="flex items-center gap-2"
            >
              شروع آزمون
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>اگر شناسه آزمون ندارید، با پشتیبانی تماس بگیرید.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
