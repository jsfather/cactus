import request from '@/app/lib/api/client';
import { Attendance } from '@/app/lib/types';

export const getAttendances = async () => {
  const response = await request<{ data: Attendance[] }>('student/attendances');

  if (!response) {
    throw new Error('خطایی در دریافت لیست حضور و غیاب رخ داده است');
  }

  return response;
};

export const getAttendance = async (id: string) => {
  const response = await request<{ data: Attendance }>(
    `student/attendances/${id}`
  );

  if (!response) {
    throw new Error('خطایی در دریافت اطلاعات حضور و غیاب رخ داده است');
  }

  return response;
};
