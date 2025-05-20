'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { updateExam, Exam } from '@/lib/api/panel/admin/exams';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function EditExamForm({ exam }: { exam: Exam }) {
  const router = useRouter();

  const handleSubmit = async (formData: Partial<Exam>) => {
    try {
      await updateExam(exam.id.toString(), formData);
      toast.success('امتحان با موفقیت بروزرسانی شد');
      router.push('/admin/exams');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ذخیره امتحان');
      console.error('Failed to save exam:', error);
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await handleSubmit({
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          date: formData.get('date') as string || null,
          duration: formData.get('duration') ? Number(formData.get('duration')) : null,
          term_id: formData.get('term_id') ? Number(formData.get('term_id')) : null,
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
                required
                defaultValue={exam.title}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            توضیحات
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="description"
                name="description"
                required
                defaultValue={exam.description}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
            تاریخ
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="date"
                name="date"
                type="date"
                defaultValue={exam.date || ''}
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
                min="0"
                defaultValue={exam.duration || ''}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="term_id" className="mb-2 block text-sm font-medium">
            ترم
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="term_id"
                name="term_id"
                type="number"
                min="1"
                defaultValue={exam.term_id || ''}
                className="peer focus:border-primary-400 block w-full rounded-md border border-gray-200 py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/exams"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          لغو
        </Link>
        <Button type="submit">ویرایش امتحان</Button>
      </div>
    </form>
  );
} 