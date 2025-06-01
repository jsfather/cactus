import request from '@/app/lib/api/client';
import { PanelGuide } from '@/app/lib/types';

export const getPanelGuides = async () => {
  const response = await request<{ data: PanelGuide[] }>('admin/panel-guides');

  if (!response) {
    throw new Error('خطایی در دریافت لیست راهنماهای پنل رخ داده است');
  }

  return response;
};

export const getPanelGuide = async (id: number | string) => {
  const response = await request<{ data: PanelGuide }>(
    `admin/panel-guides/${id}`
  );

  if (!response) {
    throw new Error('خطایی در دریافت راهنمای پنل رخ داده است');
  }

  return response;
};

export const createPanelGuide = async (data: Partial<PanelGuide>) => {
  const response = await request<{ data: PanelGuide }>('admin/panel-guides', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد راهنمای پنل رخ داده است');
  }

  return response;
};

export const updatePanelGuide = async (
  id: number | string,
  data: Partial<PanelGuide>
) => {
  const response = await request<{ data: PanelGuide }>(
    `admin/panel-guides/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );

  if (!response) {
    throw new Error('خطایی در بروزرسانی راهنمای پنل رخ داده است');
  }

  return response;
};

export const deletePanelGuide = async (id: number | string) => {
  const response = await request<{ data: PanelGuide }>(
    `admin/panel-guides/${id}`,
    {
      method: 'DELETE',
    }
  );

  if (!response) {
    throw new Error('خطایی در حذف راهنمای پنل رخ داده است');
  }

  return response;
};
