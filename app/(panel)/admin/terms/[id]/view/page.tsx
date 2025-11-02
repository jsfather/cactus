'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  ArrowRight,
  Users,
  Calendar,
  Clock,
  MapPin,
  Star,
  User,
  Phone,
  Mail,
} from 'lucide-react';

// UI Components
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Card } from '@/app/components/ui/Card';

// Hooks and Types
import { useTerm } from '@/app/lib/hooks/use-term';
import { TermStudent, TermTeacher, Schedule } from '@/app/lib/types/term';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const TermViewPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const { fetchTermById, currentTerm, loading } = useTerm();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParamsData = await params;
      setResolvedParams(resolvedParamsData);

      try {
        await fetchTermById(resolvedParamsData.id);
      } catch (error) {
        toast.error('خطا در بارگذاری اطلاعات ترم');
        router.push('/admin/terms');
      }
    };

    resolveParams();
  }, [fetchTermById, router]);

  const breadcrumbItems = [
    { label: 'داشبورد', href: '/admin' },
    { label: 'مدیریت ترم‌ها', href: '/admin/terms' },
    {
      label: currentTerm?.title || 'جزئیات ترم',
      href: `/admin/terms/${resolvedParams?.id}/view`,
    },
  ];

  const getTermTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      normal: 'عادی',
      capacity_completion: 'تکمیل ظرفیت',
      project_based: 'پروژه محور(ویژه)',
      specialized: 'گرایش تخصصی',
      ai: 'هوش مصنوعی',
    };
    return typeLabels[type] || type;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const formatDate = (date: string) => {
    // Convert Persian date to a more readable format if needed
    return date;
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentTerm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            ترم یافت نشد
          </h2>
          <Button onClick={() => router.push('/admin/terms')}>
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت به لیست ترم‌ها
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            {currentTerm.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            جزئیات ترم و دانش‌آموزان ثبت‌نام شده
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => router.push(`/admin/terms/${resolvedParams?.id}`)}
          >
            ویرایش ترم
          </Button>
          <Button variant="white" onClick={() => router.push('/admin/terms')}>
            <ArrowRight className="mr-2 h-4 w-4" />
            بازگشت
          </Button>
        </div>
      </div>

      {/* Term Information Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                سطح
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentTerm.level.name} ({currentTerm.level.label})
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ظرفیت
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentTerm.students?.length || 0} / {currentTerm.capacity}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                تعداد جلسات
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentTerm.number_of_sessions}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                مدت زمان
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentTerm.duration} دقیقه
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Term Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            اطلاعات کلی ترم
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">نوع ترم:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {getTermTypeLabel(currentTerm.type)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                تاریخ شروع:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatDate(currentTerm.start_date)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                تاریخ پایان:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatDate(currentTerm.end_date)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">قیمت:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatPrice(currentTerm.price)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">ترتیب:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {currentTerm.sort}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
              <span className="mb-2 block text-gray-600 dark:text-gray-400">
                نحوه ارائه:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentTerm.is_in_person && (
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                    حضوری
                  </span>
                )}
                {currentTerm.is_online && (
                  <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-800 dark:bg-sky-900 dark:text-sky-300">
                    آنلاین
                  </span>
                )}
                {currentTerm.is_downloadable && (
                  <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800 dark:bg-violet-900 dark:text-violet-300">
                    قابل دانلود
                  </span>
                )}
                {!currentTerm.is_in_person &&
                  !currentTerm.is_online &&
                  !currentTerm.is_downloadable && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      نامشخص
                    </span>
                  )}
              </div>
            </div>
          </div>
        </Card>

        {/* Schedule Information */}
        {currentTerm.teachers && currentTerm.teachers.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              برنامه کلاس‌ها
            </h3>
            <div className="space-y-4">
              {currentTerm.teachers[0].days?.map((day) => (
                <div
                  key={day.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {day.day_of_week}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatTime(day.start_time)} - {formatTime(day.end_time)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Students List */}
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            دانش‌آموزان ثبت‌نام شده ({currentTerm.students?.length || 0})
          </h3>
        </div>

        {currentTerm.students && currentTerm.students.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentTerm.students.map((student: TermStudent, index: number) => (
              <Card key={student.user.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {student.user.profile_picture ? (
                      <img
                        src={
                          student.user.profile_picture.startsWith('http')
                            ? student.user.profile_picture
                            : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${student.user.profile_picture}`
                        }
                        alt={`${student.user.first_name} ${student.user.last_name}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                        <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-lg font-medium text-gray-900 dark:text-white">
                      {student.user.first_name} {student.user.last_name}
                    </h4>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                      کاربر #{student.user.id}
                    </p>

                    <div className="space-y-1">
                      {student.user.phone && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="mr-2 h-4 w-4" />
                          {student.user.phone}
                        </div>
                      )}
                      {student.user.email && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="mr-2 h-4 w-4" />
                          {student.user.email}
                        </div>
                      )}
                      {student.user.national_code && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          کد ملی: {student.user.national_code}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <p className="mb-2 text-lg text-gray-600 dark:text-gray-400">
              هنوز هیچ دانش‌آموزی ثبت‌نام نکرده
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              زمانی که دانش‌آموزان ثبت‌نام کنند، اینجا نمایش داده خواهند شد
            </p>
          </div>
        )}
      </Card>

      {/* Sessions Schedule (if available) */}
      {currentTerm.teachers &&
        currentTerm.teachers[0]?.schedules &&
        currentTerm.teachers[0].schedules.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              برنامه جلسات ({currentTerm.teachers[0].schedules.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      شماره جلسه
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      تاریخ
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      زمان شروع
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      زمان پایان
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentTerm.teachers[0].schedules
                    .sort(
                      (a, b) =>
                        new Date(a.session_date).getTime() -
                        new Date(b.session_date).getTime()
                    )
                    .map((schedule: Schedule, index: number) => (
                      <tr
                        key={schedule.id}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
                          جلسه {index + 1}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
                          {formatDate(schedule.session_date)}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
                          {formatTime(schedule.start_time)}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
                          {formatTime(schedule.end_time)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
    </div>
  );
};

export default TermViewPage;
