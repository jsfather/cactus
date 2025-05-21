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
  const response = await request<{ data: Term[] }>('teacher/terms');

  if (!response) {
    throw new Error('خطایی در دریافت لیست ترم‌ها رخ داده است');
  }

  return response;
};

export const getTerm = async (id: string) => {
  const response = await request<{ data: Term }>(`teacher/terms/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت ترم رخ داده است');
  }

  return response;
};
