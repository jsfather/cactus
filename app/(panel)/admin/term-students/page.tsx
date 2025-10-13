'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Hooks
import { useTerm } from '@/app/lib/hooks/use-term';

// Components
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Card from '@/app/components/ui/Card';

// Icons
import { Plus, Users, Calendar, Clock, Trophy } from 'lucide-react';

export default function TermStudentsPage() {
  const router = useRouter();
  const { termList, loading, fetchTermList, error } = useTerm();

  // Load terms on mount
  useEffect(() => {
    fetchTermList();
  }, [fetchTermList]);

  // Filter terms that have students
  const termsWithStudents = termList?.filter(
    (term) => term.students && term.students.length > 0
  ) || [];

  const getTermTypeLabel = (type: string) => {
    const types = {
      normal: 'عادی',
      capacity_completion: 'تکمیل ظرفیت',
      project_based: 'پروژه محور (ویژه)',
      specialized: 'گرایش تخصصی',
      ai: 'هوش مصنوعی',
    };
    return types[type as keyof typeof types] || type;
  };

  const breadcrumbItems = [
    { title: 'پنل مدیریت', href: '/admin' },
    { title: 'دانش آموزان ترم', href: '/admin/term-students' },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          خطا در بارگذاری اطلاعات: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Breadcrumbs breadcrumbs={breadcrumbItems.map(item => ({ label: item.title, href: item.href }))} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            دانش آموزان ترم
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            مدیریت دانش آموزان تخصیص یافته به ترم‌ها
          </p>
        </div>
        <Link href="/admin/term-students/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            اضافه کردن دانش آموز به ترم
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                تعداد ترم‌های فعال
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {termsWithStudents.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                کل دانش آموزان
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {termsWithStudents.reduce(
                  (total, term) => total + (term.students?.length || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                میانگین جلسات
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {termsWithStudents.length > 0
                  ? Math.round(
                      termsWithStudents.reduce(
                        (total, term) => total + term.number_of_sessions,
                        0
                      ) / termsWithStudents.length
                    )
                  : 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                میانگین مدت ترم
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {termsWithStudents.length > 0
                  ? Math.round(
                      termsWithStudents.reduce(
                        (total, term) => total + term.duration,
                        0
                      ) / termsWithStudents.length
                    )
                  : 0}{' '}
                دقیقه
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Terms List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          لیست ترم‌های دارای دانش آموز ({termsWithStudents.length} ترم)
        </h2>

        {termsWithStudents.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Users className="w-16 h-16 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  هیچ ترمی با دانش آموز یافت نشد
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  ترم‌هایی که دانش آموز دارند اینجا نمایش داده می‌شوند
                </p>
                <Link href="/admin/term-students/new">
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    اضافه کردن دانش آموز به ترم
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {termsWithStudents.map((term) => (
              <Card key={term.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Term Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {term.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          {getTermTypeLabel(term.type)}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                          {term.level.label} - {term.level.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        قیمت
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {term.price.toLocaleString()} تومان
                      </p>
                    </div>
                  </div>

                  {/* Term Details */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        تاریخ شروع
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {term.start_date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        تاریخ پایان
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {term.end_date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        تعداد جلسات
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {term.number_of_sessions} جلسه
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        مدت هر جلسه
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {term.duration} دقیقه
                      </p>
                    </div>
                  </div>

                  {/* Students Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        دانش آموزان ({term.students?.length || 0} از {term.capacity})
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ظرفیت: {((term.students?.length || 0) / term.capacity * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {term.students?.map((student, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {student.user ? student.user.first_name[0] : '؟'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {student.user
                                ? `${student.user.first_name} ${student.user.last_name}`
                                : 'نام نامشخص'}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {student.user?.phone || 'شماره تلفن نامشخص'}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {student.user?.role}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Teachers Section */}
                  {term.teachers && term.teachers.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        مدرس‌ان ({term.teachers.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {term.teachers.map((teacher) => (
                          <span
                            key={teacher.id}
                            className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                          >
                            {teacher.user
                              ? `${teacher.user.first_name} ${teacher.user.last_name}`
                              : `مدرس ${teacher.id}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
