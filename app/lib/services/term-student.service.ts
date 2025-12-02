import {
  getTermStudents,
  createTermStudent,
} from '@/app/lib/api/admin/term-students';
import { TermStudent } from '@/app/lib/types/term_student';

export class TermStudentService {
  async getTermStudents(filters?: {
    student_id?: string;
    term_id?: string;
  }): Promise<TermStudent[]> {
    try {
      const response = await getTermStudents(filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching term students:', error);
      throw error;
    }
  }

  async createTermStudent(data: {
    user_id: string;
    term_id: string;
    term_teacher_id: string;
  }): Promise<any> {
    try {
      const response = await createTermStudent(data);
      return response; // Return full response instead of just data
    } catch (error) {
      console.error('Error creating term student:', error);
      throw error;
    }
  }

  async getStudentActiveTerms(studentId: string): Promise<TermStudent[]> {
    try {
      return await this.getTermStudents({ student_id: studentId });
    } catch (error) {
      console.error('Error fetching student active terms:', error);
      throw error;
    }
  }

  async deleteStudentFromTerm(data: {
    term_id: number;
    user_id: number;
  }): Promise<{ message: string }> {
    try {
      const { apiClient } = await import('@/app/lib/api/client');
      const { API_ENDPOINTS } = await import('@/app/lib/api/endpoints');
      const response = await apiClient.post<{ message: string }>(
        API_ENDPOINTS.PANEL.ADMIN.TERM_STUDENTS.DELETE_STUDENT,
        data
      );
      return response;
    } catch (error) {
      console.error('Error deleting student from term:', error);
      throw error;
    }
  }
}

export const termStudentService = new TermStudentService();
