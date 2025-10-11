import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetProductListResponse,
  GetProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
  CreateProductFormData,
  UpdateProductFormData,
  GetProductCategoryListResponse,
  GetProductCategoryResponse,
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
} from '@/app/lib/types';

export class ProductService {
  // Helper method to create FormData for file uploads
  private createFormData(
    data: CreateProductFormData | UpdateProductFormData
  ): FormData {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('category_id', data.category_id.toString());
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());

    // Handle image - can be File or string (for updates)
    if (data.image instanceof File) {
      formData.append('image', data.image);
    } else if (typeof data.image === 'string' && data.image) {
      formData.append('image', data.image);
    }

    // Handle attributes
    if (data.attributes && data.attributes.length > 0) {
      data.attributes.forEach((attr, index) => {
        formData.append(`attributes[${index}][key]`, attr.key);
        formData.append(`attributes[${index}][value]`, attr.value);
      });
    }

    return formData;
  }

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

  async create(payload: CreateProductFormData): Promise<GetProductResponse> {
    const formData = this.createFormData(payload);
    return apiClient.post<GetProductResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.CREATE,
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
    payload: UpdateProductFormData
  ): Promise<GetProductResponse> {
    const formData = this.createFormData(payload);
    return apiClient.put<GetProductResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.UPDATE(id),
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

  async createCategory(
    payload: CreateProductCategoryRequest
  ): Promise<GetProductCategoryResponse> {
    return apiClient.post<GetProductCategoryResponse>(
      API_ENDPOINTS.PANEL.ADMIN.PRODUCT_CATEGORIES.CREATE,
      payload
    );
  }

  async updateCategory(
    id: string,
    payload: UpdateProductCategoryRequest
  ): Promise<GetProductCategoryResponse> {
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
