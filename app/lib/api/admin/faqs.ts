import { ApiService } from '@/app/lib/api/client';
import { FAQ } from '@/app/lib/types';

export const getFAQs = async () => {
  const response = await ApiService.get<{ data: FAQ[] }>('admin/faqs');

  if (!response) {
    throw new Error('خطایی در دریافت لیست سوالات متداول رخ داده است');
  }

  return response;
};

export const getFAQ = async (id: number | string) => {
  const response = await ApiService.get<{ data: FAQ }>(`admin/faqs/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت سوال متداول رخ داده است');
  }

  return response;
};

export const createFAQ = async (data: Partial<FAQ>) => {
  const response = await ApiService.post<{ data: FAQ }>('admin/faqs', data);

  if (!response) {
    throw new Error('خطایی در ایجاد سوال متداول رخ داده است');
  }

  return response;
};

export const updateFAQ = async (id: number | string, data: Partial<FAQ>) => {
  const response = await ApiService.put<{ data: FAQ }>(`admin/faqs/${id}`, data);

  if (!response) {
    throw new Error('خطایی در بروزرسانی سوال متداول رخ داده است');
  }

  return response;
};

export const deleteFAQ = async (id: number | string) => {
  // For delete operations, we just need to know if it was successful
  await ApiService.delete(`admin/faqs/${id}`);
  
  // If no error was thrown, the deletion was successful
  return { success: true };
};
