import request from '../../httpClient';

export interface Term {
  id: string;
  title: string;
  duration: string;
  number_of_sessions: string;
  level_id: number;
  start_date: string;
  end_date: string;
  type: 'normal' | 'capacity_completion' | 'vip';
  capacity: string;
}

export const getTerms = async () => {
  const response = await request<{ data: Term[] }>('admin/terms');

  if (!response) {
    throw new Error('خطایی در دریافت لیست ترم‌ها رخ داده است');
  }

  return response;
};

export const getTerm = async (id: string) => {
  const response = await request<{ data: Term }>(`admin/terms/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت ترم رخ داده است');
  }

  return response;
};

export const createTerm = async (data: Partial<Term>) => {
  const response = await request<Term>('admin/terms', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد ترم رخ داده است');
  }

  return response;
};

export const updateTerm = async (id: string, data: Partial<Term>) => {
  const response = await request<Term>(`admin/terms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی ترم رخ داده است');
  }

  return response;
};

export const deleteTerm = async (id: string) => {
  const response = await request<Term>(`admin/terms/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف ترم رخ داده است');
  }

  return response;
};
