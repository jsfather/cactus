import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductListResponse,
  GetProductResponse,
} from '@/app/lib/types/product';

export const getProducts = async () => {
  const response = await apiClient.get<GetProductListResponse>(
    API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.GET_ALL
  );

  if (!response) {
    throw new Error('خطایی در دریافت لیست محصولات رخ داده است');
  }

  return response;
};

export const getProduct = async (id: number | string) => {
  const response = await apiClient.get<GetProductResponse>(
    API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.GET_BY_ID(String(id))
  );

  if (!response) {
    throw new Error('خطایی در دریافت محصول رخ داده است');
  }

  return response;
};

export const createProduct = async (data: CreateProductRequest) => {
  const response = await apiClient.post<GetProductResponse>(
    API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.CREATE,
    data
  );

  if (!response) {
    throw new Error('خطایی در ساخت محصول رخ داده است');
  }

  return response;
};

export const updateProduct = async (
  id: number | string,
  data: UpdateProductRequest
) => {
  const response = await apiClient.put<GetProductResponse>(
    API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.UPDATE(String(id)),
    data
  );

  if (!response) {
    throw new Error('خطایی در بروزرسانی محصول رخ داده است');
  }

  return response;
};

export const deleteProduct = async (id: number | string) => {
  const response = await apiClient.delete<{ data: Product }>(
    API_ENDPOINTS.PANEL.ADMIN.PRODUCTS.DELETE(String(id))
  );

  if (!response) {
    throw new Error('خطایی در حذف محصول رخ داده است');
  }

  return response;
};
