'use client';

import { useEffect, use } from 'react';
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
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

const termStudentSchema = z.object({
  user_id: z.string().min(1, 'دانش آموز الزامی است'),
  term_id: z.string().optional(),
  term_teacher_id: z.string().min(1, 'مدرس ترم الزامی است'),
});

type TermStudentFormData = z.infer<typeof termStudentSchema>;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';

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
    fetchStudentList,
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

  // Load dropdown data on mount
  useEffect(() => {
    fetchTermList();
    fetchStudentList();
    fetchTermTeacherList();
  }, [fetchTermList, fetchStudentList, fetchTermTeacherList]);

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
      if (response?.message) {
        toast.info(response.message);
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
  const handleTermTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>, onChange: (value: string) => void) => {
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
      `دانش آموز ${student.user_id}`,
    value: student.user?.id?.toString() || student.user_id.toString(),
  }));

  const termTeacherOptions = termTeacherList.map((termTeacher) => ({
    label: termTeacher.term
      ? `${termTeacher.user?.first_name || ''} ${termTeacher.user?.last_name || ''} - ${termTeacher.term.title}`.trim()
      : `${termTeacher.user?.first_name || ''} ${termTeacher.user?.last_name || ''}`.trim() ||
        `مدرس ترم ${termTeacher.id}`,
    value: termTeacher.id.toString(),
  }));

  const loading = termsLoading || studentsLoading || termTeachersLoading;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم دانش آموزان', href: '/admin/term-students' },
          {
            label: isNew
              ? 'اضافه کردن دانش آموز به ترم'
              : 'ویرایش ترم دانش آموز',
            href: `/admin/term-students/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                onChange={(event) => handleTermTeacherChange(event, field.onChange)}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />

          <Controller
            name="user_id"
            control={control}
            render={({ field }) => (
              <Select
                id="user_id"
                label="دانش آموز *"
                placeholder="دانش آموز را انتخاب کنید"
                options={studentOptions}
                error={errors.user_id?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
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
                placeholder={field.value ? "ترم انتخاب شده" : "ابتدا مدرس ترم را انتخاب کنید"}
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

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/term-students')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting || submitting}>
            {isNew ? 'اضافه کردن دانش آموز به ترم' : 'بروزرسانی ترم دانش آموز'}
          </Button>
        </div>
      </form>
    </main>
  );
}
