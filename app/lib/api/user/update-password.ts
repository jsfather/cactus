import request from '@/app/lib/api/client';

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
