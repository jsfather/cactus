import { apiClient } from '@/app/lib/api/client';
import { Teacher } from '@/app/lib/types';

export interface TeacherRequest {
  user_id?: number | string;
  bio?: string;
  level_id?: number | string;
  father_name?: string;
  mother_name?: string;
  father_job?: string;
  mother_job?: string;
  has_allergy?: number | string;
  allergy_details?: string;
  interest_level?: number | string;
  focus_level?: number | string;
  birth_date?: string;
  national_card?: string;
  certificate?: string;
}

export interface GetTeacherListResponse {
  data: Teacher[];
}

export interface GetTeacherResponse {
  data: Teacher;
}

export class TeacherService {
  async getList(): Promise<GetTeacherListResponse> {
    return apiClient.get<GetTeacherListResponse>('/admin/teachers');
  }

  async getById(id: string): Promise<GetTeacherResponse> {
    return apiClient.get<GetTeacherResponse>(`/admin/teachers/${id}`);
  }

  async create(payload: TeacherRequest | FormData): Promise<GetTeacherResponse> {
    return apiClient.post<GetTeacherResponse>('/admin/teachers', payload);
  }

  async update(id: string, payload: TeacherRequest | FormData): Promise<GetTeacherResponse> {
    return apiClient.put<GetTeacherResponse>(`/admin/teachers/${id}`, payload);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/admin/teachers/${id}`);
  }
}

export const teacherService = new TeacherService();