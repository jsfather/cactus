'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card } from '@/app/components/ui/Card';
import { useTeacherTerm } from '@/app/lib/hooks/use-teacher-term';
import { getTeacherTermTypeLabel } from '@/app/lib/types/teacher-term';
import { formatDateToPersian } from '@/app/lib/utils';
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  User,
  Phone,
  IdCard,
  CheckCircle,
  XCircle,
  CalendarDays,
  Timer,
  UserCheck,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
} from 'lucide-react';

export default function TeacherTermDetailPage() {
  const params = useParams();
  const router = useRouter();
  const termId = params.id as string;

  const { currentTerm, loading, fetchTermById, clearCurrentTerm } =
    useTeacherTerm();

  useEffect(() => {
    if (termId) {
      fetchTermById(termId);
    }

    return () => {
      clearCurrentTerm();
    };
  }, [termId, fetchTermById, clearCurrentTerm]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentTerm) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              ترم یافت نشد
            </h1>
            <Button
              onClick={() => router.push('/teacher/terms')}
              className="mt-4"
            >
              بازگشت به لیست ترم‌ها
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const enrolledStudents = currentTerm.students?.filter((s) => s.user) || [];
  const emptySlots = currentTerm.capacity - enrolledStudents.length;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          breadcrumbs={[
            { label: 'داشبورد مدرس', href: '/teacher' },
            { label: 'ترم‌های من', href: '/teacher/terms' },
            {
              label: currentTerm.title,
              href: `/teacher/terms/${currentTerm.id}`,
            },
          ]}
        />

        {/* Header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentTerm.title}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              جزئیات کامل ترم و برنامه‌های کلاسی
            </p>
          </div>
          <Button
            onClick={() => router.push('/teacher/terms')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به لیست
          </Button>
        </div>

        {/* Term Overview Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    تعداد جلسات
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {currentTerm.number_of_sessions.toLocaleString('fa-IR')}{' '}
                    جلسه
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    مدت هر جلسه
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {currentTerm.duration.toLocaleString('fa-IR')} دقیقه
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    دانش‌پژوهان
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {enrolledStudents.length.toLocaleString('fa-IR')} /{' '}
                    {currentTerm.capacity.toLocaleString('fa-IR')}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GraduationCap className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    سطح ترم
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {currentTerm.level.name} - {currentTerm.level.label}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Term Information */}
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              اطلاعات ترم
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 py-2 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  نوع ترم:
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    currentTerm.type === 'normal'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : currentTerm.type === 'capacity_completion'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : currentTerm.type === 'project_based'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                          : currentTerm.type === 'specialized'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : currentTerm.type === 'ai'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  }`}
                >
                  {getTeacherTermTypeLabel(currentTerm.type)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 py-2 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  تاریخ شروع:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDateToPersian(currentTerm.start_date)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 py-2 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  تاریخ پایان:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {formatDateToPersian(currentTerm.end_date)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 py-2 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  قیمت:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('fa-IR').format(currentTerm.price)}{' '}
                  تومان
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  ترتیب:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {currentTerm.sort}
                </span>
              </div>
            </div>
          </Card>

          {/* Class Schedule */}
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              برنامه کلاس‌ها
            </h2>

            {currentTerm.teachers && currentTerm.teachers.length > 0 ? (
              <div className="space-y-6">
                {currentTerm.teachers.map((teacher, teacherIndex) => (
                  <div key={teacherIndex}>
                    {teacher.days && teacher.days.length > 0 && (
                      <div>
                        <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                          برنامه هفتگی:
                        </h3>
                        <div className="space-y-2">
                          {teacher.days.map((day, dayIndex) => (
                            <div
                              key={dayIndex}
                              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800"
                            >
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {day.day_of_week}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Timer className="h-4 w-4" />
                                {day.start_time.substring(0, 5)} -{' '}
                                {day.end_time.substring(0, 5)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  برنامه کلاسی تعریف نشده است
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Sessions Schedule */}
        {currentTerm.teachers &&
          currentTerm.teachers.some((t) => t.schedules?.length > 0) && (
            <Card className="mt-8 p-6">
              <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                برنامه جلسات
              </h2>

              <div className="space-y-6">
                {currentTerm.teachers.map(
                  (teacher, teacherIndex) =>
                    teacher.schedules &&
                    teacher.schedules.length > 0 && (
                      <div key={teacherIndex}>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {teacher.schedules.map((schedule, scheduleIndex) => (
                            <div
                              key={scheduleIndex}
                              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                            >
                              <div className="mb-2 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  جلسه {scheduleIndex + 1}
                                </span>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    تاریخ:
                                  </span>
                                  <span className="text-gray-900 dark:text-white">
                                    {formatDateToPersian(schedule.session_date)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    زمان:
                                  </span>
                                  <span className="text-gray-900 dark:text-white">
                                    {schedule.start_time.substring(0, 5)} -{' '}
                                    {schedule.end_time.substring(0, 5)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    تکالیف:
                                  </span>
                                  <span className="text-gray-900 dark:text-white">
                                    {schedule.homeworks?.length || 0} مورد
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                )}
              </div>
            </Card>
          )}

        {/* Students List */}
        <Card className="mt-8 p-6">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            لیست دانش‌پژوهان ({enrolledStudents.length} از{' '}
            {currentTerm.capacity} نفر)
          </h2>

          <div className="mb-4">
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{
                  width: `${Math.min((enrolledStudents.length / currentTerm.capacity) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>تکمیل شده: {enrolledStudents.length} نفر</span>
              <span>باقی‌مانده: {emptySlots} نفر</span>
            </div>
          </div>

          {enrolledStudents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledStudents.map(
                (student, index) =>
                  student.user && (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {student.user.profile_picture ? (
                            <img
                              src={student.user.profile_picture}
                              alt={`${student.user.first_name} ${student.user.last_name}`}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                              <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {student.user.first_name} {student.user.last_name}
                          </h3>
                          <div className="mt-1 space-y-1">
                            {student.user.phone && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Phone className="h-3 w-3" />
                                {student.user.phone}
                              </div>
                            )}
                            {student.user.national_code && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <IdCard className="h-3 w-3" />
                                {student.user.national_code}
                              </div>
                            )}
                            {student.user.role && (
                              <div className="flex items-center gap-1 text-xs">
                                <UserCheck className="h-3 w-3" />
                                <span
                                  className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                    student.user.role === 'student'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                  }`}
                                >
                                  {student.user.role === 'student'
                                    ? 'دانش‌پژو'
                                    : student.user.role}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">
                هنوز هیچ دانش‌پژویی ثبت‌نام نکرده است
              </p>
            </div>
          )}

          {/* Empty slots display */}
          {emptySlots > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <AlertCircle className="h-4 w-4" />
                <span>{emptySlots} ظرفیت خالی باقی مانده است</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
