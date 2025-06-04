'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getHomework, submitHomework } from '@/app/lib/api/student/homeworks';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Textarea from '@/app/components/ui/Textarea';

const homeworkSchema = z.object({
  answer: z.string().min(1, 'پاسخ الزامی است'),
  attachment_url: z.string().optional(),
});

type HomeworkFormData = z.infer<typeof homeworkSchema>;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [homework, setHomework] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HomeworkFormData>({
    resolver: zodResolver(homeworkSchema),
  });

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const response = await getHomework(resolvedParams.id);
        setHomework(response.data);
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات تکلیف');
        router.push('/student/homeworks');
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, [resolvedParams.id, router]);

  const onSubmit = async (data: HomeworkFormData) => {
    try {
      await submitHomework(resolvedParams.id, data);
      toast.success('تکلیف با موفقیت ارسال شد');
      router.push('/student/homeworks');
    } catch (error) {
      toast.error('خطا در ارسال تکلیف');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'تکالیف', href: '/student/homeworks' },
          {
            label: 'مشاهده تکلیف',
            href: `/student/homeworks/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">عنوان</h3>
            <p className="mt-1 text-sm text-gray-900">{homework.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">وضعیت</h3>
            <p className="mt-1 text-sm text-gray-900">{homework.status}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">توضیحات</h3>
          <p className="mt-1 text-sm text-gray-900">{homework.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">مهلت تحویل</h3>
            <p className="mt-1 text-sm text-gray-900">{homework.due_date}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">نمره</h3>
            <p className="mt-1 text-sm text-gray-900">
              {homework.mark || 'هنوز نمره‌ای ثبت نشده است'}
            </p>
          </div>
        </div>

        {homework.status !== 'submitted' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="w-full">
              <Textarea
                id="answer"
                label="پاسخ"
                placeholder="پاسخ خود را وارد کنید"
                required
                error={errors.answer?.message}
                {...register('answer')}
              />
            </div>

            <div className="w-full">
              <Input
                id="attachment_url"
                type="file"
                label="فایل پیوست"
                error={errors.attachment_url?.message}
                {...register('attachment_url')}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="white"
                onClick={() => router.push('/student/homeworks')}
              >
                انصراف
              </Button>
              <Button type="submit" loading={isSubmitting}>
                ارسال تکلیف
              </Button>
            </div>
          </form>
        )}

        {homework.status === 'submitted' && (
          <>
            <div>
              <h3 className="text-sm font-medium text-gray-500">پاسخ ارسالی</h3>
              <p className="mt-1 text-sm text-gray-900">{homework.answer}</p>
            </div>

            {homework.attachment_url && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  فایل پیوست
                </h3>
                <a
                  href={homework.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  دانلود فایل
                </a>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                variant="white"
                onClick={() => router.push('/student/homeworks')}
              >
                بازگشت
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
