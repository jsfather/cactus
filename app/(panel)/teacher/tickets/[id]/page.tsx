'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getTicket, replyTicket } from '@/app/lib/api/teacher/tickets';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Textarea from '@/app/components/ui/Textarea';

const replySchema = z.object({
  message: z.string().min(1, 'پیام الزامی است'),
});

type ReplyFormData = z.infer<typeof replySchema>;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
  });

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await getTicket(resolvedParams.id);
        setTicket(response.data);
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات تیکت');
        router.push('/teacher/tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [resolvedParams.id, router]);

  const onSubmit = async (data: ReplyFormData) => {
    try {
      await replyTicket(resolvedParams.id, data);
      toast.success('پاسخ با موفقیت ارسال شد');
      reset();
      // Refresh ticket data
      const response = await getTicket(resolvedParams.id);
      setTicket(response.data);
    } catch (error) {
      toast.error('خطا در ارسال پاسخ');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'تیکت‌ها', href: '/teacher/tickets' },
          {
            label: 'مشاهده تیکت',
            href: `/teacher/tickets/${resolvedParams.id}`,
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
            <h3 className="text-sm font-medium text-gray-500">دانش پژوه</h3>
            <p className="mt-1 text-sm text-gray-900">{ticket.student}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">بخش</h3>
            <p className="mt-1 text-sm text-gray-900">{ticket.department}</p>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Textarea
            id="message"
            label="پاسخ"
            placeholder="پاسخ خود را وارد کنید"
            required
            error={errors.message?.message}
            {...register('message')}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="white"
              onClick={() => router.push('/teacher/tickets')}
            >
              بازگشت
            </Button>
            <Button type="submit" loading={isSubmitting}>
              ارسال پاسخ
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
