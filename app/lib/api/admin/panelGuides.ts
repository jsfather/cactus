import request from '@/app/lib/api/client';

export interface PanelGuide {
  id: number | string;
  title: string;
  description: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getPanelGuides = async () => {
  const response = await request<{ data: PanelGuide[] }>('/api/admin/panel-guides');

  if (!response?.data) {
    throw new Error('خطایی در دریافت راهنماها رخ داده است');
  }

  return response.data;
};

export const getPanelGuide = async (id: number | string) => {
  const response = await request<{ data: PanelGuide }>(`/api/admin/panel-guides/${id}`);

  if (!response?.data) {
    throw new Error('خطایی در دریافت راهنما رخ داده است');
  }

  return response.data;
};

export const createPanelGuide = async (data: Partial<PanelGuide>) => {
  const response = await request<{ data: PanelGuide; message: string }>('/api/admin/panel-guides', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در ایجاد راهنما رخ داده است');
  }

  return response.data;
};

export const updatePanelGuide = async (id: number | string, data: Partial<PanelGuide>) => {
  const response = await request<{ data: PanelGuide; message: string }>(`/api/admin/panel-guides/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response?.data) {
    throw new Error('خطایی در بروزرسانی راهنما رخ داده است');
  }

  return response.data;
};

export const deletePanelGuide = async (id: number | string) => {
  const response = await request<{ message: string }>(`/api/admin/panel-guides/${id}`, {
    method: 'DELETE',
  });

  if (!response?.message) {
    throw new Error('خطایی در حذف راهنما رخ داده است');
  }

  return response;
};
