'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Eye, Edit, Calendar, Clock, User, BookOpen } from 'lucide-react';

// New implementation
import { useTermTeacher } from '@/app/lib/hooks/use-term-teacher';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const {
    currentTermTeacher,
    loading,
    error,
    fetchTermTeacherById,
  } = useTermTeacher();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTermTeacherById(resolvedParams.id);
      } catch (error) {
        console.error('Error fetching term teacher:', error);
        toast.error('خطا در بارگذاری اطلاعات ترم مدرس');
        router.push('/admin/term-teachers');
      }
    };

    loadData();
  }, [resolvedParams.id, fetchTermTeacherById, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      router.push('/admin/term-teachers');
    }
  }, [error, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentTermTeacher) {
    return null;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم مدرسین', href: '/admin/term-teachers' },
          {
            label: `${currentTermTeacher.user?.first_name || 'نامشخص'} ${currentTermTeacher.user?.last_name || ''}`,
            href: `/admin/term-teachers/${resolvedParams.id}/view`,
            active: true,
          },
        ]}
      />

      <div className="mt-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              جزئیات ترم مدرس
            </h1>
          </div>
          <Button
            onClick={() => router.push(`/admin/term-teachers/${resolvedParams.id}`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            ویرایش
          </Button>
        </div>

        {/* Teacher Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              اطلاعات مدرس
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                نام کامل
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentTermTeacher.user?.first_name || 'نامشخص'} {currentTermTeacher.user?.last_name || ''}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                شماره تماس
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentTermTeacher.user?.phone || 'ثبت نشده'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ایمیل
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentTermTeacher.user?.email || 'ثبت نشده'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                نام کاربری
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentTermTeacher.user?.username || 'ثبت نشده'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                کد ملی
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentTermTeacher.user?.national_code || 'ثبت نشده'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                نقش
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {currentTermTeacher.user?.role || 'ثبت نشده'}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule (Days) */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              برنامه کلاس‌ها
            </h2>
          </div>
          {currentTermTeacher.days && currentTermTeacher.days.length > 0 ? (
            <div className="space-y-3">
              {currentTermTeacher.days.map((day: any, index: number) => (
                <div
                  key={day.id || index}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {day.day_of_week}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {day.start_time} - {day.end_time}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              هیچ برنامه‌ای برای این ترم تعریف نشده است
            </p>
          )}
        </div>

        {/* Sessions (Schedules) */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              جلسات برنامه‌ریزی شده ({currentTermTeacher.schedules?.length || 0})
            </h2>
          </div>
          {currentTermTeacher.schedules && currentTermTeacher.schedules.length > 0 ? (
            <div className="space-y-3">
              {currentTermTeacher.schedules.slice(0, 10).map((schedule: any, index: number) => (
                <div
                  key={schedule.id || index}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {schedule.session_date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="h-3 w-3" />
                    {schedule.start_time} - {schedule.end_time}
                    {schedule.is_canceled === 1 && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        لغو شده
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {currentTermTeacher.schedules.length > 10 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  و {currentTermTeacher.schedules.length - 10} جلسه دیگر...
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              هیچ جلسه‌ای برای این ترم برنامه‌ریزی نشده است
            </p>
          )}
        </div>

        {/* Files */}
        {currentTermTeacher.user?.files && currentTermTeacher.user.files.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                فایل‌های مدرس
              </h2>
            </div>
            <div className="space-y-3">
              {currentTermTeacher.user.files.map((file: any, index: number) => (
                <div
                  key={file.id || index}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {file.type === 'certificate' ? 'مدرک' : file.type === 'national_card' ? 'کارت ملی' : file.type}
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => window.open(file.file_path, '_blank')}
                  >
                    مشاهده
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-start gap-3">
          <Button
            onClick={() => router.push(`/admin/term-teachers/${resolvedParams.id}`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            ویرایش
          </Button>
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/term-teachers')}
          >
            بازگشت
          </Button>
        </div>
      </div>
    </main>
  );
}
