'use client';

import { useEffect, useState, use } from 'react';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { getHomeworks } from '@/app/lib/api/student/homeworks';
import { BookOpen, Calendar, Clock, AlertCircle, FileText, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function TermHomeworksPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching homeworks for term ID:', resolvedParams.id);
        const response = await getHomeworks(resolvedParams.id);
        console.log('Homeworks response:', response);
        setHomeworks(response.data || []);
      } catch (error) {
        console.error('Error fetching homeworks:', error);
        toast.error('خطا در دریافت اطلاعات تکالیف');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const breadcrumbItems = [
    { label: 'داشبورد', href: '/student/dashboard' },
    { label: 'تکالیف', href: '/student/homeworks' },
    { label: 'تکالیف ترم', href: `/student/homeworks/term/${resolvedParams.id}`, active: true },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Clock className="h-3 w-3" />
            در انتظار
          </span>
        );
      case 'submitted':
        return (
          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <CheckCircle className="h-3 w-3" />
            ارسال شده
          </span>
        );
      case 'graded':
        return (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="h-3 w-3" />
            نمره داده شده
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
            <XCircle className="h-3 w-3" />
            رد شده
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            {status}
          </span>
        );
    }
  };

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

  if (!homeworks || homeworks.length === 0) {
    return (
      <div className="space-y-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />

        <Card className="p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              هیچ تکلیفی وجود ندارد
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              در حال حاضر هیچ تکلیفی برای این ترم ثبت نشده است.
            </p>
            <Button
              onClick={() => router.push('/student/homeworks')}
              className="inline-flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت به لیست ترم‌ها
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
          تکالیف ترم
        </h1>
        <Button
          onClick={() => router.push('/student/homeworks')}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {homeworks.map((homework) => (
          <Card key={homework.id} className="p-6 transition-shadow hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {homework.description || 'تکلیف'}
                  </h3>
                  {homework.status && getStatusBadge(homework.status)}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  {homework.term?.title && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <BookOpen className="h-4 w-4" />
                      <span>{homework.term.title}</span>
                    </div>
                  )}
                  {homework.schedule?.session_date && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>جلسه: {homework.schedule.session_date}</span>
                    </div>
                  )}
                  {homework.schedule?.start_time && homework.schedule?.end_time && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span>{homework.schedule.start_time} - {homework.schedule.end_time}</span>
                    </div>
                  )}
                  {homework.teacher && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <BookOpen className="h-4 w-4" />
                      <span>مدرس: {homework.teacher.first_name} {homework.teacher.last_name}</span>
                    </div>
                  )}
                  {homework.file_url && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FileText className="h-4 w-4" />
                      <a 
                        href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${homework.file_url}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        دانلود فایل تکلیف
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={() => router.push(`/student/homeworks/${homework.id}`)}
                className="mr-4"
                variant="secondary"
              >
                <FileText className="mr-2 h-4 w-4" />
                مشاهده جزئیات
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
