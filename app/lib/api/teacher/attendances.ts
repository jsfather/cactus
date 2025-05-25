import request from '@/app/lib/api/client';
import { Attendance } from '@/app/lib/types';

export const getStudent = async (id: string) => {
  const response = await request<{ data: Attendance[] }>(
    `teacher/attendances/student/${id}`
  );

  if (!response) {
    throw new Error('خطایی در دریافت اطلاعات دانش آموز رخ داده است');
  }

  return response;
};

export const getAbsents = async () => {
  const response = await request<{ data: Attendance[] }>(
    'teacher/attendances/absents'
  );

  if (!response) {
    throw new Error('خطایی در دریافت لیست غایبین رخ داده است');
  }

  return response;
};

export const getTermAttendance = async (id: string) => {
  const response = await request<{ data: Attendance[] }>(
    `teacher/attendances/term/${id}`
  );

  if (!response) {
    throw new Error('خطایی در دریافت لیست حضور و عیاب ترم رخ داده است');
  }

  return response;
};

export const getSchedule = async (id: string) => {
  const response = await request<{ data: Attendance[] }>(
    `teacher/attendances/schedule/${id}`
  );

  if (!response) {
    throw new Error('خطایی در دریافت تقویم رخ داده است');
  }

  return response;
};

export const createAttendance = async (data: Partial<Attendance>) => {
  const response = await request<Attendance>('teacher/attendances', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ایجاد حضور و غیاب رخ داده است');
  }

  return response;
};
