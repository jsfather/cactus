'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { createTermStudent } from '@/app/lib/api/admin/term-students';
import { getTerms } from '@/app/lib/api/admin/terms';
import { getStudents } from '@/app/lib/api/admin/students';
import { getTermTeachers } from '@/app/lib/api/admin/term-teachers';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Select from '@/app/components/ui/Select';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

const termStudentSchema = z.object({
  user_id: z.string().min(1, 'دانش آموز الزامی است'),
  term_id: z.string().min(1, 'ترم الزامی است'),
  term_teacher_id: z.string().min(1, 'مدرس ترم الزامی است'),
});

type TermStudentFormData = z.infer<typeof termStudentSchema>;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [terms, setTerms] = useState<Array<{ label: string; value: string }>>(
    []
  );
  const [students, setStudents] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [termTeachers, setTermTeachers] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TermStudentFormData>({
    resolver: zodResolver(termStudentSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load all dropdown data
        const [termsResponse, studentsResponse, termTeachersResponse] =
          await Promise.all([getTerms(), getStudents(), getTermTeachers()]);

        setTerms(
          termsResponse.data.map((term: any) => ({
            label: term.name || term.title || `ترم ${term.id}`,
            value: term.id.toString(),
          }))
        );

        setStudents(
          studentsResponse.data.map((student: any) => ({
            label:
              student.user?.name || student.name || `دانش آموز ${student.id}`,
            value: student.user?.id?.toString() || student.id.toString(),
          }))
        );

        setTermTeachers(
          termTeachersResponse.data
            .filter((termTeacher: any) => termTeacher.id)
            .map((termTeacher: any) => ({
              label:
                `${termTeacher.teacher?.user?.first_name || ''} ${termTeacher.teacher?.user?.last_name || ''}`.trim() ||
                termTeacher.teacher?.user?.name ||
                `مدرس ترم ${termTeacher.id}`,
              value: termTeacher.id.toString(),
            }))
        );
      } catch (error) {
        console.error('Error fetching data:', error);
        if (!isNew) {
          router.push('/admin/term-students');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: TermStudentFormData) => {
    try {
      await createTermStudent(data);
      toast.success('دانش آموز با موفقیت به ترم اضافه شد');

      router.push('/admin/term-students');
    } catch (error) {
      toast.error('خطا در اضافه کردن دانش آموز به ترم');
    }
  };

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
          <Select
            id="term_id"
            label="ترم"
            placeholder="ترم را انتخاب کنید"
            required
            options={terms}
            error={errors.term_id?.message}
            {...register('term_id')}
          />

          <Select
            id="user_id"
            label="دانش آموز"
            placeholder="دانش آموز را انتخاب کنید"
            required
            options={students}
            error={errors.user_id?.message}
            {...register('user_id')}
          />

          <Select
            id="term_teacher_id"
            label="مدرس ترم"
            placeholder="مدرس ترم را انتخاب کنید"
            required
            options={termTeachers}
            error={errors.term_teacher_id?.message}
            {...register('term_teacher_id')}
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
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'اضافه کردن دانش آموز به ترم' : 'بروزرسانی ترم دانش آموز'}
          </Button>
        </div>
      </form>
    </main>
  );
}
