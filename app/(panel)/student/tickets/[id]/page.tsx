'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getTicket, createTicket } from '@/app/lib/api/student/tickets';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Textarea from '@/app/components/ui/Textarea';
import Select from '@/app/components/ui/Select';

const ticketSchema = z.object({
  subject: z.string().min(1, 'موضوع الزامی است'),
  message: z.string().min(1, 'پیام الزامی است'),
  department: z.string().min(1, 'بخش الزامی است'),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const departmentOptions = [
  { value: 'technical', label: 'فنی' },
  { value: 'educational', label: 'آموزشی' },
  { value: 'financial', label: 'مالی' },
  { value: 'other', label: 'سایر' },
];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [ticket, setTicket] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  useEffect(() => {
    const fetchTicket = async () => {
      if (isNew) {
        setLoading(false);
        return;
      }

      try {
        const response = await getTicket(resolvedParams.id);
        setTicket(response.data);
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات تیکت');
        router.push('/student/tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [isNew, resolvedParams.id, router]);

  const onSubmit = async (data: TicketFormData) => {
    try {
      await createTicket(data);
      toast.success('تیکت با موفقیت ایجاد شد');
      router.push('/student/tickets');
    } catch (error) {
      toast.error('خطا در ایجاد تیکت');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isNew) {
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">موضوع</h3>
              <p className="mt-1 text-sm text-gray-900">{ticket.subject}</p>
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
                  <p className="mt-2 text-sm text-gray-700">{message.content}</p>
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
