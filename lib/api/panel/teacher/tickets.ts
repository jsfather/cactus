import request from '../../httpClient';

interface Message {
  sender: string;
  is_student: number;
  message: string;
  attachment: string | null;
  created_at: string;
}

export interface Ticket {
  id: number;
  subject: string;
  status: string;
  student: string;
  teacher: string;
  department: string;
  messages: Message[];
}

interface Reply {
  message: string;
}

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
