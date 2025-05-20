'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { updateTerm, Term } from '@/lib/api/panel/admin/terms';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function EditTermForm({ term }: { term: Term }) {
  const router = useRouter();

  const handleSubmit = async (formData: Partial<Term>) => {
    try {
      await updateTerm(term.id, formData);
      toast.success('ترم با موفقیت بروزرسانی شد');
      router.push('/admin/terms');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ذخیره ترم');
      console.error('Failed to save term:', error);
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await handleSubmit({
          title: formData.get('title') as string,
          duration: formData.get('duration') as string,
          number_of_sessions: formData.get('number_of_sessions') as string,
          level_id: Number(formData.get('level_id')),
          start_date: formData.get('start_date') as string,
          end_date: formData.get('end_date') as string,
          type: formData.get('type') as
            | 'normal'
            | 'capacity_completion'
            | 'vip',
          capacity: formData.get('capacity') as string,
        });
      }}
    >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            عنوان
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={term.title}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="duration" className="mb-2 block text-sm font-medium">
            مدت زمان (دقیقه)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="duration"
                name="duration"
                type="number"
                defaultValue={term.duration}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="number_of_sessions"
            className="mb-2 block text-sm font-medium"
          >
            تعداد جلسات
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="number_of_sessions"
                name="number_of_sessions"
                type="number"
                defaultValue={term.number_of_sessions}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="level_id" className="mb-2 block text-sm font-medium">
            سطح
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="level_id"
                name="level_id"
                type="number"
                defaultValue={term.level_id}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="start_date"
            className="mb-2 block text-sm font-medium"
          >
            تاریخ شروع
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={term.start_date}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="end_date" className="mb-2 block text-sm font-medium">
            تاریخ پایان
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="end_date"
                name="end_date"
                type="date"
                defaultValue={term.end_date}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="mb-2 block text-sm font-medium">
            نوع
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="type"
                name="type"
                defaultValue={term.type}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              >
                <option value="normal">عادی</option>
                <option value="capacity_completion">تکمیل ظرفیت</option>
                <option value="vip">ویژه</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="capacity" className="mb-2 block text-sm font-medium">
            ظرفیت
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="capacity"
                name="capacity"
                type="number"
                defaultValue={term.capacity}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/terms"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          لغو
        </Link>
        <Button type="submit">ویرایش ترم</Button>
      </div>
    </form>
  );
}
