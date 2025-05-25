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

export const createUser = async (data: Partial<User>) => {
  const response = await request<User>('admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد کاربر رخ داده است');
  }

  return response;
};

export const updateUser = async (id: string, data: Partial<User>) => {
  const response = await request<User>(`admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

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
