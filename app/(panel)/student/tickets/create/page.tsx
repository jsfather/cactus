'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ArrowRight, Info, LifeBuoy, Send } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { useStudentTicket } from '@/app/lib/hooks/use-student-ticket';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import type { CreateStudentTicketRequest } from '@/app/lib/types/ticket';

const ticketSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(5, 'موضوع باید حداقل ۵ کاراکتر باشد')
    .max(120, 'موضوع نباید بیشتر از ۱۲۰ کاراکتر باشد'),
  message: z
    .string()
    .trim()
    .min(20, 'برای بررسی بهتر، حداقل ۲۰ کاراکتر توضیح بنویسید')
    .max(3000, 'متن پیام نباید بیشتر از ۳۰۰۰ کاراکتر باشد'),
  department_id: z.number().min(1, 'دپارتمان را انتخاب کنید'),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export default function CreateTicketPage() {
  const router = useRouter();
  const { createTicket, fetchDepartments, departments, isDepartmentsLoading } =
    useStudentTicket();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useFormWithBackendErrors<TicketFormData>(ticketSchema);

  useEffect(() => {
    void fetchDepartments();
  }, [fetchDepartments]);

  const subjectLength = watch('subject')?.length || 0;
  const messageLength = watch('message')?.length || 0;
  const departmentOptions = departments.map((department) => ({
    value: department.id.toString(),
    label: department.title,
  }));

  const onSubmit = async (data: TicketFormData) => {
    try {
      const payload: CreateStudentTicketRequest = {
        subject: data.subject.trim(),
        message: data.message.trim(),
        department_id: data.department_id,
      };
      await createTicket(payload);
      toast.success('تیکت با موفقیت ثبت شد');
      router.push('/student/tickets');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'ثبت تیکت انجام نشد'
      );
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل دانش‌پژوه', href: '/student' },
          { label: 'تیکت‌های من', href: '/student/tickets' },
          { label: 'ثبت تیکت جدید', href: '/student/tickets/create' },
        ]}
      />

      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 rounded-xl p-3">
                <LifeBuoy className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ثبت درخواست پشتیبانی
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  اطلاعات کامل‌تر، زمان رسیدگی را کوتاه‌تر می‌کند.
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/student/tickets"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به تیکت‌ها
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="space-y-6">
              <Controller
                name="department_id"
                control={control}
                render={({ field }) => (
                  <Select
                    id="department_id"
                    label="دپارتمان مربوطه"
                    value={field.value?.toString() || ''}
                    onChange={(event) =>
                      field.onChange(Number.parseInt(event.target.value, 10))
                    }
                    onBlur={field.onBlur}
                    options={departmentOptions}
                    error={errors.department_id?.message}
                    disabled={isDepartmentsLoading}
                    required
                    placeholder={
                      isDepartmentsLoading
                        ? 'در حال دریافت دپارتمان‌ها...'
                        : 'دپارتمان مناسب را انتخاب کنید'
                    }
                  />
                )}
              />

              <div>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="subject"
                      label="موضوع درخواست"
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.subject?.message}
                      required
                      placeholder="مثلاً مشکل ورود به کلاس آنلاین"
                    />
                  )}
                />
                <p className="mt-1 text-left text-xs text-gray-400" dir="ltr">
                  {subjectLength}/120
                </p>
              </div>

              <div>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="message"
                      label="شرح کامل مشکل یا درخواست"
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.message?.message}
                      required
                      placeholder="چه کاری انجام دادید، چه اتفاقی افتاد و چه نتیجه‌ای انتظار داشتید؟"
                      rows={9}
                    />
                  )}
                />
                <p className="mt-1 text-left text-xs text-gray-400" dir="ltr">
                  {messageLength}/3000
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isDepartmentsLoading}
                loading={isSubmitting}
                className="w-full gap-2 sm:w-auto"
              >
                <Send className="h-4 w-4" />
                ثبت درخواست
              </Button>
            </div>
          </form>

          <aside className="h-fit rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100">
            <div className="flex items-center gap-2 font-semibold">
              <Info className="h-5 w-5" />
              برای پاسخ سریع‌تر
            </div>
            <ul className="mt-4 list-inside list-disc space-y-3 leading-6">
              <li>فقط یک موضوع را در هر تیکت مطرح کنید.</li>
              <li>نام دوره، ترم یا سفارش مرتبط را بنویسید.</li>
              <li>پیام خطا و زمان رخداد مشکل را دقیق ذکر کنید.</li>
              <li>وضعیت پاسخ را از صندوق تیکت‌ها پیگیری کنید.</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
