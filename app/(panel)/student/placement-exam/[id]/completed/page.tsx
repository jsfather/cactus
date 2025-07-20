'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Home, FileText } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';

export default function PlacementExamCompletedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const examId = resolvedParams.id;

  return (
    <main className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'داشبورد', href: '/student/dashboard' },
          { label: 'آزمون تعیین سطح', href: `/student/placement-exam/${examId}` },
          {
            label: 'تکمیل آزمون',
            href: `/student/placement-exam/${examId}/completed`,
            active: true,
          },
        ]}
      />

      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Success Icon */}
          <motion.div
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
              آزمون با موفقیت تکمیل شد!
            </h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
              آزمون تعیین سطح شما با موفقیت ثبت شد. نتایج آزمون پس از بررسی توسط
              اساتید اعلام خواهد شد.
            </p>
          </motion.div>

          {/* Information Card */}
          <motion.div
            className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                مراحل بعدی
              </h2>
            </div>
            <div className="space-y-3 text-right text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                <span>نتایج آزمون ظرف ۲۴ ساعت آینده اعلام خواهد شد</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                <span>بر اساس نتایج، سطح مناسب برای شما تعیین می‌شود</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                <span>می‌توانید در دوره‌های مناسب سطح خود ثبت‌نام کنید</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              onClick={() => router.push('/student/dashboard')}
              className="flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              بازگشت به داشبورد
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/student/terms')}
              className="flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              مشاهده دوره‌ها
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>نکته:</strong> در صورت داشتن سوال یا نیاز به راهنمایی،
              می‌توانید از بخش تیکت‌ها با ما در ارتباط باشید.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
