'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import MarkdownEditor from '@/app/components/ui/MarkdownEditor';
import Select from '@/app/components/ui/Select';
import { useStudentTicket } from '@/app/lib/hooks/use-student-ticket';

const ticketSchema = z.object({
  subject: z.string().min(1, 'موضوع الزامی است'),
  message: z.string().min(1, 'پیام الزامی است'),
  department_id: z.string().min(1, 'بخش الزامی است'),
  teacher_id: z.string().optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export default function TicketPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(params.id === 'create');

  const {
    currentTicket,
    departments,
    isLoading,
    isDepartmentsLoading,
    fetchTicketById,
    fetchDepartments,
    createTicket,
  } = useStudentTicket();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: '',
      message: '',
      department_id: '',
      teacher_id: '',
    },
  });

  useEffect(() => {
    if (isCreating) {
      fetchDepartments();
    } else {
      fetchTicketById(params.id);
    }
  }, [params.id, isCreating, fetchTicketById, fetchDepartments]);

  const onSubmit = async (data: TicketFormData) => {
    try {
      await createTicket(data);
      toast.success('تیکت با موفقیت ایجاد شد');
      router.push('/student/tickets');
    } catch (error) {
      toast.error('خطا در ایجاد تیکت');
    }
  };

  const breadcrumbItems = [
    { label: 'داشبورد', href: '/student' },
    { label: 'تیکت‌ها', href: '/student/tickets' },
    {
      label: isCreating
        ? 'ایجاد تیکت جدید'
        : currentTicket?.subject || 'مشاهده تیکت',
      href: '',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />

        {isCreating ? (
          <div className="mt-6">
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h1 className="text-foreground mb-6 text-2xl font-bold">
                ایجاد تیکت جدید
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="subject"
                        label="موضوع"
                        placeholder="موضوع تیکت را وارد کنید"
                        {...field}
                        error={errors.subject?.message}
                        required
                      />
                    )}
                  />

                  <Controller
                    name="department_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        id="department_id"
                        label="بخش"
                        placeholder="بخش مورد نظر را انتخاب کنید"
                        options={departments.map((dept) => ({
                          value: String(dept.id),
                          label: dept.title,
                        }))}
                        required
                        error={errors.department_id?.message}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    )}
                  />
                </div>

                <Controller
                  name="teacher_id"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="teacher_id"
                      label="شناسه مدرس (اختیاری)"
                      placeholder="شناسه مدرس مورد نظر را وارد کنید"
                      {...field}
                      error={errors.teacher_id?.message}
                    />
                  )}
                />

                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <MarkdownEditor
                      id="message"
                      label="پیام"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.message?.message}
                      required
                    />
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isDepartmentsLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isSubmitting ? 'در حال ایجاد...' : 'ایجاد تیکت'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push('/student/tickets')}
                  >
                    انصراف
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : currentTicket ? (
          <div className="mt-6 space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-foreground text-2xl font-bold">
                    {currentTicket.subject}
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    شناسه تیکت: #{currentTicket.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      currentTicket.status === 'open'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : currentTicket.status === 'closed'
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}
                  >
                    {currentTicket.status === 'open'
                      ? 'باز'
                      : currentTicket.status === 'closed'
                        ? 'بسته'
                        : 'در انتظار'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-foreground mb-4 text-lg font-semibold">
                جزئیات تیکت
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-muted-foreground text-sm font-medium">
                    وضعیت
                  </h3>
                  <p className="text-foreground mt-1 text-sm">
                    {currentTicket.status}
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground text-sm font-medium">
                    تاریخ ایجاد
                  </h3>
                  <p className="text-foreground mt-1 text-sm">
                    {currentTicket.created_at
                      ? new Date(currentTicket.created_at).toLocaleDateString(
                          'fa-IR'
                        )
                      : 'نامشخص'}
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground text-sm font-medium">
                    بخش
                  </h3>
                  <p className="text-foreground mt-1 text-sm">
                    {currentTicket.department}
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground text-sm font-medium">
                    مدرس
                  </h3>
                  <p className="text-foreground mt-1 text-sm">
                    {currentTicket.teacher || 'تعیین نشده'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-foreground mb-4 text-lg font-semibold">
                پیام‌ها
              </h2>
              <div className="space-y-4">
                {currentTicket.messages && currentTicket.messages.length > 0 ? (
                  currentTicket.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`rounded-lg p-4 ${
                        message.sender_type === 'student'
                          ? 'ml-8 bg-blue-50 dark:bg-blue-900/20'
                          : 'mr-8 bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-foreground text-sm font-medium">
                          {message.sender_type === 'student'
                            ? 'شما'
                            : message.sender_name || 'پشتیبانی'}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(message.created_at).toLocaleDateString(
                            'fa-IR'
                          )}{' '}
                          -{' '}
                          {new Date(message.created_at).toLocaleTimeString(
                            'fa-IR'
                          )}
                        </span>
                      </div>
                      <div className="text-foreground prose prose-sm dark:prose-invert max-w-none text-sm">
                        {message.message}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground py-8 text-center">
                    هنوز پیامی ثبت نشده است
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/student/tickets')}
              >
                بازگشت به لیست تیکت‌ها
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">تیکت مورد نظر یافت نشد</p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/student/tickets')}
              className="mt-4"
            >
              بازگشت به لیست تیکت‌ها
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
