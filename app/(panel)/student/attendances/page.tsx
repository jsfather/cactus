'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { getTerms } from '@/app/lib/api/student/terms';
import { Term } from '@/app/lib/types';
import { Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AttendancesPage() {
  const router = useRouter();
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await getTerms();
        setTerms(response.data);
      } catch (error) {
        console.error('Error fetching terms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const breadcrumbItems = [
    { label: 'داشبورد', href: '/student/dashboard' },
    { label: 'حضور و غیاب', href: '/student/attendances', active: true },
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

  if (!terms || terms.length === 0) {
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
              برای مشاهده حضور و غیاب، ابتدا باید در یک ترم ثبت‌نام کنید.
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
          حضور و غیاب
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {terms.map((term) => (
          <Card key={term.id} className="p-6 transition-shadow hover:shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {term.title}
                </h3>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  {term.type === 'normal'
                    ? 'عادی'
                    : term.type === 'capacity_completion'
                      ? 'تکمیل ظرفیت'
                      : term.type === 'project_based'
                        ? 'پروژه‌محور'
                        : term.type === 'specialized'
                          ? 'تخصصی'
                          : term.type === 'ai'
                            ? 'هوش مصنوعی'
                            : term.type}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>شروع: {term.start_date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>پایان: {term.end_date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>
                    {term.number_of_sessions} جلسه، {term.duration} دقیقه
                  </span>
                </div>
              </div>

              <Button
                onClick={() => router.push(`/student/attendances/${term.id}`)}
                className="w-full"
                variant="secondary"
              >
                مشاهده حضور و غیاب
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
