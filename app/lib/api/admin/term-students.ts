import { apiClient } from '@/app/lib/api/client';
import { TermStudent } from '@/app/lib/types/term_student';

export const getTermStudents = async (filters?: {
  student_id?: string;
  term_id?: string;
}) => {
  const params = new URLSearchParams();

  if (filters?.student_id) {
    params.append('student_id', filters.student_id);
  }

  if (filters?.term_id) {
    params.append('term_id', filters.term_id);
  }

  const queryString = params.toString();
  const url = queryString
    ? `admin/term-students?${queryString}`
    : 'admin/term-students';

  const response = await apiClient.get<{ data: TermStudent[] }>(url);

  if (!response) {
    throw new Error('خطایی در دریافت ترم دانش‌پژوها رخ داده است');
  }

  return response;
};

export const createTermStudent = async (data: {
  user_id: string;
  term_id: string;
  term_teacher_id: string;
}) => {
  const formData = new FormData();
  formData.append('user_id', data.user_id);
  formData.append('term_id', data.term_id);
  formData.append('term_teacher_id', data.term_teacher_id);

  const response = await apiClient.post<{ data: TermStudent }>(
    'admin/term-students',
    formData
  );

  if (!response) {
    throw new Error('خطایی در ایجاد دانش پژوه ترم رخ داده است');
  }

  return response;
};
