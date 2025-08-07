import request from '@/app/lib/api/client';
import { TermStudent } from '@/app/lib/types';

export const createTermStudent = async (data: {
  user_id: string;
  term_id: string;
  term_teacher_id: string;
}) => {
  const formData = new FormData();
  formData.append('user_id', data.user_id);
  formData.append('term_id', data.term_id);
  formData.append('term_teacher_id', data.term_teacher_id);

  const response = await request<{ data: TermStudent }>('admin/term-students', {
    method: 'POST',
    body: formData,
  });

  if (!response) {
    throw new Error('خطایی در ایجاد دانش پژوه ترم رخ داده است');
  }

  return response;
};
