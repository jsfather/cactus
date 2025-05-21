import request from '../../httpClient';
import { Term } from './terms';

interface FileData {
  type: 'certificate' | 'national_card';
  file_path: string;
}

interface Person {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  national_code: string | null;
  profile_picture: string | null;
  files: FileData[];
}

interface HomeworkAnswer {
  id: number;
  description: string;
  file_url: string;
}

interface Homework {
  id: number;
  description: string;
  file_url: string | null;
  answers: HomeworkAnswer[];
}

interface Schedule {
  id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  homeworks: Homework[];
}

export interface Attendance {
  id: number;
  status: 'present' | 'absent' | string;
  absence_reason: string | null;
  mark: string;
  created_at: string;
  student: Person;
  teacher: Person;
  term: Term;
  schedule: Schedule;
}

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
