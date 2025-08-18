import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetProductListResponse,
  GetProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductCategoryListResponse,
  GetProductCategoryResponse,
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
} from '@/app/lib/types';

export class ProductService {
  // Product methods
  async getList(): Promise<GetProductListResponse> {
    return apiClient.get<GetProductListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetProductResponse> {
    return apiClient.get<GetProductResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.GET_BY_ID(id)
    );
  }

  async create(payload: CreateProductRequest): Promise<GetProductResponse> {
    return apiClient.post<GetProductResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.CREATE,
      payload
    );
  }

  async update(id: string, payload: UpdateProductRequest): Promise<GetProductResponse> {
    return apiClient.put<GetProductResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.UPDATE(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.DELETE(id)
    );
  }

  // Product Category methods
  async getCategoryList(): Promise<GetProductCategoryListResponse> {
    return apiClient.get<GetProductCategoryListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_CATEGORIES.GET_ALL
    );
  }

  async getCategoryById(id: string): Promise<GetProductCategoryResponse> {
    return apiClient.get<GetProductCategoryResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_CATEGORIES.GET_BY_ID(id)
    );
  }

  async createCategory(payload: CreateProductCategoryRequest): Promise<GetProductCategoryResponse> {
    return apiClient.post<GetProductCategoryResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_CATEGORIES.CREATE,
      payload
    );
  }

  async updateCategory(id: string, payload: UpdateProductCategoryRequest): Promise<GetProductCategoryResponse> {
    return apiClient.put<GetProductCategoryResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_CATEGORIES.UPDATE(id),
      payload
    );
  }

  async deleteCategory(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_CATEGORIES.DELETE(id)
    );
  }
}

export const productService = new ProductService();
