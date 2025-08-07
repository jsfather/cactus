'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getTermTeacher } from '@/app/lib/api/admin/term-teachers';
import { SessionRecord } from '@/app/lib/types/term_teacher';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Eye, Edit, Calendar, Clock, Users, Video } from 'lucide-react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [termTeacher, setTermTeacher] = useState<SessionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermTeacher = async () => {
      try {
        setLoading(true);
        const response = await getTermTeacher(resolvedParams.id);
        setTermTeacher(response.data);
      } catch (error) {
        console.error('Error fetching term teacher:', error);
        toast.error('خطا در بارگذاری اطلاعات ترم مدرس');
        router.push('/admin/term-teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTermTeacher();
  }, [resolvedParams.id, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!termTeacher) {
    return null;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم مدرسین', href: '/admin/term-teachers' },
          {
            label: `${termTeacher.user?.first_name || 'نامشخص'} ${termTeacher.user?.last_name || ''}`,
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
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            اطلاعات مدرس
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                نام کامل
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {termTeacher.user?.first_name || 'نامشخص'} {termTeacher.user?.last_name || ''}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                شماره تماس
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {termTeacher.user?.phone || 'ثبت نشده'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ایمیل
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {termTeacher.user?.email || 'ثبت نشده'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                کد ملی
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {termTeacher.user?.national_code || 'ثبت نشده'}
              </p>
            </div>
          </div>
        </div>

        {/* Class Schedule */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              برنامه کلاس‌ها
            </h2>
          </div>
          {termTeacher.days && termTeacher.days.length > 0 ? (
            <div className="space-y-3">
              {termTeacher.days.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-600"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {day.day_of_week}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4" />
                    {day.start_time} - {day.end_time}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              برنامه کلاسی تعریف نشده است
            </p>
          )}
        </div>

        {/* Sessions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              جلسات برگزار شده ({termTeacher.schedules?.length || 0})
            </h2>
          </div>
          {termTeacher.schedules && termTeacher.schedules.length > 0 ? (
            <div className="space-y-3">
              {termTeacher.schedules.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-600"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(schedule.session_date).toLocaleDateString('fa-IR')}
                    </p>
                    {schedule.homeworks.length > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {schedule.homeworks.length} تکلیف
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4" />
                    {schedule.start_time} - {schedule.end_time}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              هنوز جلسه‌ای برگزار نشده است
            </p>
          )}
        </div>

        {/* Offline Sessions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Video className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              جلسات ضبط شده ({termTeacher.offline_sessions?.length || 0})
            </h2>
          </div>
          {termTeacher.offline_sessions && termTeacher.offline_sessions.length > 0 ? (
            <div className="space-y-3">
              {termTeacher.offline_sessions.map((session, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-100 p-3 dark:border-gray-600"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {session.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {session.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(session.created_at).toLocaleDateString('fa-IR')}
                    </span>
                    {session.homeworks.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {session.homeworks.length} تکلیف
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              جلسه ضبط شده‌ای وجود ندارد
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/term-teachers')}
          >
            بازگشت
          </Button>
          <Button
            onClick={() => router.push(`/admin/term-teachers/${resolvedParams.id}`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            ویرایش
          </Button>
        </div>
      </div>
    </main>
  );
}
