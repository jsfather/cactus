'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { updateTerm, Term } from '@/lib/api/panel/admin/terms';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import moment from 'jalali-moment';

type FormData = {
  title: string;
  duration: string;
  number_of_sessions: string;
  level: {
    name: string;
    id: number;
    label: string;
  };
  start_date: string;
  end_date: string;
  type: 'normal' | 'capacity_completion' | 'vip';
  capacity: string;
};

export default function EditTermForm({ term }: { term: Term }) {
  const router = useRouter();
  const [selectedStartDate, setSelectedStartDate] = useState<string>(
    term.start_date ? moment(term.start_date).format('jYYYY/jMM/jDD') : ''
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string>(
    term.end_date ? moment(term.end_date).format('jYYYY/jMM/jDD') : ''
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: term.title,
      duration: term.duration,
      number_of_sessions: term.number_of_sessions,
      level_id: term.level.id.toString(),
      start_date: term.start_date,
      end_date: term.end_date,
      type: term.type,
      capacity: term.capacity,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateTerm(term.id, {
        ...data,
        level_id: Number(data.level_id),
      });
      toast.success('ترم با موفقیت بروزرسانی شد');
      router.push('/admin/terms');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ذخیره ترم');
      console.error('Failed to save term:', error);
    }
  };

  const handleStartDateChange = (date: any) => {
    const year = date.year;
    const month = date.month;
    const day = date.day;
    const persianDate = `${year}/${month}/${day}`;
    const gregorianDate = moment(persianDate, 'jYYYY/jMM/jDD').format(
      'YYYY-MM-DD'
    );
    setSelectedStartDate(persianDate);
    setValue('start_date', gregorianDate);
  };

  const handleEndDateChange = (date: any) => {
    const year = date.year;
    const month = date.month;
    const day = date.day;
    const persianDate = `${year}/${month}/${day}`;
    const gregorianDate = moment(persianDate, 'jYYYY/jMM/jDD').format(
      'YYYY-MM-DD'
    );
    setSelectedEndDate(persianDate);
    setValue('end_date', gregorianDate);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* First Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              عنوان <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
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

          <div>
            <label
              htmlFor="duration"
              className="mb-2 block text-sm font-medium"
            >
              مدت زمان (دقیقه) <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="duration"
                type="number"
                {...register('duration', { required: 'مدت زمان الزامی است' })}
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

          <div>
            <label
              htmlFor="number_of_sessions"
              className="mb-2 block text-sm font-medium"
            >
              تعداد جلسات <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="number_of_sessions"
                type="number"
                {...register('number_of_sessions', {
                  required: 'تعداد جلسات الزامی است',
                })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.number_of_sessions
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors.number_of_sessions && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.number_of_sessions.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="level_id"
              className="mb-2 block text-sm font-medium"
            >
              سطح <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="level_id"
                type="number"
                {...register('level_id', { required: 'سطح الزامی است' })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.level_id ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.level_id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.level_id.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label
              htmlFor="start_date"
              className="mb-2 block text-sm font-medium"
            >
              تاریخ شروع <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                onChange={handleStartDateChange}
                value={selectedStartDate}
                inputClass={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.start_date ? 'border-red-500' : 'border-gray-300'
                }`}
                containerClassName="w-full"
                format="YYYY/MM/DD"
                placeholder="تاریخ شروع را انتخاب کنید"
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.start_date.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="end_date"
              className="mb-2 block text-sm font-medium"
            >
              تاریخ پایان <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                onChange={handleEndDateChange}
                value={selectedEndDate}
                inputClass={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.end_date ? 'border-red-500' : 'border-gray-300'
                }`}
                containerClassName="w-full"
                format="YYYY/MM/DD"
                placeholder="تاریخ پایان را انتخاب کنید"
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="type" className="mb-2 block text-sm font-medium">
              نوع <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <select
                id="type"
                {...register('type', { required: 'نوع الزامی است' })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="normal">عادی</option>
                <option value="capacity_completion">تکمیل ظرفیت</option>
                <option value="vip">ویژه</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="capacity"
              className="mb-2 block text-sm font-medium"
            >
              ظرفیت <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="capacity"
                type="number"
                {...register('capacity', { required: 'ظرفیت الزامی است' })}
                className={`peer block w-full rounded-md border py-2 pr-4 text-sm placeholder:text-gray-500 focus:outline-0 ${
                  errors.capacity ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.capacity.message}
                </p>
              )}
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
        <Button type="submit" loading={isSubmitting}>
          ویرایش ترم
        </Button>
      </div>
    </form>
  );
}
