'use client';

import { UpdateOfflineSession, DeleteOfflineSession } from '@/components/ui/teacher/offline_sessions/buttons';
import { OfflineSession, getOfflineSessions } from '@/lib/api/panel/teacher/offline_sessions';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function OfflineSessionsTable({}: { query: string; currentPage: number }) {
  const [offlineSessions, setOfflineSessions] = useState<OfflineSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOfflineSessions = async () => {
    try {
      const data = await getOfflineSessions();
      setOfflineSessions(data.data);
    } catch (error) {
      toast.error('خطا در دریافت لیست کلاس آفلاین‌ها');
      console.error('Failed to fetch offline sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchOfflineSessions();
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
                      توضیحات کوتاه
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      عنوان متا
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
                        <div className="h-4 w-32 rounded bg-gray-200"></div>
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
            {offlineSessions.length === 0 ? (
              <div className="mb-2 w-full rounded-md bg-white p-4 text-center">
                <p className="text-gray-500">هیچ کلاس آفلاینی یافت نشد</p>
              </div>
            ) : (
              offlineSessions?.map((offlineSession) => (
                <div
                  key={offlineSession.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                      <p className="text-sm text-gray-500">{offlineSession.term_id}</p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">
                        {offlineSession.title}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        {offlineSession.description}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateOfflineSession id={offlineSession.id} />
                      <DeleteOfflineSession id={offlineSession.id} />
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
                  ترم
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  عنوان
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  توضیحات
                </th>
                <th scope="col" className="relative py-3 pr-3 pl-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {offlineSessions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    هیچ کلاس آفلاینی یافت نشد
                  </td>
                </tr>
              ) : (
                offlineSessions?.map((offlineSession) => (
                  <tr
                    key={offlineSession.id}
                    className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <p>{offlineSession.term_id}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                        {offlineSession.title}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {offlineSession.description}
                    </td>
                    <td className="py-3 pr-3 pl-6 whitespace-nowrap">
                      <div className="flex justify-end gap-3">
                        <UpdateOfflineSession id={offlineSession.id} />
                        <DeleteOfflineSession id={offlineSession.id} />
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
