'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import MarkdownEditor from '@/app/components/ui/MarkdownEditor';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFAQ } from '@/app/lib/hooks/use-faq';
import { CreateFAQRequest, UpdateFAQRequest } from '@/app/lib/types';
import { ArrowRight, Save } from 'lucide-react';

const schema = z.object({
  question: z.string().min(1, 'سوال الزامی است'),
  answer: z.string().min(1, 'پاسخ الزامی است'),
});

type FormData = z.infer<typeof schema>;

export default function FAQFormPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  const {
    currentFAQ,
    loading,
    error,
    fetchFAQById,
    createFAQ,
    updateFAQ,
    clearError,
  } = useFAQ();

  useEffect(() => {
    if (!isNew && resolvedParams.id) {
      fetchFAQById(resolvedParams.id);
    }
  }, [isNew, resolvedParams.id, fetchFAQById]);

  useEffect(() => {
    if (currentFAQ && !isNew) {
      reset({
        question: currentFAQ.question,
        answer: currentFAQ.answer,
      });
    }
  }, [currentFAQ, isNew, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      clearError();
      
      const payload = {
        question: data.question,
        answer: data.answer,
      };

      if (isNew) {
        await createFAQ(payload as CreateFAQRequest);
        toast.success('سوال متداول با موفقیت ایجاد شد');
      } else {
        await updateFAQ(resolvedParams.id, payload as UpdateFAQRequest);
        toast.success('سوال متداول با موفقیت به‌روزرسانی شد');
      }
      
      router.push('/admin/faqs');
    } catch (error: any) {
      console.error('Error saving FAQ:', error);
      toast.error(error?.message || 'خطا در ذخیره سوال متداول');
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
          { label: 'مدیریت سوالات متداول', href: '/admin/faqs' },
          {
            label: isNew ? 'افزودن سوال جدید' : 'ویرایش سوال متداول',
            href: `/admin/faqs/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push('/admin/faqs')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {isNew ? 'افزودن سوال جدید' : 'ویرایش سوال متداول'}
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {isNew ? 'سوال متداول جدید ایجاد کنید' : 'اطلاعات سوال متداول را ویرایش کنید'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
          </div>
        )}

        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Input
                  label="سوال"
                  {...register('question')}
                  error={errors.question?.message}
                  placeholder="سوال را وارد کنید"
                  required
                />
              </div>

              <div>
                <Controller
                  name="answer"
                  control={control}
                  render={({ field }) => (
                    <MarkdownEditor
                      id="answer"
                      label="پاسخ"
                      placeholder="پاسخ کامل سوال را در اینجا وارد کنید..."
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.answer?.message}
                      required
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin/faqs')}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting
                  ? isNew 
                    ? 'در حال ایجاد...'
                    : 'در حال به‌روزرسانی...'
                  : isNew
                    ? 'ایجاد سوال متداول'
                    : 'به‌روزرسانی سوال متداول'
                }
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
