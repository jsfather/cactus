'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

// UI Components
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';

// Hooks and Types
import { useStudentTicket } from '@/app/lib/hooks/use-student-ticket';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { CreateStudentTicketRequest } from '@/app/lib/types/ticket';

// Form Validation Schema
const ticketSchema = z.object({
  subject: z.string().min(1, 'موضوع ضروری است'),
  message: z.string().min(1, 'پیام ضروری است'),
  department_id: z.number().min(1, 'دپارتمان ضروری است'),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const CreateTicketPage: React.FC = () => {
  const router = useRouter();
  const { createTicket, fetchDepartments, departments, isDepartmentsLoading } =
    useStudentTicket();

  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormWithBackendErrors<TicketFormData>(ticketSchema);

  useEffect(() => {
    fetchDepartments();
    setLoading(false);
  }, [fetchDepartments]);

  const onSubmit = async (data: TicketFormData) => {
    try {
      const payload: CreateStudentTicketRequest = {
        subject: data.subject,
        message: data.message,
        department_id: data.department_id,
      };

      await createTicket(payload);
      toast.success('تیکت با موفقیت ایجاد شد');
      router.push('/student/tickets');
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      toast.error(error.message || 'خطا در ایجاد تیکت');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const breadcrumbItems = [
    { label: 'پنل دانشجو', href: '/student' },
    { label: 'تیکت‌ها', href: '/student/tickets' },
    { label: 'ایجاد تیکت جدید', href: '/student/tickets/create' },
  ];

  const departmentOptions = departments.map((dept) => ({
    value: dept.id.toString(),
    label: dept.title,
  }));

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ایجاد تیکت جدید
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          برای پشتیبانی و راهنمایی تیکت جدید ایجاد کنید
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            اطلاعات تیکت
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Subject */}
            <div className="md:col-span-2">
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Input
                    id="subject"
                    label="موضوع"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.subject?.message}
                    required
                    placeholder="موضوع تیکت خود را وارد کنید"
                  />
                )}
              />
            </div>

            {/* Department */}
            <div className="md:col-span-2">
              <Controller
                name="department_id"
                control={control}
                render={({ field }) => (
                  <Select
                    id="department_id"
                    label="دپارتمان"
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    onBlur={field.onBlur}
                    options={departmentOptions}
                    error={errors.department_id?.message}
                    required
                    placeholder="دپارتمان مربوطه را انتخاب کنید"
                  />
                )}
              />
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="message"
                    label="پیام"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.message?.message}
                    required
                    placeholder="پیام خود را به تفصیل بنویسید..."
                    rows={8}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 space-x-reverse">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            لغو
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'در حال ایجاد...' : 'ایجاد تیکت'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketPage;
