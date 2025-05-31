'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';
import { createExam } from '@/app/lib/api/admin/exams';
import { getTerms } from '@/app/lib/api/admin/terms';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import moment from 'jalali-moment';
import { Term } from '@/app/lib/types';

type FormData = {
  title: string;
  description: string;
  date?: string;
  duration?: number;
  term_id?: number;
};

export default function Form() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [terms, setTerms] = useState<Term[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await getTerms();
        setTerms(response.data);
      } catch (error) {
        console.error('Failed to fetch terms:', error);
        toast.error('خطا در دریافت لیست ترم‌ها');
      }
    };

    fetchTerms();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await createExam(data);
      toast.success('آزمون با موفقیت ایجاد شد');
      router.push('/admin/exams');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ایجاد آزمون');
      console.error('Failed to create exam:', error);
    }
  };

  const handleDateChange = (date: any) => {
    const year = date.year;
    const month = date.month;
    const day = date.day;
    const persianDate = `${year}/${month}/${day}`;
    const gregorianDate = moment(persianDate, 'jYYYY/jMM/jDD').format(
      'YYYY-MM-DD'
    );
    setSelectedDate(persianDate);
    setValue('date', gregorianDate);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            عنوان <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative w-1/2">
              <input
                id="title"
                {...register('title', { required: 'عنوان الزامی است' })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            توضیحات <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="description"
                rows={6}
                {...register('description', { required: 'توضیحات الزامی است' })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="mb-2 block text-sm font-medium">
              تاریخ
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  onChange={handleDateChange}
                  value={selectedDate}
                  inputClass={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  containerClassName="w-full"
                  format="YYYY/MM/DD"
                  placeholder="تاریخ را انتخاب کنید"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="duration"
              className="mb-2 block text-sm font-medium"
            >
              مدت زمان (دقیقه)
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="duration"
                  type="number"
                  min="0"
                  {...register('duration', {
                    min: { value: 0, message: 'مدت زمان باید مثبت باشد' },
                  })}
                  className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                    errors.duration ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="term_id" className="mb-2 block text-sm font-medium">
              ترم
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <select
                  id="term_id"
                  {...register('term_id')}
                  className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                    errors.term_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">انتخاب ترم</option>
                  {terms.map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.title}
                    </option>
                  ))}
                </select>
                {errors.term_id && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.term_id.message}
                  </p>
                )}
              </div>
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
        <Button type="submit" loading={isSubmitting}>
          ساخت آزمون
        </Button>
      </div>
    </form>
  );
}
