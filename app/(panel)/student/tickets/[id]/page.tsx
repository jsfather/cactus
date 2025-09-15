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
    ticket,
    departments,
    isLoading,
    isDepartmentsLoading,
    fetchTicket,
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
      fetchTicket(params.id);
    }
  }, [params.id, isCreating, fetchTicket, fetchDepartments]);

  const onSubmit = async (data: TicketFormData) => {
    try {
      const payload = {
        subject: data.subject,
        message: data.message,
        department_id: parseInt(data.department_id),
        teacher_id: data.teacher_id || '',
      };
      
      await createTicket(payload);
      toast.success('تیکت با موفقیت ایجاد شد');
      router.push('/student/tickets');
    } catch (error) {
      // Error handling is done in the store
    }
  };

  if (loading && !isNew) {
    return <LoadingSpinner />;
  }

  // Department options for select
  const departmentOptions = departments.map(dept => ({
    value: dept.id.toString(),
    label: dept.title,
  }));

  if (!isNew && currentTicket) {
    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'تیکت‌ها', href: '/student/tickets' },
            {
              label: 'مشاهده تیکت',
              href: `/student/tickets/${resolvedParams.id}`,
              active: true,
            },
          ]}
        />

        <div className="mt-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">موضوع</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{currentTicket.subject}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">وضعیت</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {currentTicket.status === 'open' ? 'باز' : 
                   currentTicket.status === 'closed' ? 'بسته' : 
                   currentTicket.status === 'pending' ? 'در انتظار' : currentTicket.status}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">بخش</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{currentTicket.department}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">مدرس</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{currentTicket.teacher || 'تعیین نشده'}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">پیام‌ها</h3>
            <div className="space-y-4">
              {currentTicket.messages?.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.is_student 
                      ? 'bg-blue-50 dark:bg-blue-900/20 ml-8' 
                      : 'bg-gray-50 dark:bg-gray-700 mr-8'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {message.sender}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.created_at).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <MarkdownRenderer content={message.message} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'تیکت‌ها', href: '/student/tickets' },
          {
            label: 'ایجاد تیکت',
            href: '/student/tickets/new',
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="subject"
            label="موضوع"
            placeholder="موضوع تیکت را وارد کنید"
            required
            error={errors.subject?.message}
            {...register('subject')}
          />

          <Controller
            name="department_id"
            control={control}
            render={({ field }) => (
              <Select
                id="department_id"
                label="بخش"
                placeholder="بخش مربوطه را انتخاب کنید"
                options={departmentOptions}
                required
                loading={isDepartmentsLoading}
                error={errors.department_id?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Input
            id="teacher_id"
            label="شناسه مدرس (اختیاری)"
            placeholder="در صورت تمایل شناسه مدرس را وارد کنید"
            error={errors.teacher_id?.message}
            {...register('teacher_id')}
          />
        </div>

        <div className="w-full">
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
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/student/tickets')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            ایجاد تیکت
          </Button>
        </div>
      </form>
    </main>
  );
}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">وضعیت</h3>
              <p className="mt-1 text-sm text-gray-900">{ticket.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">بخش</h3>
              <p className="mt-1 text-sm text-gray-900">{ticket.department}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">مدرس</h3>
              <p className="mt-1 text-sm text-gray-900">{ticket.teacher}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">پیام‌ها</h3>
            <div className="space-y-4">
              {ticket.messages.map((message: any) => (
                <div
                  key={message.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {message.sender}
                    </span>
                    <span className="text-sm text-gray-500">
                      {message.created_at}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="white"
              onClick={() => router.push('/student/tickets')}
            >
              بازگشت
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'تیکت‌ها', href: '/student/tickets' },
          {
            label: 'ایجاد تیکت',
            href: `/student/tickets/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="subject"
            label="موضوع"
            placeholder="موضوع تیکت را وارد کنید"
            required
            error={errors.subject?.message}
            {...register('subject')}
          />

          <Select
            id="department"
            label="بخش"
            placeholder="بخش مورد نظر را انتخاب کنید"
            options={departmentOptions}
            required
            error={errors.department?.message}
            {...register('department')}
          />
        </div>

        <div className="w-full">
          <Textarea
            id="message"
            label="پیام"
            placeholder="پیام خود را وارد کنید"
            required
            error={errors.message?.message}
            {...register('message')}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/student/tickets')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            ایجاد تیکت
          </Button>
        </div>
      </form>
    </main>
  );
}
