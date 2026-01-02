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
    // Send as JSON (files will be handled separately later)
    const jsonPayload = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      username: payload.username,
      phone: payload.phone,
      email: payload.email || undefined,
      national_code: payload.national_code || undefined,
      level_id: payload.level_id,
      father_name: payload.father_name,
      mother_name: payload.mother_name,
      father_job: payload.father_job,
      mother_job: payload.mother_job,
      has_allergy: payload.has_allergy,
      allergy_details: payload.allergy_details || undefined,
      interest_level: payload.interest_level,
      focus_level: payload.focus_level,
      birth_date: payload.birth_date,
      // TODO: Handle file uploads separately
      // profile_picture: payload.profile_picture,
      // national_card: payload.national_card,
      // certificate: payload.certificate,
    };

    return apiClient.post<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.CREATE,
      jsonPayload
    );
  }

  async update(
    id: string,
    payload: UpdateStudentRequest
  ): Promise<GetStudentResponse> {
    // Send as JSON (files will be handled separately later)
    const jsonPayload: Record<string, any> = {};

    // Add text fields only if they exist
    if (payload.first_name) jsonPayload.first_name = payload.first_name;
    if (payload.last_name) jsonPayload.last_name = payload.last_name;
    if (payload.username) jsonPayload.username = payload.username;
    if (payload.phone) jsonPayload.phone = payload.phone;
    if (payload.email) jsonPayload.email = payload.email;
    if (payload.national_code)
      jsonPayload.national_code = payload.national_code;
    if (payload.level_id) jsonPayload.level_id = payload.level_id;
    if (payload.father_name) jsonPayload.father_name = payload.father_name;
    if (payload.mother_name) jsonPayload.mother_name = payload.mother_name;
    if (payload.father_job) jsonPayload.father_job = payload.father_job;
    if (payload.mother_job) jsonPayload.mother_job = payload.mother_job;
    if (payload.has_allergy !== undefined)
      jsonPayload.has_allergy = payload.has_allergy;
    if (payload.allergy_details)
      jsonPayload.allergy_details = payload.allergy_details;
    if (payload.interest_level)
      jsonPayload.interest_level = payload.interest_level;
    if (payload.focus_level) jsonPayload.focus_level = payload.focus_level;
    if (payload.birth_date) jsonPayload.birth_date = payload.birth_date;

    // TODO: Handle file uploads separately
    // if (payload.profile_picture) jsonPayload.profile_picture = payload.profile_picture;
    // if (payload.national_card) jsonPayload.national_card = payload.national_card;
    // if (payload.certificate) jsonPayload.certificate = payload.certificate;

    return apiClient.put<GetStudentResponse>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.UPDATE(id),
      jsonPayload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.STUDENTS.DELETE(id)
    );
  }
}

export const studentService = new StudentService();
