'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Hooks
import { useTerm } from '@/app/lib/hooks/use-term';

// Components
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Card from '@/app/components/ui/Card';
import ConfirmModal from '@/app/components/ui/ConfirmModal';

// Services
import { termStudentService } from '@/app/lib/services/term-student.service';

// Icons
import { Plus, Users, Calendar, Clock, Trophy, Trash2 } from 'lucide-react';

export default function TermStudentsPage() {
  const router = useRouter();
  const { termList, loading, fetchTermList, error } = useTerm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{
    termId: number;
    userId: number;
    userName: string;
    termTitle: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load terms on mount
  useEffect(() => {
    fetchTermList();
  }, [fetchTermList]);

  // Filter terms that have students
  const termsWithStudents =
    termList?.filter((term) => term.students && term.students.length > 0) || [];

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

  const handleDeleteClick = (
    termId: number,
    userId: number,
    userName: string,
    termTitle: string
  ) => {
    setStudentToDelete({ termId, userId, userName, termTitle });
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setStudentToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    try {
      setDeleteLoading(true);
      await termStudentService.deleteStudentFromTerm({
        term_id: studentToDelete.termId,
        user_id: studentToDelete.userId,
      });
      toast.success('دانش آموز با موفقیت از ترم حذف شد');
      setShowDeleteModal(false);
      setStudentToDelete(null);
      // Refresh the list
      fetchTermList();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast.error(
        error.response?.data?.message || 'خطا در حذف دانش آموز از ترم'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const breadcrumbItems = [
    { title: 'پنل مدیریت', href: '/admin' },
    { title: 'دانش آموزان ترم', href: '/admin/term-students' },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-[400px] items-center justify-center">
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
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Breadcrumbs
            breadcrumbs={breadcrumbItems.map((item) => ({
              label: item.title,
              href: item.href,
            }))}
          />
          <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            دانش آموزان ترم
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            مدیریت دانش آموزان تخصیص یافته به ترم‌ها
          </p>
        </div>
        <Link href="/admin/term-students/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            اضافه کردن دانش آموز به ترم
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
              <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
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
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
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
              <Users className="h-16 w-16 text-gray-400" />
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  هیچ ترمی با دانش آموز یافت نشد
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  ترم‌هایی که دانش آموز دارند اینجا نمایش داده می‌شوند
                </p>
                <Link href="/admin/term-students/new">
                  <Button>
                    <Plus className="ml-2 h-4 w-4" />
                    اضافه کردن دانش آموز به ترم
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {termsWithStudents.map((term) => (
              <Card
                key={term.id}
                className="p-6 transition-shadow hover:shadow-lg"
              >
                <div className="space-y-4">
                  {/* Term Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {term.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {getTermTypeLabel(term.type)}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
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
                  <div className="grid grid-cols-2 gap-4 border-y border-gray-200 py-3 dark:border-gray-700">
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
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                        <Users className="h-4 w-4" />
                        دانش آموزان ({term.students?.length || 0} از{' '}
                        {term.capacity})
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ظرفیت:{' '}
                        {(
                          ((term.students?.length || 0) / term.capacity) *
                          100
                        ).toFixed(0)}
                        %
                      </div>
                    </div>

                    <div className="max-h-48 space-y-2 overflow-y-auto">
                      {term.students?.map((student, index) => (
                        <div
                          key={index}
                          className="group flex items-center gap-3 rounded-lg bg-gray-50 p-2 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {student.user ? student.user.first_name[0] : '؟'}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
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
                          {student.user && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Delete clicked', {
                                  termId: term.id,
                                  userId: student.user.id,
                                  userName: `${student.user.first_name} ${student.user.last_name}`,
                                  termTitle: term.title,
                                });
                                handleDeleteClick(
                                  typeof term.id === 'number'
                                    ? term.id
                                    : parseInt(term.id),
                                  student.user.id,
                                  `${student.user.first_name} ${student.user.last_name}`,
                                  term.title
                                );
                              }}
                              className="flex-shrink-0 rounded p-1.5 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                              title="حذف دانش آموز"
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Teachers Section */}
                  {term.teachers && term.teachers.length > 0 && (
                    <div>
                      <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                        مدرس‌ان ({term.teachers.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {term.teachers.map((teacher) => (
                          <span
                            key={teacher.id}
                            className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200"
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="حذف دانش آموز از ترم"
        message={
          studentToDelete ? (
            <div className="space-y-2">
              <p>
                آیا از حذف{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {studentToDelete.userName}
                </span>{' '}
                از ترم{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {studentToDelete.termTitle}
                </span>{' '}
                اطمینان دارید؟
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                این عملیات قابل بازگشت نیست و دانش آموز از لیست این ترم حذف
                خواهد شد.
              </p>
            </div>
          ) : (
            ''
          )
        }
        confirmText="حذف"
        cancelText="انصراف"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
}
