import request from '@/app/lib/api/client';
import { Reply, Ticket } from '@/app/lib/types';


export const getTickets = async () => {
  const response = await request<{ data: Ticket[] }>('teacher/tickets');

  if (!response) {
    throw new Error('خطایی در دریافت لیست تیکت ها رخ داده است');
  }

  return response;
};

export const getTicket = async (id: string) => {
  const response = await request<{ data: Ticket }>(`teacher/ticket/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت تیکت رخ داده است');
  }

  return response;
};

export const replyTicket = async (id: string, data: Partial<Reply>) => {
  const response = await request<Reply>(`teacher/ticket/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد پاسخ به تیکت رخ داده است');
  }

  return response;
};
