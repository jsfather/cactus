'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { updateOfflineSession, OfflineSession } from '@/lib/api/panel/teacher/offline_sessions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

// Placeholder arrays for terms and teachers
const terms = [
  { id: '1', label: 'ترم ۱' },
  { id: '2', label: 'ترم ۲' },
];
const teachers = [
  { id: '1', label: 'معلم ۱' },
  { id: '2', label: 'معلم ۲' },
];

type FormData = {
  term_id: string;
  term_teacher_id: string;
  title: string;
  description: string;
  video_url: string;
};

export default function EditOfflineSessionForm({ offlineSession }: { offlineSession: OfflineSession }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      term_id: offlineSession.term_id,
      term_teacher_id: offlineSession.term_teacher_id,
      title: offlineSession.title,
      description: offlineSession.description,
      video_url: offlineSession.video_url,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateOfflineSession(offlineSession.id, data);
      toast.success('کلاس آفلاین با موفقیت بروزرسانی شد');
      router.push('/teacher/offline_sessions');
    } catch (error: any) {
      toast.error(error.message || 'خطا در بروزرسانی کلاس آفلاین');
      console.error('Failed to update offline session:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Term and Teacher Row */}
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
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            {errors.term_id && (
              <p className="mt-1 text-sm text-red-500">{errors.term_id.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="term_teacher_id" className="mb-2 block text-sm font-medium">
              معلم <span className="text-red-500">*</span>
            </label>
            <select
              id="term_teacher_id"
              {...register('term_teacher_id', { required: 'انتخاب معلم الزامی است' })}
              className={`peer block w-full rounded-md border py-2 pr-4 text-sm focus:outline-0 ${
                errors.term_teacher_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">انتخاب کنید</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            {errors.term_teacher_id && (
              <p className="mt-1 text-sm text-red-500">{errors.term_teacher_id.message}</p>
            )}
          </div>
        </div>
        {/* Title Row */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            عنوان <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register('title', { required: 'عنوان الزامی است' })}
            className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        {/* Description Row */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            توضیحات <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={6}
            {...register('description', { required: 'توضیحات الزامی است' })}
            className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
        {/* Video URL Row */}
        <div className="mb-4">
          <label htmlFor="video_url" className="mb-2 block text-sm font-medium">
            لینک ویدیو <span className="text-red-500">*</span>
          </label>
          <input
            id="video_url"
            {...register('video_url', { required: 'لینک ویدیو الزامی است' })}
            className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
              errors.video_url ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.video_url && (
            <p className="mt-1 text-sm text-red-500">{errors.video_url.message}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/teacher/offline_sessions"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          لغو
        </Link>
        <Button type="submit" loading={isSubmitting}>
          ویرایش کلاس آفلاین
        </Button>
      </div>
    </form>
  );
}
