import request from '@/app/lib/api/client';
import { Ticket } from '@/app/lib/types';

export const getTickets = async () => {
  const response = await request<{ data: Ticket[] }>('admin/tickets');

  if (!response) {
    throw new Error('خطایی در دریافت لیست تیکت ها رخ داده است');
  }

  return response;
};

export const getTeacherTickets = async () => {
  const response = await request<{ data: Ticket[] }>('admin/teacher_tickets');

  if (!response) {
    throw new Error('خطایی در دریافت لیست تیکت های مدرس رخ داده است');
  }

  return response;
};

export const getTicket = async (id: number | string) => {
  const response = await request<{ data: Ticket }>(`admin/tickets/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت تیکت رخ داده است');
  }

  return response;
};

export const closeTicket = async (id: number | string) => {
  const response = await request<{ data: Ticket }>(`admin/ticket/${id}/close`, {
    method: 'POST',
  });

  if (!response) {
    throw new Error('خطایی در بستن تیکت رخ داده است');
  }

  return response;
};

export const replyTicket = async (id: number | string, message: string) => {
  const response = await request<{ data: Ticket }>(`admin/ticket/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify(message),
  });

  if (!response) {
    throw new Error('خطایی در پاسخ به تیکت رخ داده است');
  }

  return response;
};

export const getTicketDepartments = async () => {
  const response = await request<{
    data: { id: number | string; title: string };
  }>('admin/tickets/departments');

  if (!response) {
    throw new Error('خطایی در دریافت لیست بخش های تیکت رخ داده است');
  }

  return response;
};

export const createTicketDepartment = async (title: string) => {
  const response = await request<{
    data: { id: number | string; title: string };
  }>('admin/tickets/departments', {
    method: 'POST',
    body: JSON.stringify(title),
  });

  if (!response) {
    throw new Error('خطایی در ساخت بخش تیکت رخ داده است');
  }

  return response;
};

export const deleteTicketDepartment = async (id: number | string) => {
  const response = await request<{
    data: { id: number | string; title: string };
  }>(`admin/tickets/departments/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف بخش تیکت رخ داده است');
  }

  return response;
};
