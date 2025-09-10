import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';

export interface ProductCategory {
  id: number | string;
  name: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategoryFormData {
  name: string;
  type: string;
}

export const getProductCategories = async () => {
  const response = await apiClient.get<{ data: ProductCategory[] }>(
    API_ENDPOINTS.PANEL.ADMIN.PRODUCT_CATEGORIES.GET_ALL
  );

  if (!response) {
    throw new Error('خطایی در دریافت لیست دسته‌بندی محصولات رخ داده است');
  }

  return response;
};

export const getProductCategory = async (id: number | string) => {
  const response = await apiClient.get<{ data: ProductCategory }>(
    API_ENDPOINTS.PANEL.ADMIN.PRODUCT_CATEGORIES.GET_BY_ID(String(id))
  );

  if (!response) {
    throw new Error('خطایی در دریافت دسته‌بندی محصول رخ داده است');
  }

  return response;
};

export const createProductCategory = async (data: ProductCategoryFormData) => {
  const response = await apiClient.post<{ data: ProductCategory }>(
    API_ENDPOINTS.PANEL.ADMIN.PRODUCT_CATEGORIES.CREATE,
    data
  );

  if (!response) {
    throw new Error('خطایی در ساخت دسته‌بندی محصول رخ داده است');
  }

  return response;
};

export const updateProductCategory = async (
  id: number | string,
  data: ProductCategoryFormData
) => {
  const response = await apiClient.put<{ data: ProductCategory }>(
    API_ENDPOINTS.PANEL.ADMIN.PRODUCT_CATEGORIES.UPDATE(String(id)),
    data
  );

  if (!response) {
    throw new Error('خطایی در بروزرسانی دسته‌بندی محصول رخ داده است');
  }

  return response;
};

export const deleteProductCategory = async (id: number | string) => {
  const response = await apiClient.delete<{ data: ProductCategory }>(
    API_ENDPOINTS.PANEL.ADMIN.PRODUCT_CATEGORIES.DELETE(String(id))
  );

  if (!response) {
    throw new Error('خطایی در حذف دسته‌بندی محصول رخ داده است');
  }

  return response;
};
