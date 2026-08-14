import { apiClient, type ApiError } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  AdminProductComment,
  GetAdminProductCommentsResponse,
  Product,
} from '@/app/lib/types/product';

export class ProductCommentService {
  async getAll(): Promise<GetAdminProductCommentsResponse> {
    let comments: AdminProductComment[];

    try {
      const response = await apiClient.get<GetAdminProductCommentsResponse>(
        API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.GET_ALL,
        { suppressErrorStatuses: [404] }
      );
      comments = response.data;
    } catch (error) {
      if ((error as ApiError).status !== 404) throw error;

      // The supplied collection documents /admin/comments, but the deployed
      // API currently returns 404 for it. Product responses include comments,
      // so keep moderation usable until the backend restores the list route.
      const response = await apiClient.get<{ data: Product[] }>(
        API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.GET_ALL
      );
      comments = response.data.flatMap((product) =>
        (product.comments ?? []).map((comment) => ({
          ...comment,
          product_id: Number(comment.product_id ?? product.id),
          product: comment.product ?? {
            id: Number(product.id),
            title: product.title,
          },
        }))
      );
    }

    return {
      data: comments.map((comment) => ({
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

  async updateApproval(
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
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.DELETE(id)
    );
  }

  async deleteGeneric(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_COMMENTS.DELETE_GENERIC(id)
    );
  }
}

export const productCommentService = new ProductCommentService();
