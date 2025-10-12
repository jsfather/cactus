'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useStudentTerm } from '@/app/lib/hooks/use-student-term';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card } from '@/app/components/ui/Card';
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  MapPin,
  User,
  GraduationCap,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function StudentTermDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currentTerm, loading, error, getTermById, clearTerm, resetError } =
    useStudentTerm();

  useEffect(() => {
    const fetchTerm = async () => {
      try {
        await getTermById(resolvedParams.id);
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات ترم');
        router.push('/student/terms');
      }
    };

    fetchTerm();

    return () => {
      clearTerm();
    };
  }, [resolvedParams.id, getTermById, clearTerm, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      resetError();
      router.push('/student/terms');
    }
  }, [error, resetError, router]);

  const getTermTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      normal: 'عادی',
      capacity_completion: 'تکمیل ظرفیت',
      project_based: 'پروژه محور',
      specialized: 'گرایش تخصصی',
      ai: 'هوش مصنوعی',
    };
    return typeLabels[type] || type;
  };

  const formatTime = (time: string): string => {
    return time.substring(0, 5); // Convert HH:mm:ss to HH:mm
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const getAttendanceStatus = (schedule: any) => {
    const now = new Date();
    const sessionDate = new Date(schedule.session_date);
    
    // If myAttendance exists, use it
    if (schedule.myAttendance !== null && schedule.myAttendance !== undefined) {
      return {
        label: 'حاضر',
        color: 'text-green-800 dark:text-green-300',
        icon: CheckCircle,
      };
    }
    
    // If session is in the past and myAttendance is null, student was absent
    if (sessionDate < now) {
      return {
        label: 'غایب',
        color: 'text-red-800 dark:text-red-300',
        icon: XCircle,
      };
    }
    
    // If session is in the future
    return {
      label: 'آینده',
      color: 'text-blue-800 dark:text-blue-300',
      icon: Clock,
    };
  };

  const getTermStatus = (): { label: string; color: string; icon: any } => {
    if (!currentTerm) return { label: '', color: '', icon: null };

    // Use schedules to determine status since start_date and end_date are in Jalali format
    const now = new Date();
    const schedules = currentTerm.schedules || [];
    
    if (schedules.length === 0) {
      return {
        label: 'بدون جلسه',
        color: 'text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-300',
        icon: Clock,
      };
    }

    const sessionDates = schedules.map(s => new Date(s.session_date));
    const firstSession = new Date(Math.min(...sessionDates.map(d => d.getTime())));
    const lastSession = new Date(Math.max(...sessionDates.map(d => d.getTime())));

    if (firstSession > now) {
      return {
        label: 'آینده',
        color:
          'text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
        icon: Clock,
      };
    } else if (lastSession < now) {
      return {
        label: 'تمام شده',
        color: 'text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-300',
        icon: CheckCircle,
      };
    } else {
      return {
        label: 'در حال برگزاری',
        color:
          'text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300',
        icon: BookOpen,
      };
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentTerm) {
    return (
      <main>
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">ترم یافت نشد</p>
          <Button
            onClick={() => router.push('/student/terms')}
            variant="white"
            className="mt-4"
          >
            بازگشت به لیست ترم‌ها
          </Button>
        </div>
      </main>
    );
  }

  const status = getTermStatus();
  const StatusIcon = status.icon;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم‌ها', href: '/student/terms' },
          {
            label: currentTerm.term.title,
            href: `/student/terms/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentTerm.term.title}
            </h1>
            <div className="mt-2 flex items-center gap-4">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${status.color}`}
              >
                <StatusIcon className="h-4 w-4" />
                {status.label}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                سطح: {currentTerm.term.level.label} (
                {currentTerm.term.level.name})
              </span>
            </div>
          </div>
        </div>

        {/* Term Information */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <BookOpen className="h-5 w-5" />
              اطلاعات ترم
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    نوع ترم
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {getTermTypeLabel(currentTerm.term.type)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ظرفیت
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {currentTerm.term.capacity} نفر
                  </dd>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    مدت زمان هر جلسه
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {currentTerm.term.duration} دقیقه
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    تعداد جلسات
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {currentTerm.term.number_of_sessions} جلسه
                  </dd>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    تاریخ شروع
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {currentTerm.term.start_date}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    تاریخ پایان
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {currentTerm.term.end_date}
                  </dd>
                </div>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  هزینه
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatPrice(currentTerm.term.price)}
                </dd>
              </div>
            </div>
          </Card>

          {/* Teacher Info */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <User className="h-5 w-5" />
              مدرس ترم
            </h2>
            <div className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  نام کامل
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {currentTerm.user.first_name} {currentTerm.user.last_name}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  نام کاربری
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {currentTerm.user.username}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  شماره تماس
                </dt>
                <dd
                  className="mt-1 text-sm text-gray-900 dark:text-white"
                  dir="ltr"
                >
                  {currentTerm.user.phone}
                </dd>
              </div>

              {currentTerm.user.email && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ایمیل
                  </dt>
                  <dd
                    className="mt-1 text-sm text-gray-900 dark:text-white"
                    dir="ltr"
                  >
                    {currentTerm.user.email}
                  </dd>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Schedule Info */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Calendar className="h-5 w-5" />
            برنامه کلاسی
          </h2>

          {/* Weekly Schedule */}
          <div className="mb-6">
            <h3 className="text-md mb-3 font-medium text-gray-900 dark:text-white">
              روزهای هفته
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {currentTerm.days.map((day) => (
                <div
                  key={day.id}
                  className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {day.day_of_week}
                  </div>
                  <div
                    className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                    dir="ltr"
                  >
                    {formatTime(day.start_time)} - {formatTime(day.end_time)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Schedule */}
          <div>
            <h3 className="text-md mb-3 font-medium text-gray-900 dark:text-white">
              برنامه جلسات
            </h3>
            <div className="ring-opacity-5 overflow-hidden shadow ring-1 ring-black md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      تاریخ جلسه
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      زمان شروع
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      زمان پایان
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      حضور و غیاب
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {currentTerm.schedules
                    .sort(
                      (a, b) =>
                        new Date(a.session_date).getTime() -
                        new Date(b.session_date).getTime()
                    )
                    .map((schedule) => (
                      <tr key={schedule.id}>
                        <td className="px-6 py-4 text-sm text-right whitespace-nowrap text-gray-900 dark:text-white">
                          {new Date(schedule.session_date).toLocaleDateString(
                            'fa-IR'
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-center whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {formatTime(schedule.start_time)}
                        </td>
                        <td className="px-6 py-4 text-sm text-center whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {formatTime(schedule.end_time)}
                        </td>
                        <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                          {(() => {
                            const attendanceStatus = getAttendanceStatus(schedule);
                            const StatusIcon = attendanceStatus.icon;
                            return (
                              <span className={`inline-flex items-center gap-1 ${attendanceStatus.color}`}>
                                <StatusIcon className="h-4 w-4" />
                                {attendanceStatus.label}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/student/terms')}
          >
            بازگشت به لیست ترم‌ها
          </Button>
        </div>
      </div>
    </main>
  );
}
