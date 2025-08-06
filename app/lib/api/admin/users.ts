import request from '@/app/lib/api/client';
import { User } from '@/app/lib/types';

export const getUsers = async () => {
  const response = await request<{ data: User[] }>('admin/users');

  if (!response) {
    throw new Error('خطایی در دریافت لیست کاربران رخ داده است');
  }

  return response;
};

export const getUser = async (id: string) => {
  const response = await request<{ data: User }>(`admin/users/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت کاربر رخ داده است');
  }

  return response;
};

export const createUser = async (data: FormData | Partial<User>) => {
  const options: RequestInit = {
    method: 'POST',
  };

  if (data instanceof FormData) {
    options.body = data;
  } else {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json',
    };
  }

  const response = await request<User>('admin/users', options);

  if (!response) {
    throw new Error('خطایی در ایجاد کاربر رخ داده است');
  }

  return response;
};

export const updateUser = async (id: string | number, data: FormData | Partial<User>) => {
  const options: RequestInit = {
    method: 'PUT',
  };

  if (data instanceof FormData) {
    options.body = data;
  } else {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json',
    };
  }

  const response = await request<User>(`admin/users/${id}`, options);

  if (!response) {
    throw new Error('خطایی در بروزرسانی کاربر رخ داده است');
  }

  return response;
};

export const deleteUser = async (id: string | number) => {
  const response = await request<User>(`admin/users/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف کاربر رخ داده است');
  }

  return response;
};
