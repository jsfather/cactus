'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useTermTeacher } from '@/app/lib/hooks/use-term-teacher';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card } from '@/app/components/ui/Card';
import {
  ArrowRight,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  Users,
  MapPin,
  GraduationCap,
  Image as ImageIcon,
  Download,
  Eye,
} from 'lucide-react';

const dayOfWeekColors = {
  شنبه: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  یکشنبه:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  دوشنبه:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  سه‌شنبه:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  چهارشنبه: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  پنج‌شنبه:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  جمعه: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

const formatTime = (timeString: string) => {
  try {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  } catch {
    return timeString;
  }
};

const getFileTypeIcon = (type: string) => {
  switch (type) {
    case 'certificate':
      return <GraduationCap className="h-4 w-4" />;
    case 'national_card':
      return <FileText className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getFileTypeLabel = (type: string) => {
  switch (type) {
    case 'certificate':
      return 'گواهینامه';
    case 'national_card':
      return 'کارت ملی';
    default:
      return 'سند';
  }
};

export default function TermTeacherViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const {
    currentTermTeacher,
    loading,
    error,
    fetchTermTeacherById,
    clearError,
  } = useTermTeacher();

  useEffect(() => {
    if (resolvedParams.id) {
      fetchTermTeacherById(resolvedParams.id);
    }
  }, [resolvedParams.id, fetchTermTeacherById]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleBack = () => {
    router.push('/admin/term-teachers');
  };

  const breadcrumbItems = [
    { label: 'پنل مدیریت', href: '/admin' },
    { label: 'مدرسین ترم', href: '/admin/term-teachers' },
    {
      label: currentTermTeacher
        ? `${currentTermTeacher.user.first_name} ${currentTermTeacher.user.last_name}`
        : 'مشاهده جزئیات',
      href: `/admin/term-teachers/${resolvedParams.id}/view`,
      active: true,
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentTermTeacher) {
    return (
      <div className="py-12 text-center">
        <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <p className="text-gray-500 dark:text-gray-400">
          اطلاعات مدرس ترم یافت نشد
        </p>
        <Button variant="secondary" onClick={handleBack} className="mt-4">
          <ArrowRight className="mr-2 h-4 w-4" />
          بازگشت به لیست
        </Button>
      </div>
    );
  }

  const { user, days, schedules } = currentTermTeacher;

  return (
    <main>
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              جزئیات مدرس ترم
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              مشاهده اطلاعات کامل مدرس و برنامه زمانی کلاس‌ها
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Teacher Information */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center">
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{user.username}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.phone}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.email || 'ایمیل ثبت نشده'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.national_code || 'کد ملی ثبت نشده'}
                  </span>
                </div>

                {user.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {user.address}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    عضویت: {formatDate(user.created_at)}
                  </span>
                </div>
              </div>

              {/* Teacher Files */}
              {user.files && user.files.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                    مدارک ارسال شده
                  </h4>
                  <div className="space-y-2">
                    {user.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          {getFileTypeIcon(file.type)}
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {getFileTypeLabel(file.type)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              window.open(file.file_path, '_blank')
                            }
                            className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900"
                            title="مشاهده"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <a
                            href={file.file_path}
                            download
                            className="rounded p-1 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900"
                            title="دانلود"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Days Schedule and Sessions */}
          <div className="space-y-6 lg:col-span-2">
            {/* Weekly Schedule */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  برنامه هفتگی کلاس‌ها
                </h3>
              </div>

              {days && days.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {days.map((day) => (
                    <div
                      key={day.id}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            dayOfWeekColors[
                              day.day_of_week as keyof typeof dayOfWeekColors
                            ] ||
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {day.day_of_week}
                        </span>
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {formatTime(day.start_time)} -{' '}
                        {formatTime(day.end_time)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Calendar className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">
                    برنامه هفتگی تعریف نشده است
                  </p>
                </div>
              )}
            </Card>

            {/* Sessions Schedule */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  جلسات برنامه‌ریزی شده
                </h3>
              </div>

              {schedules && schedules.length > 0 ? (
                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`rounded-lg border p-4 ${
                        schedule.is_canceled
                          ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDate(schedule.session_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {formatTime(schedule.start_time)} -{' '}
                              {formatTime(schedule.end_time)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {schedule.is_canceled ? (
                            <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                              لغو شده
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                              فعال
                            </span>
                          )}
                        </div>
                      </div>

                      {schedule.sky_room_id && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>شناسه اتاق: {schedule.sky_room_id}</span>
                        </div>
                      )}

                      {schedule.another_person === 1 &&
                        schedule.another_person_name && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>
                              مدرس جایگزین: {schedule.another_person_name}
                            </span>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <BookOpen className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">
                    هیچ جلسه‌ای برنامه‌ریزی نشده است
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
