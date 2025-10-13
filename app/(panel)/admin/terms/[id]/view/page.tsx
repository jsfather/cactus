'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ArrowRight, Users, Calendar, Clock, MapPin, Star, User, Phone, Mail } from 'lucide-react';

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
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

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
      href: `/admin/terms/${resolvedParams?.id}/view` 
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
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentTerm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ترم یافت نشد
          </h2>
          <Button onClick={() => router.push('/admin/terms')}>
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت به لیست ترم‌ها
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
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
          <Button
            variant="white"
            onClick={() => router.push('/admin/terms')}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            بازگشت
          </Button>
        </div>
      </div>

      {/* Term Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <Star className="w-8 h-8 text-yellow-500" />
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
            <Users className="w-8 h-8 text-blue-500" />
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
            <Calendar className="w-8 h-8 text-green-500" />
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
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Term Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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
              <span className="text-gray-600 dark:text-gray-400">تاریخ شروع:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatDate(currentTerm.start_date)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">تاریخ پایان:</span>
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
          </div>
        </Card>

        {/* Schedule Information */}
        {currentTerm.teachers && currentTerm.teachers.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              برنامه کلاس‌ها
            </h3>
            <div className="space-y-4">
              {currentTerm.teachers[0].days?.map((day) => (
                <div key={day.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            دانش‌آموزان ثبت‌نام شده ({currentTerm.students?.length || 0})
          </h3>
        </div>

        {currentTerm.students && currentTerm.students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTerm.students.map((student: TermStudent, index: number) => (
              <Card key={student.user.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {student.user.profile_picture ? (
                      <img
                        src={student.user.profile_picture.startsWith('http') ? student.user.profile_picture : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${student.user.profile_picture}`}
                        alt={`${student.user.first_name} ${student.user.last_name}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {student.user.first_name} {student.user.last_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      کاربر #{student.user.id}
                    </p>
                    
                    <div className="space-y-1">
                      {student.user.phone && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4 mr-2" />
                          {student.user.phone}
                        </div>
                      )}
                      {student.user.email && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4 mr-2" />
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
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              هنوز هیچ دانش‌آموزی ثبت‌نام نکرده
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              زمانی که دانش‌آموزان ثبت‌نام کنند، اینجا نمایش داده خواهند شد
            </p>
          </div>
        )}
      </Card>

      {/* Sessions Schedule (if available) */}
      {currentTerm.teachers && currentTerm.teachers[0]?.schedules && currentTerm.teachers[0].schedules.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            برنامه جلسات ({currentTerm.teachers[0].schedules.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    شماره جلسه
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    تاریخ
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    زمان شروع
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    زمان پایان
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTerm.teachers[0].schedules
                  .sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime())
                  .map((schedule: Schedule, index: number) => (
                    <tr key={schedule.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        جلسه {index + 1}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {formatDate(schedule.session_date)}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {formatTime(schedule.start_time)}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
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