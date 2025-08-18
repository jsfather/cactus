import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import { Student } from '@/app/lib/types';

// First, let me add the student endpoints to the endpoints file
export interface StudentRequest {
  user_id?: number | string;
  level_id?: number | string | null;
  father_name?: string | null;
  mother_name?: string | null;
  father_job?: string | null;
  mother_job?: string | null;
  has_allergy?: number;
  allergy_details?: string | null;
  interest_level?: number | null;
  focus_level?: number | null;
  birth_date?: string | null;
}

export interface GetStudentListResponse {
  data: Student[];
}

export interface GetStudentResponse {
  data: Student;
}

export class StudentService {
  async getList(): Promise<GetStudentListResponse> {
    return apiClient.get<GetStudentListResponse>('/admin/students');
  }

  async getById(id: string): Promise<GetStudentResponse> {
    return apiClient.get<GetStudentResponse>(`/admin/students/${id}`);
  }

  async create(payload: StudentRequest | FormData): Promise<GetStudentResponse> {
    return apiClient.post<GetStudentResponse>('/admin/students', payload);
  }

  async update(id: string, payload: StudentRequest | FormData): Promise<GetStudentResponse> {
    return apiClient.put<GetStudentResponse>(`/admin/students/${id}`, payload);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/admin/students/${id}`);
  }

  async getExamPlacement(id: string): Promise<GetStudentResponse> {
    return apiClient.get<GetStudentResponse>(`/admin/students/placement-exam/${id}`);
  }
}

export const studentService = new StudentService();