import { ApiService } from '@/app/lib/api/client';
import { PanelGuide } from '@/app/lib/types';

export const getPanelGuides = async () => {
  const response = await ApiService.get<{ data: PanelGuide[] }>(
    'admin/panel-guides'
  );

  if (!response) {
    throw new Error('خطایی در دریافت لیست راهنماهای پنل رخ داده است');
  }

  return response;
};

export const getPanelGuide = async (id: number | string) => {
  const response = await ApiService.get<{ data: PanelGuide }>(
    `admin/panel-guides/${id}`
  );

  if (!response) {
    throw new Error('خطایی در دریافت راهنمای پنل رخ داده است');
  }

  return response;
};

export const createPanelGuide = async (
  data:
    | FormData
    | {
        title: string;
        description: string;
        type: string;
        file?: File;
      }
) => {
  let formData: FormData;

  if (data instanceof FormData) {
    // If already FormData, use it directly
    formData = data;
  } else {
    // Convert object to FormData
    formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('type', data.type);

    if (data.file) {
      formData.append('file', data.file);
    }
  }

  const response = await ApiService.post<{ data: PanelGuide }>(
    'admin/panel-guides',
    formData
  );

  if (!response) {
    throw new Error('خطایی در ایجاد راهنمای پنل رخ داده است');
  }

  return response;
};

export const updatePanelGuide = async (
  id: number | string,
  data:
    | FormData
    | {
        title: string;
        description: string;
        type: string;
        file?: File;
      }
) => {
  let formData: FormData;

  if (data instanceof FormData) {
    // If already FormData, use it directly
    formData = data;
  } else {
    // Convert object to FormData
    formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('type', data.type);

    if (data.file) {
      formData.append('file', data.file);
    }
  }

  const response = await ApiService.put<{ data: PanelGuide }>(
    `admin/panel-guides/${id}`,
    formData
  );

  if (!response) {
    throw new Error('خطایی در بروزرسانی راهنمای پنل رخ داده است');
  }

  return response;
};

export const deletePanelGuide = async (id: number | string) => {
  // For delete operations, we just need to know if it was successful
  // Status 204 indicates successful deletion, even with null response
  await ApiService.delete(`admin/panel-guides/${id}`);

  // If no error was thrown, the deletion was successful
  return { success: true };
};
