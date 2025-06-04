'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import {
  createTeacher,
  deleteTeacher,
  getTermTeacher,
} from '@/app/lib/api/admin/term-teachers';
import {
  getTermStudent,
  createTermStudent,
  updateTermStudent,
} from '@/app/lib/api/admin/term-students';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

const termStudentSchema = z.object({
  term_id: z.string().min(1, 'ترم الزامی است'),
  student_id: z.string().min(1, 'دانش پژوه الزامی است'),
});

type TermStudentFormData = z.infer<typeof termStudentSchema>;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TermStudentFormData>({
    resolver: zodResolver(termStudentSchema),
  });

  useEffect(() => {
    const fetchTermStudent = async () => {
      if (isNew) return;

      try {
        const response = await getTermTeacher(resolvedParams.id);
        const termStudent = response.data;
        reset({
          term_id: termStudent.term_id.toString(),
          student_id: termStudent.id.toString(),
        });
      } catch (error) {
        router.push('/admin/term-students');
      } finally {
        setLoading(false);
      }
    };

    fetchTermStudent();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: TermStudentFormData) => {
    try {
      if (isNew) {
        await createTermStudent(data);
        toast.success('ترم دانش پژوه با موفقیت ایجاد شد');
      } else {
        await updateTermStudent(resolvedParams.id, data);
        toast.success('ترم دانش پژوه با موفقیت بروزرسانی شد');
      }
      router.push('/admin/term-students');
    } catch (error) {
      toast.error(
        isNew ? 'خطا در ایجاد ترم دانش پژوه' : 'خطا در بروزرسانی ترم دانش پژوه'
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم دانش پژوهان', href: '/admin/term-students' },
          {
            label: isNew ? 'ایجاد ترم دانش پژوه' : 'ویرایش ترم دانش پژوه',
            href: `/admin/term-students/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="term_id"
            label="شناسه ترم"
            placeholder="شناسه ترم را وارد کنید"
            required
            error={errors.term_id?.message}
            {...register('term_id')}
          />

          <Input
            id="student_id"
            label="شناسه دانش پژوه"
            placeholder="شناسه دانش پژوه را وارد کنید"
            required
            error={errors.student_id?.message}
            {...register('student_id')}
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
            {isNew ? 'ایجاد ترم دانش پژوه' : 'بروزرسانی ترم دانش پژوه'}
          </Button>
        </div>
      </form>
    </main>
  );
}
