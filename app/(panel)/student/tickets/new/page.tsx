'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useStudentTicket } from '@/app/lib/hooks/use-student-ticket';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import Select from '@/app/components/ui/Select';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { ArrowRight, Save } from 'lucide-react';

const createTicketSchema = z.object({
  subject: z.string().min(1, 'موضوع الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  department: z.string().min(1, 'انتخاب بخش الزامی است'),
  teacher: z.string().optional(),
});

type CreateTicketFormData = z.infer<typeof createTicketSchema>;

const departments = [
  { value: 'technical', label: 'فنی' },
  { value: 'educational', label: 'آموزشی' },
  { value: 'financial', label: 'مالی' },
  { value: 'support', label: 'پشتیبانی' },
  { value: 'other', label: 'سایر' },
];

export default function NewTicketPage() {
  const router = useRouter();
  const { createTicket, isCreateLoading } = useStudentTicket();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: '',
      description: '',
      department: '',
      teacher: '',
    },
  });

  const breadcrumbItems = [
    { label: 'پنل دانش‌آموز', href: '/student' },
    { label: 'تیکت‌ها', href: '/student/tickets' },
    { label: 'تیکت جدید', href: '/student/tickets/new', active: true },
  ];

  const onSubmit = async (data: CreateTicketFormData) => {
    try {
      setIsSubmitting(true);
      await createTicket(data);
      toast.success('تیکت با موفقیت ایجاد شد');
      router.push('/student/tickets');
    } catch (error) {
      toast.error('خطا در ایجاد تیکت');
      console.error('Create ticket error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/student/tickets');
  };

  if (isCreateLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      <div className="bg-white shadow sm:rounded-lg dark:bg-gray-800">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              تیکت جدید
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              تیکت پشتیبانی جدید ایجاد کنید
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="subject"
                      label="موضوع"
                      placeholder="موضوع تیکت را وارد کنید"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.subject?.message}
                      required
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="department"
                      label="بخش"
                      placeholder="انتخاب کنید"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.department?.message}
                      options={departments}
                      required
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="teacher"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="teacher"
                      label="نام مدرس (اختیاری)"
                      placeholder="نام مدرس مربوطه"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.teacher?.message}
                    />
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      label="توضیحات"
                      placeholder="توضیحات کامل درخواست خود را بنویسید..."
                      rows={6}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.description?.message}
                      required
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 space-x-reverse">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                بازگشت
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                ایجاد تیکت
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
