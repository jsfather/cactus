'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card } from '@/app/components/ui/Card';
import { useStudent } from '@/app/lib/hooks/use-student';
import {
  ArrowRight,
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  Briefcase,
  Heart,
  FileText,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  CreditCard,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StudentViewPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currentStudent, loading, fetchStudentById } = useStudent();

  useEffect(() => {
    if (resolvedParams.id) {
      fetchStudentById(resolvedParams.id);
    }
  }, [resolvedParams.id, fetchStudentById]);

  const breadcrumbItems = [
    { label: 'پنل مدیریت', href: '/admin' },
    { label: 'دانش‌آموزان', href: '/admin/students' },
    {
      label: 'مشاهده جزئیات',
      href: `/admin/students/${resolvedParams.id}/view`,
      active: true,
    },
  ];

  const getTermTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      normal: 'عادی',
      capacity_completion: 'تکمیل ظرفیت',
      project_based: 'پروژه‌محور',
      specialized: 'تخصصی',
      ai: 'هوش مصنوعی',
    };
    return types[type] || type;
  };

  const getFileTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      certificate: 'گواهینامه',
      national_card: 'کارت ملی',
      birth_certificate: 'شناسنامه',
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentStudent) {
    return (
      <div className="space-y-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
        <Card className="p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              دانش‌آموز یافت نشد
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              دانش‌آموز مورد نظر یافت نشد یا حذف شده است.
            </p>
            <Button onClick={() => router.push('/admin/students')}>
              بازگشت به لیست دانش‌آموزان
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const student = currentStudent;
  const user = student.user;

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/admin/students')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.first_name} {user?.last_name}
          </h1>
        </div>
        <Button
          onClick={() => router.push(`/admin/students/${resolvedParams.id}`)}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          ویرایش
        </Button>
      </div>

      {/* Profile Picture */}
      {user?.profile_picture && (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${user.profile_picture}`}
              alt={`${user.first_name} ${user.last_name}`}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                تصویر پروفایل
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.first_name} {user.last_name}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* User Information */}
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <User className="h-5 w-5" />
          اطلاعات کاربری
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              نام کاربری
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user?.username || '---'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              نام
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user?.first_name || '---'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              نام خانوادگی
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user?.last_name || '---'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                تلفن همراه
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user?.phone || '---'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ایمیل
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user?.email || '---'}
              </p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              کد ملی
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user?.national_code || '---'}
            </p>
          </div>
        </div>
      </Card>

      {/* Student Information */}
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <Users className="h-5 w-5" />
          اطلاعات دانش‌آموز
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                تاریخ تولد
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {student.birth_date || '---'}
              </p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              نام پدر
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {student.father_name || '---'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              نام مادر
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {student.mother_name || '---'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                شغل پدر
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {student.father_job || '---'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                شغل مادر
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {student.mother_job || '---'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Interest & Allergy */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Heart className="h-5 w-5 text-red-500" />
            سطح علاقه و تمرکز
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                سطح علاقه
              </label>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${student.interest_level || 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.interest_level || 0}%
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                سطح تمرکز
              </label>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${student.focus_level || 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.focus_level || 0}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            آلرژی
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                وضعیت آلرژی
              </label>
              <p className="mt-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                    student.has_allergy === 1
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  }`}
                >
                  {student.has_allergy === 1 ? (
                    <>
                      <AlertCircle className="h-4 w-4" />
                      دارد
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      ندارد
                    </>
                  )}
                </span>
              </p>
            </div>
            {student.has_allergy === 1 && student.allergy_details && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  جزئیات آلرژی
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {student.allergy_details}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Files */}
      {user?.files && user.files.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <FileText className="h-5 w-5" />
            فایل‌های ضمیمه
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {user.files.map((file: any, index: number) => (
              <a
                key={index}
                href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${file.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                {file.type === 'certificate' ? (
                  <CreditCard className="h-8 w-8 text-blue-500" />
                ) : file.type === 'national_card' ? (
                  <ImageIcon className="h-8 w-8 text-green-500" />
                ) : (
                  <FileText className="h-8 w-8 text-gray-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getFileTypeLabel(file.type)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    کلیک برای مشاهده
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Terms */}
      {user?.terms && user.terms.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <BookOpen className="h-5 w-5" />
            ترم‌های ثبت‌نام شده ({user.terms.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {user.terms.map((term: any) => (
              <Card
                key={term.id}
                className="border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {term.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        term.active === 1
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }`}
                    >
                      {term.active === 1 ? 'فعال' : 'غیرفعال'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                        {getTermTypeLabel(term.type)}
                      </span>
                      {term.level && (
                        <span className="text-xs">
                          سطح: {term.level.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {term.start_date} تا {term.end_date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {term.number_of_sessions} جلسه، {term.duration} دقیقه
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>ظرفیت: {term.capacity} نفر</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* No Terms Message */}
      {(!user?.terms || user.terms.length === 0) && (
        <Card className="p-8">
          <div className="text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              هیچ ترمی یافت نشد
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              این دانش‌آموز هنوز در هیچ ترمی ثبت‌نام نکرده است.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
