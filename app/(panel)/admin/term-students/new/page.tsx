'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';

// Hooks
import { useTermStudent } from '@/app/lib/hooks/use-term-student';
import { useTerm } from '@/app/lib/hooks/use-term';
import { useStudent } from '@/app/lib/hooks/use-student';
import { useTermTeacher } from '@/app/lib/hooks/use-term-teacher';

// Components
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Select from '@/app/components/ui/Select';
import InfiniteSelect from '@/app/components/ui/InfiniteSelect';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  UserRound,
} from 'lucide-react';

const termStudentSchema = z.object({
  user_id: z.string().min(1, 'دانش‌پژوه الزامی است'),
  term_id: z.string().optional(),
  term_teacher_id: z.string().min(1, 'مدرس ترم الزامی است'),
});

type TermStudentFormData = z.infer<typeof termStudentSchema>;

export default function CreateTermStudentPage() {
  const router = useRouter();

  // Hooks
  const {
    createTermStudent,
    loading: submitting,
    error,
    clearError,
  } = useTermStudent();
  const { termList, loading: termsLoading, fetchTermList } = useTerm();
  const {
    studentList,
    loading: studentsLoading,
    loadingMore: studentsLoadingMore,
    pagination: studentPagination,
    fetchStudentList,
    fetchMoreStudents,
    resetStudentList,
  } = useStudent();
  const {
    termTeacherList,
    loading: termTeachersLoading,
    fetchTermTeacherList,
  } = useTermTeacher();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    clearErrors,
    trigger,
  } = useForm<TermStudentFormData>({
    resolver: zodResolver(termStudentSchema),
    mode: 'onSubmit',
    defaultValues: {
      user_id: '',
      term_id: '',
      term_teacher_id: '',
    },
  });

  // Track if initial data has been loaded
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Load dropdown data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchTermList(),
        fetchStudentList(1, 50),
        fetchTermTeacherList(),
      ]);
      setInitialLoadComplete(true);
    };
    loadInitialData();
  }, [fetchTermList, fetchStudentList, fetchTermTeacherList]);

  // Handle loading more students
  const handleLoadMoreStudents = () => {
    fetchMoreStudents(50);
  };

  // Handle server-side search for students
  const handleSearchStudents = useCallback(
    (searchTerm: string) => {
      // Reset list and search with the term
      resetStudentList();
      if (searchTerm.trim()) {
        // Search by last_name
        fetchStudentList(1, 50, {
          last_name: searchTerm.trim(),
        });
      } else {
        // Empty search - load all students (pass empty object to clear filters)
        fetchStudentList(1, 50, {});
      }
    },
    [fetchStudentList, resetStudentList]
  );

  // Handle errors from store
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data: TermStudentFormData) => {
    try {
      // Ensure term_id is populated (it should be auto-populated from term_teacher selection)
      if (!data.term_id) {
        return;
      }

      const submitData = {
        user_id: data.user_id,
        term_id: data.term_id,
        term_teacher_id: data.term_teacher_id,
      };

      const response = await createTermStudent(submitData);
      console.log('Success response:', response);

      // Check if there's a message in the response (even on success)
      if (response && 'message' in response) {
        toast.info((response as any).message);
      }

      router.push('/admin/term-students');
    } catch (error: any) {
      console.log('Full error object:', error);
      console.log('Error response:', error?.response);
      console.log('Error response data:', error?.response?.data);

      // Show error message from backend
      if (error?.response?.data?.message) {
        toast.info(error.response.data.message);
      } else if (error?.message) {
        toast.info(error.message);
      } else {
        toast.info('خطایی رخ داده است');
      }
    }
  };

  // Handle term teacher selection to auto-select term
  const handleTermTeacherChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    onChange: (value: string) => void
  ) => {
    const termTeacherId = event.target.value;
    onChange(termTeacherId);

    // Find the selected term teacher and auto-select its term
    const selectedTermTeacher = termTeacherList.find(
      (tt) => tt.id.toString() === termTeacherId
    );

    if (selectedTermTeacher && selectedTermTeacher.term) {
      // Auto-select the term using setValue
      setValue('term_id', selectedTermTeacher.term.id.toString());
      // Clear any existing validation errors
      clearErrors(['term_id', 'term_teacher_id']);
    } else if (termTeacherId) {
      // Clear term_id if no term is associated with selected term teacher
      setValue('term_id', '');
    }
  };

  // Prepare options for dropdowns
  const termOptions = termList.map((term) => ({
    label: term.title || `ترم ${term.id}`,
    value: term.id.toString(),
  }));

  const studentOptions = studentList.map((student) => ({
    label:
      `${student.user?.first_name || ''} ${student.user?.last_name || ''}`.trim() ||
      `دانش‌پژوه ${student.user_id}`,
    value: student.user?.id?.toString() || student.user_id.toString(),
  }));

  const termTeacherOptions = termTeacherList.map((termTeacher) => ({
    label: termTeacher.term
      ? `${termTeacher.user?.first_name || ''} ${termTeacher.user?.last_name || ''} - ${termTeacher.term.title}`.trim()
      : `${termTeacher.user?.first_name || ''} ${termTeacher.user?.last_name || ''}`.trim() ||
        `مدرس ترم ${termTeacher.id}`,
    value: termTeacher.id.toString(),
  }));

  // Only show full-page loading spinner during initial load, not during search
  const initialLoading =
    !initialLoadComplete &&
    (termsLoading || studentsLoading || termTeachersLoading);

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 pb-10">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'دانش‌پژوهان ترم', href: '/admin/term-students' },
          {
            label: 'اضافه کردن دانش‌پژوه به ترم',
            href: '/admin/term-students/new',
            active: true,
          },
        ]}
      />

      <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-l from-blue-700 via-blue-600 to-cyan-500 px-6 py-7 text-white shadow-xl shadow-blue-500/15 sm:px-8">
        <div className="absolute -left-12 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2 text-blue-100">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold">ثبت‌نام سریع و هوشمند</span>
            </div>
            <h1 className="text-2xl font-extrabold">افزودن دانش‌پژوه به ترم</h1>
            <p className="mt-1 text-sm text-blue-100">
              مدرس ترم و دانش‌پژوه را انتخاب کنید؛ ترم مرتبط به‌صورت خودکار تکمیل می‌شود.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800">
        <div className="border-b border-gray-100 px-6 py-5 dark:border-white/10 sm:px-8">
          <h2 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <UserRound className="h-5 w-5 text-blue-600" />
            اطلاعات تخصیص
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            فیلدهای ستاره‌دار برای ثبت الزامی هستند.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 sm:p-8">
          <Controller
            name="term_teacher_id"
            control={control}
            render={({ field }) => (
              <Select
                id="term_teacher_id"
                label="ترم مدرس *"
                placeholder="ترم مدرس را انتخاب کنید"
                options={termTeacherOptions}
                error={errors.term_teacher_id?.message}
                value={field.value}
                onChange={(event) =>
                  handleTermTeacherChange(event, field.onChange)
                }
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />

          <Controller
            name="user_id"
            control={control}
            render={({ field }) => (
              <InfiniteSelect
                id="user_id"
                label="دانش‌پژوه *"
                placeholder="دانش‌پژوه را انتخاب کنید"
                options={studentOptions}
                error={errors.user_id?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                onLoadMore={handleLoadMoreStudents}
                loading={studentsLoading}
                loadingMore={studentsLoadingMore}
                pagination={studentPagination}
                searchable
                onSearch={handleSearchStudents}
                searchPlaceholder="جستجو با نام خانوادگی..."
              />
            )}
          />

          <Controller
            name="term_id"
            control={control}
            render={({ field }) => (
              <Select
                id="term_id"
                label="ترم"
                placeholder={
                  field.value
                    ? 'ترم انتخاب شده'
                    : 'ابتدا مدرس ترم را انتخاب کنید'
                }
                options={termOptions}
                error={errors.term_id?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                disabled={true}
              />
            )}
          />
        </div>

        <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-6 py-5 sm:flex-row sm:px-8 dark:border-white/10 dark:bg-gray-900/30">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/term-students')}
          >
            <ArrowRight className="h-4 w-4" /> انصراف
          </Button>
          <Button type="submit" loading={isSubmitting || submitting}>
            <CheckCircle2 className="h-4 w-4" /> اضافه کردن دانش‌پژوه به ترم
          </Button>
        </div>
      </form>
    </main>
  );
}
