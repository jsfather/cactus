import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetStudentListResponse,
  GetStudentResponse,
  CreateStudentRequest,
  UpdateStudentRequest,
} from '@/app/lib/types';

export interface StudentSearchFilters {
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  national_code?: string;
  search?: string; // General search term - will search by last_name
}

export class StudentService {
  private toFormData(payload: CreateStudentRequest | UpdateStudentRequest) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;

      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      formData.append(key, String(value));
    });

    return formData;
  }

  async getList(
    page: number = 1,
    perPage: number = 15,
    filters?: StudentSearchFilters
  ): Promise<GetStudentListResponse> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('per_page', perPage.toString());

    // Add search filters if provided
    if (filters) {
      // If general search is provided, use it as last_name filter
      if (filters.search) params.set('last_name', filters.search);
      if (filters.first_name) params.set('first_name', filters.first_name);
      if (filters.last_name) params.set('last_name', filters.last_name);
      if (filters.username) params.set('username', filters.username);
      if (filters.phone) params.set('phone', filters.phone);
      if (filters.national_code)
        params.set('national_code', filters.national_code);
    }

    return apiClient.get<GetStudentListResponse>(
      `${API_ENDPOINTS.PANEL.ADMIN.STUDENTS.GET_ALL}?${params.toString()}`
    );
  }

  async getById(id: string): Promise<GetStudentResponse> {
    return apiClient.get<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.GET_BY_ID(id)
    );
  }

  async create(payload: CreateStudentRequest): Promise<GetStudentResponse> {
    return apiClient.post<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.CREATE,
      this.toFormData(payload)
    );
  }

  async update(
    id: string,
    payload: UpdateStudentRequest
  ): Promise<GetStudentResponse> {
    const hasFiles = Object.values(payload).some(
      (value) => value instanceof File
    );

    if (hasFiles) {
      const formData = this.toFormData(payload);
      formData.append('_method', 'PATCH');
      return apiClient.post<GetStudentResponse>(
        API_ENDPOINTS.PANEL.ADMIN.STUDENTS.UPDATE(id),
        formData
      );
    }

    return apiClient.patch<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.UPDATE(id),
      payload
    );
  }

  async toggleTerm(
    studentId: string,
    termId: string
  ): Promise<GetStudentResponse> {
    return apiClient.post<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.TOGGLE_TERM,
      { student_id: studentId, term_id: termId }
    );
  }

  async getPlacementExam(id: string): Promise<unknown> {
    return apiClient.get(API_ENDPOINTS.PANEL.ADMIN.STUDENTS.PLACEMENT_EXAM(id));
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.DELETE(id)
    );
  }
}

export const studentService = new StudentService();
