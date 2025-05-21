import request from '../../httpClient';

export interface OfflineSession {
  id: string;
  term_id: string;
  term_teacher_id: string;
  title: string;
  description: string;
  video_url: string;
}

export const getOfflineSessions = async () => {
  const response = await request<{ data: OfflineSession[] }>('teacher/offline_sessions');

  if (!response) {
    throw new Error('خطایی در دریافت لیست کلاس های آفلاین رخ داده است');
  }

  return response;
};

export const getOfflineSession = async (id: string) => {
  const response = await request<OfflineSession>(`teacher/offline_sessions/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت کلاس آفلاین رخ داده است');
  }

  return response;
};

export const createOfflineSession = async (data: Partial<OfflineSession>) => {
  const response = await request<OfflineSession>('teacher/offline_sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد کلاس آفلاین رخ داده است');
  }

  return response;
};

export const updateOfflineSession = async (id: string, data: Partial<OfflineSession>) => {
  const response = await request<OfflineSession>(`teacher/offline_sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی کلاس آفلاین رخ داده است');
  }

  return response;
};

export const deleteOfflineSession = async (id: string) => {
  const response = await request<OfflineSession>(`teacher/offline_sessions/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف کلاس آفلاین رخ داده است');
  }

  return response;
};
