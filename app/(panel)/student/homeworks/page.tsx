'use client';

import { useEffect } from 'react';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useStudentTerm } from '@/app/lib/hooks/use-student-term';
import { BookOpen, Calendar, Clock, AlertCircle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function HomeworksPage() {
  const router = useRouter();
  const { termList, loading, error, getTermList, resetError } = useStudentTerm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTermList();
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات ترم‌ها');
      }
    };

    fetchData();
  }, [getTermList]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      resetError();
    }
  }, [error, resetError]);

  const breadcrumbItems = [
    { label: 'داشبورد', href: '/student/dashboard' },
    { label: 'تکالیف', href: '/student/homeworks', active: true },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
        <div className="flex min-h-[400px] items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!termList || termList.length === 0) {
    return (
      <div className="space-y-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />

        <Card className="p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              هنوز در هیچ کلاسی ثبت‌نام نکرده‌اید
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              برای مشاهده تکالیف، ابتدا باید در یک ترم ثبت‌نام کنید.
            </p>
            <Button
              onClick={() => router.push('/student/terms')}
              className="inline-flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              مشاهده ترم‌های موجود
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          تکالیف
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {termList.map((studentTerm) => (
          <Card key={studentTerm.term.id} className="p-6 transition-shadow hover:shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {studentTerm.term.title}
                </h3>
                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                  {studentTerm.term.type === 'normal'
                    ? 'عادی'
                    : studentTerm.term.type === 'capacity_completion'
                      ? 'تکمیل ظرفیت'
                      : studentTerm.term.type === 'project_based'
                        ? 'پروژه‌محور'
                        : studentTerm.term.type === 'specialized'
                          ? 'تخصصی'
                          : studentTerm.term.type === 'ai'
                            ? 'هوش مصنوعی'
                            : studentTerm.term.type}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>شروع: {studentTerm.term.start_date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>پایان: {studentTerm.term.end_date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>
                    {studentTerm.term.number_of_sessions} جلسه، {studentTerm.term.duration} دقیقه
                  </span>
                </div>
              </div>

              <Button
                onClick={() => router.push(`/student/homeworks/${studentTerm.term.id}`)}
                className="w-full"
                variant="secondary"
              >
                <FileText className="mr-2 h-4 w-4" />
                مشاهده تکالیف
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
