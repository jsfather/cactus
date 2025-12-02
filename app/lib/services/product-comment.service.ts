import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  AdminProductComment,
  GetAdminProductCommentsResponse,
} from '@/app/lib/types/product';

export class ProductCommentService {
  async getAll(): Promise<GetAdminProductCommentsResponse> {
    return apiClient.get<GetAdminProductCommentsResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.GET_ALL
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

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.DELETE(id)
    );
  }
}

export const productCommentService = new ProductCommentService();
