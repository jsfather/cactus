import request from '@/app/lib/api/client';

export const sendOTP = async (phone: string) => {
  const response = await request<{
    message: string;
    data: { otp: number; user_id: number };
  }>('send_otp', { method: 'POST', body: JSON.stringify({ phone }) });

  if (!response) {
    throw new Error('خطایی در ارسال کد رخ داده است');
  }

  return response;
};

export const verifyOTP = async (
  phone: string,
  password: string,
  otp: string
) => {
  const response = await request<{
    message: string;
    token: string;
  }>('verify_otp', {
    method: 'POST',
    body: JSON.stringify({ phone, password, otp }),
  });

  if (!response) {
    throw new Error('خطایی در تایید کد رخ داده است');
  }

  return response;
};
