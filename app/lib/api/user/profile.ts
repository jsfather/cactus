import request from '@/app/lib/api/client';
import { User } from '@/app/lib/types';

export const getProfile = async () => {
  const response = await request<{ data: User }>('profile');

  if (!response) {
    throw new Error('خطایی در دریافت اطلاعات پروفایل رخ داده است');
  }

  return response;
};

export const updateProfile = async (data: Partial<User>) => {
  const response = await request<User>(`profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی پروفایل رخ داده است');
  }

  return response;
};

export const updatePassword = async (data: {current_password: string, new_password: string, new_password_confirmation: string}) => {
  const response = await request<{message: string;}>(`update-password`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی کلمه عبور رخ داده است');
  }

  return response;
};
