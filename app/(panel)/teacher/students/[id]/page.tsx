'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTeacherStudent } from '@/app/lib/hooks/use-teacher-student';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import {
  User,
  Phone,
  Calendar,
  Users,
  Heart,
  Brain,
  AlertTriangle,
  GraduationCap,
  FileText,
  ArrowRight,
} from 'lucide-react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Button } from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const { currentStudent, loading, fetchStudentById, clearCurrentStudent } =
    useTeacherStudent();

  useEffect(() => {
    if (studentId) {
      fetchStudentById(studentId);
    }

    return () => {
      clearCurrentStudent();
    };
  }, [studentId, fetchStudentById, clearCurrentStudent]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentStudent) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            دانش‌پژوه یافت نشد
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            ممکن است این دانش‌پژوه حذف شده باشد یا شناسه اشتباه باشد.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push('/teacher/students')}
          >
            بازگشت به لیست دانش‌پژوهان
          </Button>
        </div>
      </div>
    );
  }

  const user = currentStudent.user;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدرس', href: '/teacher' },
          { label: 'دانش‌پژوهان من', href: '/teacher/students' },
          {
            label: user
              ? `${user.first_name} ${user.last_name}`
              : `دانش‌پژوه ${currentStudent.user_id}`,
            href: `/teacher/students/${currentStudent.user_id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              variant="secondary"
              onClick={() => router.push('/teacher/students')}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {user
                  ? `${user.first_name} ${user.last_name}`
                  : `دانش‌پژوه ${currentStudent.user_id}`}
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                مشاهده جزئیات دانش‌پژوه
              </p>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <div className="p-6">
              <div className="mb-4 flex items-center">
                <User className="ml-2 h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  اطلاعات شخصی
                </h3>
              </div>

              <div className="space-y-4">
                {user && (
                  <>
                    <div className="mb-6 flex items-center justify-center">
                      {user.profile_picture ? (
                        <img
                          className="h-20 w-20 rounded-full"
                          src={user.profile_picture}
                          alt={`${user.first_name} ${user.last_name}`}
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                          <User className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        نام و نام خانوادگی
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {user.first_name} {user.last_name}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        نام کاربری
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {user.username}
                      </p>
                    </div>

                    {user.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          شماره تماس
                        </label>
                        <div className="flex items-center">
                          <Phone className="ml-2 h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          ایمیل
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {user.email}
                        </p>
                      </div>
                    )}

                    {user.national_code && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          کد ملی
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {user.national_code}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {currentStudent.birth_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      تاریخ تولد
                    </label>
                    <div className="flex items-center">
                      <Calendar className="ml-2 h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {new Date(currentStudent.birth_date).toLocaleDateString(
                          'fa-IR'
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {currentStudent.level_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      سطح تحصیلی
                    </label>
                    <div className="flex items-center">
                      <GraduationCap className="ml-2 h-4 w-4 text-gray-400" />
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        سطح {currentStudent.level_id}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Family Information */}
          <Card>
            <div className="p-6">
              <div className="mb-4 flex items-center">
                <Users className="ml-2 h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  اطلاعات خانوادگی
                </h3>
              </div>

              <div className="space-y-4">
                {currentStudent.father_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      نام پدر
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {currentStudent.father_name}
                    </p>
                  </div>
                )}

                {currentStudent.mother_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      نام مادر
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {currentStudent.mother_name}
                    </p>
                  </div>
                )}

                {currentStudent.father_job && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      شغل پدر
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {currentStudent.father_job}
                    </p>
                  </div>
                )}

                {currentStudent.mother_job && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      شغل مادر
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {currentStudent.mother_job}
                    </p>
                  </div>
                )}

                {!currentStudent.father_name &&
                  !currentStudent.mother_name &&
                  !currentStudent.father_job &&
                  !currentStudent.mother_job && (
                    <div className="py-8 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        اطلاعات خانوادگی ثبت نشده است
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </Card>

          {/* Performance Information */}
          <Card>
            <div className="p-6">
              <div className="mb-4 flex items-center">
                <Brain className="ml-2 h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  وضعیت تحصیلی
                </h3>
              </div>

              <div className="space-y-4">
                {currentStudent.interest_level !== null && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      سطح علاقه
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="ml-3 h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${currentStudent.interest_level}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {currentStudent.interest_level}%
                      </span>
                    </div>
                  </div>
                )}

                {currentStudent.focus_level !== null && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      سطح تمرکز
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="ml-3 h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: `${currentStudent.focus_level}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {currentStudent.focus_level}%
                      </span>
                    </div>
                  </div>
                )}

                {currentStudent.interest_level === null &&
                  currentStudent.focus_level === null && (
                    <div className="py-8 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        اطلاعات عملکرد ثبت نشده است
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </Card>

          {/* Health Information */}
          <Card>
            <div className="p-6">
              <div className="mb-4 flex items-center">
                <Heart className="ml-2 h-5 w-5 text-red-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  اطلاعات سلامتی
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    وضعیت حساسیت
                  </label>
                  <div className="flex items-center">
                    {currentStudent.has_allergy === 1 ? (
                      <>
                        <AlertTriangle className="ml-2 h-4 w-4 text-red-500" />
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                          دارای حساسیت
                        </span>
                      </>
                    ) : (
                      <>
                        <Heart className="ml-2 h-4 w-4 text-green-500" />
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                          بدون حساسیت
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {currentStudent.allergy_details && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      جزئیات حساسیت
                    </label>
                    <p className="rounded-md bg-red-50 p-3 text-sm text-gray-900 dark:bg-red-900/20 dark:text-gray-100">
                      {currentStudent.allergy_details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Files Section */}
        {user && user.files && user.files.length > 0 && (
          <Card className="mt-6">
            <div className="p-6">
              <div className="mb-4 flex items-center">
                <FileText className="ml-2 h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  فایل‌های ضمیمه
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {user.files.map((file, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center">
                      <FileText className="ml-3 h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {file.type === 'certificate'
                            ? 'گواهینامه'
                            : file.type === 'national_card'
                              ? 'کارت ملی'
                              : file.type === 'profile_picture'
                                ? 'تصویر پروفایل'
                                : file.type}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {file.file_path.split('/').pop()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
