'use client';

import { Attendance } from '@/app/lib/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TermsTable({}: { query: string; currentPage: number }) {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendances = async () => {
    try {
      // const data = (await getAttendances()).data;
      // Ensure data is an array
      // setAttendances(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('خطا در دریافت لیست حضور و غیاب');
      console.error('Failed to fetch terms:', error);
      setAttendances([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="animate-pulse">
              <div className="md:hidden">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mb-2 w-full rounded-md bg-white p-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <div className="h-4 w-24 rounded bg-gray-200"></div>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div className="h-4 w-32 rounded bg-gray-200"></div>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 rounded bg-gray-200"></div>
                        <div className="h-8 w-8 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-right text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-3 py-5 font-medium">
                      عنوان
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      مدت زمان
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      تعداد جلسات
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      نوع
                    </th>
                    <th scope="col" className="relative py-3 pr-3 pl-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {[1, 2, 3].map((i) => (
                    <tr
                      key={i}
                      className="w-full border-b border-gray-200 py-3 text-sm"
                    >
                      <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                        <div className="h-4 w-24 rounded bg-gray-200"></div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="h-4 w-16 rounded bg-gray-200"></div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="h-4 w-16 rounded bg-gray-200"></div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="h-4 w-16 rounded bg-gray-200"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {attendances.length === 0 ? (
              <div className="mb-2 w-full rounded-md bg-white p-4 text-center">
                <p className="text-gray-500">هیچ حضور و غیابی یافت نشد</p>
              </div>
            ) : (
              attendances.map((attendance) => (
                <div
                  key={attendance.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {attendance.student.first_name}{' '}
                        {attendance.student.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">{attendance.status}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-right text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium">
                  نام و نام خانوادگی
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  وضعیت
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  علت غیاب
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  وضعیت
                </th>
                <th scope="col" className="relative py-3 pr-3 pl-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    هیچ حضور و غیابی یافت نشد
                  </td>
                </tr>
              ) : (
                attendances.map((attendance) => (
                  <tr
                    key={attendance.id}
                    className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <p>
                          {attendance.student.first_name}{' '}
                          {attendance.student.last_name}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {attendance.status}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {attendance.absence_reason}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {attendance.status === 'present' && 'حضور'}
                      {attendance.status === 'absent' && 'غیاب'}
                      {attendance.status === 'late' && 'دیرکرد'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
