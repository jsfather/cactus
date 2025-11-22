'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import Select from '@/app/components/ui/Select';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminOfflineSession } from '@/app/lib/hooks/use-admin-offline-session';
import { useTerm } from '@/app/lib/hooks/use-term';
import {
  OfflineSessionCreateRequest,
  OfflineSessionUpdateRequest,
} from '@/lib/types/offline-session';
import { ArrowRight, Save } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'عنوان جلسه الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  video_url: z
    .string()
    .url('لینک ویدیو معتبر نیست')
    .min(1, 'لینک ویدیو الزامی است'),
  term_id: z.string().min(1, 'انتخاب ترم الزامی است'),
  term_teacher_id: z.string().min(1, 'انتخاب مدرس الزامی است'),
});

type FormData = z.infer<typeof schema>;

export default function OfflineSessionFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      video_url: '',
      term_id: '',
      term_teacher_id: '',
    },
  });

  const {
    currentOfflineSession,
    loading,
    error,
    fetchOfflineSessionById,
    createOfflineSession,
    updateOfflineSession,
    clearError,
    currentTermId,
  } = useAdminOfflineSession();

  const { termList, fetchTermList } = useTerm();
  const selectedTermId = watch('term_id');

  useEffect(() => {
    fetchTermList();
  }, [fetchTermList]);

  useEffect(() => {
    if (!isNew && resolvedParams.id) {
      fetchOfflineSessionById(resolvedParams.id);
    }
  }, [isNew, resolvedParams.id, fetchOfflineSessionById]);

  useEffect(() => {
    if (currentOfflineSession && !isNew) {
      reset({
        title: currentOfflineSession.title,
        description: currentOfflineSession.description,
        video_url: currentOfflineSession.video_url,
        term_id: currentOfflineSession.term_id.toString(),
        term_teacher_id: currentOfflineSession.term_teacher_id.toString(),
      });
    } else if (isNew && currentTermId) {
      reset((prev) => ({
        ...prev,
        term_id: currentTermId.toString(),
      }));
    }
  }, [currentOfflineSession, isNew, reset, currentTermId]);

  const onSubmit = async (data: FormData) => {
    try {
      clearError();

      const payload: OfflineSessionCreateRequest | OfflineSessionUpdateRequest =
        {
          title: data.title,
          description: data.description,
          video_url: data.video_url,
          term_id: data.term_id,
          term_teacher_id: data.term_teacher_id,
        };

      if (isNew) {
        await createOfflineSession(payload as OfflineSessionCreateRequest);
        toast.success('جلسه آفلاین با موفقیت ایجاد شد');
      } else {
        await updateOfflineSession(
          resolvedParams.id,
          payload as OfflineSessionUpdateRequest
        );
        toast.success('جلسه آفلاین با موفقیت به‌روزرسانی شد');
      }

      router.push('/admin/offline-sessions');
    } catch (error: any) {
      console.error('Error saving offline session:', error);
      toast.error(error?.message || 'خطا در ذخیره جلسه آفلاین');
    }
  };

  if (loading && !isNew) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'جلسات آفلاین', href: '/admin/offline-sessions' },
          {
            label: isNew ? 'افزودن جلسه جدید' : 'ویرایش جلسه',
            href: `/admin/offline-sessions/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push('/admin/offline-sessions')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {isNew ? 'افزودن جلسه آفلاین جدید' : 'ویرایش جلسه آفلاین'}
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {isNew
                  ? 'جلسه آفلاین جدید ایجاد کنید'
                  : 'اطلاعات جلسه را ویرایش کنید'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          </div>
        )}

        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <Input
                  label="عنوان جلسه"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="عنوان جلسه را وارد کنید"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <Textarea
                  label="توضیحات"
                  {...register('description')}
                  error={errors.description?.message}
                  placeholder="توضیحات جلسه را وارد کنید"
                  rows={4}
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <Input
                  label="لینک ویدیو"
                  {...register('video_url')}
                  error={errors.video_url?.message}
                  placeholder="https://example.com/video"
                  type="url"
                  required
                />
              </div>

              <div>
                <Controller
                  name="term_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="ترم"
                      {...field}
                      options={[
                        { label: 'ترم را انتخاب کنید', value: '' },
                        ...termList.map((term) => ({
                          label: term.title,
                          value: term.id.toString(),
                        })),
                      ]}
                      error={errors.term_id?.message}
                      required
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="term_teacher_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="مدرس ترم"
                      {...field}
                      options={[
                        { label: 'مدرس را انتخاب کنید', value: '' },
                        // Note: You'll need to fetch term teachers based on selected term
                        // For now, this is a placeholder. You may need to add term teacher fetching logic
                      ]}
                      error={errors.term_teacher_id?.message}
                      required
                      disabled={!selectedTermId}
                    />
                  )}
                />
                {!selectedTermId && (
                  <p className="mt-1 text-xs text-gray-500">
                    ابتدا ترم را انتخاب کنید
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin/offline-sessions')}
              >
                انصراف
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="ml-2 h-4 w-4" />
                {isSubmitting
                  ? 'در حال ذخیره...'
                  : isNew
                    ? 'ایجاد جلسه'
                    : 'به‌روزرسانی جلسه'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
