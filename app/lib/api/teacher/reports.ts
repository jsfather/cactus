import request from '@/app/lib/api/client';
import { Report } from '@/app/lib/types';


export const getReports = async () => {
  const response = await request<{ data: Report[] }>('teacher/reports');

  if (!response) {
    throw new Error('خطایی در دریافت لیست گزارش‌ ترم ها رخ داده است');
  }

  return response;
};

export const getReport = async (id: string) => {
  const response = await request<Report>(`teacher/reports/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت گزارش ترم رخ داده است');
  }

  return response;
};

export const createReport = async (data: Partial<Report>) => {
  const response = await request<Report>('teacher/reports', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد گزارش ترم رخ داده است');
  }

  return response;
};


export const deleteReport = async (id: string) => {
  const response = await request<Report>(`teacher/reports/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف گزارش ترم رخ داده است');
  }

  return response;
};
