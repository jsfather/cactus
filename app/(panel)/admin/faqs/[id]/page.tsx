'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getFAQ, createFAQ, updateFAQ } from '@/app/lib/api/admin/faqs';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

import { z } from 'zod';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { ApiError } from '@/app/lib/api/client';

const faqSchema = z.object({
  question: z.string().min(1, 'سوال الزامی است'),
  answer: z.string().min(1, 'پاسخ الزامی است'),
});

type FAQFormData = z.infer<typeof faqSchema>;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    setGlobalError,
    reset,
  } = useFormWithBackendErrors<FAQFormData>(faqSchema);

  useEffect(() => {
    const fetchFAQ = async () => {
      if (isNew) {
        // Set default values for new FAQs
        reset({
          question: '',
          answer: '',
        });
        setLoading(false);
        return;
      }

      try {
        const response = await getFAQ(resolvedParams.id);
        const faq = response.data;
        reset({
          question: faq.question,
          answer: faq.answer,
        });
      } catch (error) {
        toast.error('خطا در بارگذاری سوال متداول');
        router.push('/admin/faqs');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: FAQFormData) => {
    if (isNew) {
      await createFAQ(data);
      toast.success('سوال متداول با موفقیت ایجاد شد');
    } else {
      await updateFAQ(resolvedParams.id, data);
      toast.success('سوال متداول با موفقیت بروزرسانی شد');
    }
    router.push('/admin/faqs');
  };

  const handleError = (error: ApiError) => {
    console.log('FAQ form submission error:', error);
    
    // Show toast error message
    if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error(isNew ? 'خطا در ایجاد سوال متداول' : 'خطا در بروزرسانی سوال متداول');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'سوالات متداول', href: '/admin/faqs' },
          {
            label: isNew ? 'ایجاد سوال متداول' : 'ویرایش سوال متداول',
            href: `/admin/faqs/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form 
        onSubmit={handleSubmit(submitWithErrorHandling(onSubmit, handleError))} 
        className="mt-8 space-y-6"
      >
        {globalError && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
            {globalError}
          </div>
        )}
        <div className="w-full">
          <Input
            id="question"
            label="سوال"
            placeholder="سوال را وارد کنید"
            required
            error={errors.question?.message}
            {...register('question')}
          />
        </div>

        <div className="w-full">
          <Textarea
            id="answer"
            label="پاسخ"
            placeholder="پاسخ را وارد کنید"
            required
            error={errors.answer?.message}
            {...register('answer')}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/faqs')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد سوال متداول' : 'بروزرسانی سوال متداول'}
          </Button>
        </div>
      </form>
    </main>
  );
}
