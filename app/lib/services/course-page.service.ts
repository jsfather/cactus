import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetCoursePageListResponse,
  GetCoursePageResponse,
  CreateCoursePageRequest,
  UpdateCoursePageRequest,
} from '@/app/lib/types/course';
import { normalizeAdminCourse } from '@/app/lib/utils/course';

const normalizeList = (data: unknown) =>
  Array.isArray(data) ? data.map(normalizeAdminCourse) : [];

export class CoursePageService {
  async getList(): Promise<GetCoursePageListResponse> {
    const response = await apiClient.get<GetCoursePageListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.COURSES.GET_ALL
    );
    return { ...response, data: normalizeList(response.data) };
  }

  async getById(id: string): Promise<GetCoursePageResponse> {
    const response = await apiClient.get<GetCoursePageResponse>(
      API_ENDPOINTS.PANEL.ADMIN.COURSES.GET_BY_ID(id)
    );
    return { ...response, data: normalizeAdminCourse(response.data) };
  }

  async create(
    payload: CreateCoursePageRequest
  ): Promise<GetCoursePageResponse> {
    const response = await apiClient.post<GetCoursePageResponse>(
      API_ENDPOINTS.PANEL.ADMIN.COURSES.CREATE,
      payload
    );
    return { ...response, data: normalizeAdminCourse(response.data) };
  }

  async update(
    id: string,
    payload: UpdateCoursePageRequest
  ): Promise<GetCoursePageResponse> {
    await apiClient.put<GetCoursePageResponse>(
      API_ENDPOINTS.PANEL.ADMIN.COURSES.UPDATE(id),
      payload
    );
    return this.getById(id);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PANEL.ADMIN.COURSES.DELETE(id));
  }
}

export const coursePageService = new CoursePageService();
