'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getFAQ, createFAQ, updateFAQ } from '@/app/lib/api/admin/faqs';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

const faqSchema = z.object({
  question: z.string().min(1, 'سوال الزامی است'),
  answer: z.string().min(1, 'پاسخ الزامی است'),
});

type FAQFormData = z.infer<typeof faqSchema>;

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
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
  });

  useEffect(() => {
    const fetchFAQ = async () => {
      if (isNew) return;

      try {
        const response = await getFAQ(resolvedParams.id);
        const faq = response.data;
        reset({
          question: faq.question,
          answer: faq.answer,
        });
      } catch (error) {
        router.push('/admin/faqs');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: FAQFormData) => {
    try {
      if (isNew) {
        await createFAQ(data);
        toast.success('سوال متداول با موفقیت ایجاد شد');
      } else {
        await updateFAQ(resolvedParams.id, data);
        toast.success('سوال متداول با موفقیت بروزرسانی شد');
      }
      router.push('/admin/faqs');
    } catch (error) {
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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
