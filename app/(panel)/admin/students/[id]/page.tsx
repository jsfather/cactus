'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getStudent, createStudent, updateStudent } from '@/app/lib/api/admin/students';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';

const studentSchema = z.object({
  level_id: z.string().nullable(),
  father_name: z.string().nullable(),
  mother_name: z.string().nullable(),
  father_job: z.string().nullable(),
  mother_job: z.string().nullable(),
  has_allergy: z.number(),
  allergy_details: z.string().nullable(),
  interest_level: z.number().nullable(),
  focus_level: z.number().nullable(),
  birth_date: z.string().nullable(),
});

type StudentFormData = z.infer<typeof studentSchema>;

const allergyOptions = [
  { value: '0', label: 'خیر' },
  { value: '1', label: 'بله' },
];

const levelOptions = [
  { value: '1', label: 'مبتدی' },
  { value: '2', label: 'متوسط' },
  { value: '3', label: 'پیشرفته' },
];

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
    watch,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      has_allergy: 0,
    },
  });

  const hasAllergy = watch('has_allergy');

  useEffect(() => {
    const fetchStudent = async () => {
      if (isNew) return;

      try {
        const response = await getStudent(resolvedParams.id);
        const student = response.data;
        reset({
          level_id: student.level_id?.toString() || null,
          father_name: student.father_name,
          mother_name: student.mother_name,
          father_job: student.father_job,
          mother_job: student.mother_job,
          has_allergy: student.has_allergy,
          allergy_details: student.allergy_details,
          interest_level: student.interest_level,
          focus_level: student.focus_level,
          birth_date: student.birth_date,
        });
      } catch (error) {
        router.push('/admin/students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: StudentFormData) => {
    try {
      if (isNew) {
        await createStudent(data);
        toast.success('دانش پژوه با موفقیت ایجاد شد');
      } else {
        await updateStudent(resolvedParams.id, data);
        toast.success('دانش پژوه با موفقیت بروزرسانی شد');
      }
      router.push('/admin/students');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد دانش پژوه' : 'خطا در بروزرسانی دانش پژوه');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'دانش پژوهان', href: '/admin/students' },
          {
            label: isNew ? 'ایجاد دانش پژوه' : 'ویرایش دانش پژوه',
            href: `/admin/students/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="father_name"
            label="نام پدر"
            placeholder="نام پدر را وارد کنید"
            error={errors.father_name?.message}
            {...register('father_name')}
          />

          <Input
            id="mother_name"
            label="نام مادر"
            placeholder="نام مادر را وارد کنید"
            error={errors.mother_name?.message}
            {...register('mother_name')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="father_job"
            label="شغل پدر"
            placeholder="شغل پدر را وارد کنید"
            error={errors.father_job?.message}
            {...register('father_job')}
          />

          <Input
            id="mother_job"
            label="شغل مادر"
            placeholder="شغل مادر را وارد کنید"
            error={errors.mother_job?.message}
            {...register('mother_job')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Select
            id="level_id"
            label="سطح"
            placeholder="سطح را انتخاب کنید"
            options={levelOptions}
            error={errors.level_id?.message}
            {...register('level_id')}
          />

          <Input
            id="birth_date"
            label="تاریخ تولد"
            type="date"
            placeholder="تاریخ تولد را وارد کنید"
            error={errors.birth_date?.message}
            {...register('birth_date')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="interest_level"
            label="سطح علاقه"
            type="number"
            min="1"
            max="5"
            placeholder="سطح علاقه را وارد کنید (1-5)"
            error={errors.interest_level?.message}
            {...register('interest_level', {
              setValueAs: (value: string) => (value ? parseInt(value) : null),
            })}
          />

          <Input
            id="focus_level"
            label="سطح تمرکز"
            type="number"
            min="1"
            max="5"
            placeholder="سطح تمرکز را وارد کنید (1-5)"
            error={errors.focus_level?.message}
            {...register('focus_level', {
              setValueAs: (value: string) => (value ? parseInt(value) : null),
            })}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Select
            id="has_allergy"
            label="آلرژی"
            placeholder="وضعیت آلرژی را انتخاب کنید"
            options={allergyOptions}
            error={errors.has_allergy?.message}
            {...register('has_allergy', {
              setValueAs: (value: string) => parseInt(value),
            })}
          />

          {hasAllergy === 1 && (
            <Input
              id="allergy_details"
              label="جزئیات آلرژی"
              placeholder="جزئیات آلرژی را وارد کنید"
              error={errors.allergy_details?.message}
              {...register('allergy_details')}
            />
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/students')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد دانش پژوه' : 'بروزرسانی دانش پژوه'}
          </Button>
        </div>
      </form>
    </main>
  );
}
