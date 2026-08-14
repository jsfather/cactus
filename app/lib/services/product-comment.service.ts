import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  AdminProductComment,
  GetAdminProductCommentsResponse,
} from '@/app/lib/types/product';

export class ProductCommentService {
  async getAll(): Promise<GetAdminProductCommentsResponse> {
    const response = await apiClient.get<GetAdminProductCommentsResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.GET_ALL
    );
    return {
      ...response,
      data: response.data.map((comment) => ({
        ...comment,
        content: comment.content || comment.comment || '',
        approved:
          typeof comment.approved === 'boolean'
            ? comment.approved
            : Boolean(comment.is_approved),
      })),
    };
  }

  async getById(id: string): Promise<{ data: AdminProductComment }> {
    return apiClient.get<{ data: AdminProductComment }>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.GET_BY_ID(id)
    );
  }

  async setApproval(
    id: string,
    isApproved: boolean
  ): Promise<{ message: string; data?: AdminProductComment }> {
    return apiClient.post<{ message: string; data?: AdminProductComment }>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.UPDATE(id),
      { is_approved: isApproved ? 1 : 0 }
    );
  }

  async approve(id: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.APPROVE(id),
      {}
    );
  }

  async reject(id: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.REJECT(id),
      {}
    );
  }

  async answer(id: string, answer: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.ANSWER(id),
      { answer }
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.DELETE_GENERIC(id)
    );
  }
}

export const productCommentService = new ProductCommentService();
