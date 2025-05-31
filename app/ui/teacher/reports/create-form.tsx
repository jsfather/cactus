'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';
import { createReport } from '@/app/lib/api/teacher/reports';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

// Placeholder arrays for terms and schedules
const terms = [
  { id: '1', label: 'ترم ۱' },
  { id: '2', label: 'ترم ۲' },
];
const schedules = [
  { id: '1', label: 'جلسه ۱' },
  { id: '2', label: 'جلسه ۲' },
];

type FormData = {
  term_id: string;
  term_teacher_schedule_id: string;
  content: string;
};

export default function Form() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await createReport(data);
      toast.success('گزارش با موفقیت ثبت شد');
      router.push('/teacher/reports');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ثبت گزارش');
      console.error('Failed to create report:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Term and Schedule Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="term_id" className="mb-2 block text-sm font-medium">
              ترم <span className="text-red-500">*</span>
            </label>
            <select
              id="term_id"
              {...register('term_id', { required: 'انتخاب ترم الزامی است' })}
              className={`peer block w-full rounded-md border py-2 pr-4 text-sm focus:outline-0 ${
                errors.term_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">انتخاب کنید</option>
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.term_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.term_id.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="term_teacher_schedule_id"
              className="mb-2 block text-sm font-medium"
            >
              جلسه <span className="text-red-500">*</span>
            </label>
            <select
              id="term_teacher_schedule_id"
              {...register('term_teacher_schedule_id', {
                required: 'انتخاب جلسه الزامی است',
              })}
              className={`peer block w-full rounded-md border py-2 pr-4 text-sm focus:outline-0 ${
                errors.term_teacher_schedule_id
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            >
              <option value="">انتخاب کنید</option>
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.term_teacher_schedule_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.term_teacher_schedule_id.message}
              </p>
            )}
          </div>
        </div>
        {/* Content Row */}
        <div className="mb-4">
          <label htmlFor="content" className="mb-2 block text-sm font-medium">
            متن گزارش <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            rows={6}
            {...register('content', { required: 'متن گزارش الزامی است' })}
            className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">
              {errors.content.message}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/teacher/reports"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          لغو
        </Link>
        <Button type="submit" loading={isSubmitting}>
          ثبت گزارش
        </Button>
      </div>
    </form>
  );
}
