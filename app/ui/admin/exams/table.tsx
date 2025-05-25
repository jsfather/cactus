'use client';

import { UpdateExam, DeleteExam } from '@/app/ui/admin/exams/buttons';
import { getExams } from '@/app/lib/api/admin/exams';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Exam } from '@/app/lib/types';

export default function ExamsTable({}: { query: string; currentPage: number }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = async () => {
    try {
      const data = (await getExams()).data;
      setExams(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('خطا در دریافت لیست آزمون ها');
      console.error('Failed to fetch exams:', error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
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
                      توضیحات
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      تاریخ
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      مدت زمان
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
                        <div className="h-4 w-32 rounded bg-gray-200"></div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="h-4 w-24 rounded bg-gray-200"></div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="h-4 w-16 rounded bg-gray-200"></div>
                      </td>
                      <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                        <div className="flex justify-end gap-3">
                          <div className="h-8 w-8 rounded bg-gray-200"></div>
                          <div className="h-8 w-8 rounded bg-gray-200"></div>
                        </div>
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
            {exams.length === 0 ? (
              <div className="mb-2 w-full rounded-md bg-white p-4 text-center">
                <p className="text-gray-500">هیچ آزمونی یافت نشد</p>
              </div>
            ) : (
              exams.map((exam) => (
                <div
                  key={exam.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                      <p className="text-sm text-gray-500">{exam.title}</p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">{exam.description}</p>
                      <p className="text-sm text-gray-500">
                        {exam.date &&
                          new Date(exam.date).toLocaleDateString('fa-IR')}
                        {exam.duration && ` - ${exam.duration} دقیقه`}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateExam id={exam.id.toString()} />
                      <DeleteExam id={exam.id.toString()} />
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
                  عنوان
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  توضیحات
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  تاریخ
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  مدت زمان
                </th>
                <th scope="col" className="relative py-3 pr-3 pl-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {exams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    هیچ آزمونی یافت نشد
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr
                    key={exam.id}
                    className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <p>{exam.title}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {exam.description}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {exam.date
                        ? new Date(exam.date).toLocaleDateString('fa-IR')
                        : '-'}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {exam.duration ? `${exam.duration} دقیقه` : '-'}
                    </td>
                    <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                      <div className="flex justify-end gap-3">
                        <UpdateExam id={exam.id.toString()} />
                        <DeleteExam id={exam.id.toString()} />
                      </div>
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
