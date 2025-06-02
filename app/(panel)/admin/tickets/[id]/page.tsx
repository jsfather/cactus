'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { getTicket} from '@/app/lib/api/admin/tickets';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';

const messageSchema = z.object({
  sender: z.string().min(1, 'فرستنده الزامی است'),
  is_student: z.number(),
  message: z.string().min(1, 'پیام الزامی است'),
  attachment: z.string().nullable(),
});

const ticketSchema = z.object({
  subject: z.string().min(1, 'موضوع الزامی است'),
  status: z.string().min(1, 'وضعیت الزامی است'),
  student: z.string().min(1, 'دانش پژوه الزامی است'),
  teacher: z.string().min(1, 'مدرس الزامی است'),
  department: z.string().min(1, 'بخش الزامی است'),
  messages: z.array(messageSchema),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const statusOptions = [
  { value: 'open', label: 'باز' },
  { value: 'closed', label: 'بسته' },
  { value: 'pending', label: 'در انتظار' },
];

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
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      messages: [],
    },
  });

  useEffect(() => {
    const fetchTicket = async () => {
      if (isNew) return;

      try {
        const response = await getTicket(resolvedParams.id);
        const ticket = response.data;
        reset({
          subject: ticket.subject,
          status: ticket.status,
          student: ticket.student,
          teacher: ticket.teacher,
          department: ticket.department,
          messages: ticket.messages,
        });
      } catch (error) {
        router.push('/admin/tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: TicketFormData) => {
    try {
      if (isNew) {
        await createTicket(data);
        toast.success('تیکت با موفقیت ایجاد شد');
      } else {
        await updateTicket(resolvedParams.id, data);
        toast.success('تیکت با موفقیت بروزرسانی شد');
      }
      router.push('/admin/tickets');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد تیکت' : 'خطا در بروزرسانی تیکت');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'تیکت‌ها', href: '/admin/tickets' },
          {
            label: isNew ? 'ایجاد تیکت' : 'ویرایش تیکت',
            href: `/admin/tickets/${resolvedParams.id}`,
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
            id="status"
            label="وضعیت"
            placeholder="وضعیت تیکت را انتخاب کنید"
            options={statusOptions}
            required
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="student"
            label="دانش پژوه"
            placeholder="دانش پژوه را وارد کنید"
            required
            error={errors.student?.message}
            {...register('student')}
          />

          <Input
            id="teacher"
            label="مدرس"
            placeholder="مدرس را وارد کنید"
            required
            error={errors.teacher?.message}
            {...register('teacher')}
          />
        </div>

        <div className="w-full">
          <Input
            id="department"
            label="بخش"
            placeholder="بخش را وارد کنید"
            required
            error={errors.department?.message}
            {...register('department')}
          />
        </div>

        {/* Messages Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">پیام‌ها</h3>
          {/* Add dynamic form fields for messages */}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/tickets')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد تیکت' : 'بروزرسانی تیکت'}
          </Button>
        </div>
      </form>
    </main>
  );
}
