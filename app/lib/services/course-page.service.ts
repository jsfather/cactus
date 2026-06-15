import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetCoursePageListResponse,
  GetCoursePageResponse,
  CreateCoursePageRequest,
  UpdateCoursePageRequest,
} from '@/app/lib/types/course';
import {
  MOCK_COURSE_PAGES,
  getMockCoursePageById,
} from '@/app/lib/data/mock-courses';

export class CoursePageService {
  async getList(): Promise<GetCoursePageListResponse> {
    try {
      return await apiClient.get<GetCoursePageListResponse>(
        API_ENDPOINTS.PANEL.ADMIN.COURSE_PAGES.GET_ALL
      );
    } catch {
      return { data: MOCK_COURSE_PAGES };
    }
  }

  async getById(id: string): Promise<GetCoursePageResponse> {
    try {
      return await apiClient.get<GetCoursePageResponse>(
        API_ENDPOINTS.PANEL.ADMIN.COURSE_PAGES.GET_BY_ID(id)
      );
    } catch {
      const page = getMockCoursePageById(id);
      if (!page) throw new Error('Course page not found');
      return { data: page };
    }
  }

  async create(payload: CreateCoursePageRequest): Promise<GetCoursePageResponse> {
    return apiClient.post<GetCoursePageResponse>(
      API_ENDPOINTS.PANEL.ADMIN.COURSE_PAGES.CREATE,
      payload
    );
  }

  async update(
    id: string,
    payload: UpdateCoursePageRequest
  ): Promise<GetCoursePageResponse> {
    return apiClient.put<GetCoursePageResponse>(
      API_ENDPOINTS.PANEL.ADMIN.COURSE_PAGES.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.COURSE_PAGES.DELETE(id)
    );
  }
}

export const coursePageService = new CoursePageService();
