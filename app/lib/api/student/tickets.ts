import request from '@/app/lib/api/client';
import { Exam, Ticket } from '@/app/lib/types';

export const getTickets = async () => {
  const response = await request<{ data: Ticket[] }>('student/tickets');

  if (!response) {
    throw new Error('خطایی در دریافت لیست تیکت ها رخ داده است');
  }

  return response;
};

export const getTicket = async (id: number | string) => {
  const response = await request<{ data: Ticket }>(`student/ticket/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت تیکت رخ داده است');
  }

  return response;
};

export const createTicket = async (data: Partial<Ticket>) => {
  const response = await request<Exam>('student/ticket', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد تیکت رخ داده است');
  }

  return response;
};

export const getTicketDepartments = async () => {
  const response = await request<{
    data: { id: number | string; title: string };
  }>('student/tickets/departments');

  if (!response) {
    throw new Error('خطایی در دریافت لیست بخش های تیکت رخ داده است');
  }

  return response;
};
