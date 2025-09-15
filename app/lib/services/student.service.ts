import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetStudentListResponse,
  GetStudentResponse,
  CreateStudentRequest,
  UpdateStudentRequest,
} from '@/app/lib/types';

export class StudentService {
  async getList(): Promise<GetStudentListResponse> {
    return apiClient.get<GetStudentListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetStudentResponse> {
    return apiClient.get<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.GET_BY_ID(id)
    );
  }

  async create(payload: CreateStudentRequest): Promise<GetStudentResponse> {
    // Convert to FormData for file upload support
    const formData = new FormData();

    // Add text fields
    formData.append('first_name', payload.first_name);
    formData.append('last_name', payload.last_name);
    formData.append('username', payload.username);
    formData.append('phone', payload.phone);
    if (payload.email) formData.append('email', payload.email);
    if (payload.national_code)
      formData.append('national_code', payload.national_code);
    formData.append('level_id', payload.level_id.toString());
    formData.append('father_name', payload.father_name);
    formData.append('mother_name', payload.mother_name);
    formData.append('father_job', payload.father_job);
    formData.append('mother_job', payload.mother_job);
    formData.append('has_allergy', payload.has_allergy.toString());
    if (payload.allergy_details)
      formData.append('allergy_details', payload.allergy_details);
    formData.append('interest_level', payload.interest_level.toString());
    formData.append('focus_level', payload.focus_level.toString());
    formData.append('birth_date', payload.birth_date);

    // Add files
    if (payload.profile_picture)
      formData.append('profile_picture', payload.profile_picture);
    if (payload.national_card)
      formData.append('national_card', payload.national_card);
    if (payload.certificate)
      formData.append('certificate', payload.certificate);

    return apiClient.post<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.CREATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async update(
    id: string,
    payload: UpdateStudentRequest
  ): Promise<GetStudentResponse> {
    // Convert to FormData for file upload support
    const formData = new FormData();

    // Add text fields
    if (payload.first_name) formData.append('first_name', payload.first_name);
    if (payload.last_name) formData.append('last_name', payload.last_name);
    if (payload.username) formData.append('username', payload.username);
    if (payload.phone) formData.append('phone', payload.phone);
    if (payload.email) formData.append('email', payload.email);
    if (payload.national_code)
      formData.append('national_code', payload.national_code);
    if (payload.level_id)
      formData.append('level_id', payload.level_id.toString());
    if (payload.father_name)
      formData.append('father_name', payload.father_name);
    if (payload.mother_name)
      formData.append('mother_name', payload.mother_name);
    if (payload.father_job) formData.append('father_job', payload.father_job);
    if (payload.mother_job) formData.append('mother_job', payload.mother_job);
    if (payload.has_allergy !== undefined)
      formData.append('has_allergy', payload.has_allergy.toString());
    if (payload.allergy_details)
      formData.append('allergy_details', payload.allergy_details);
    if (payload.interest_level)
      formData.append('interest_level', payload.interest_level.toString());
    if (payload.focus_level)
      formData.append('focus_level', payload.focus_level.toString());
    if (payload.birth_date) formData.append('birth_date', payload.birth_date);

    // Add files
    if (payload.profile_picture)
      formData.append('profile_picture', payload.profile_picture);
    if (payload.national_card)
      formData.append('national_card', payload.national_card);
    if (payload.certificate)
      formData.append('certificate', payload.certificate);

    return apiClient.put<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.UPDATE(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.DELETE(id)
    );
  }
}

export const studentService = new StudentService();
