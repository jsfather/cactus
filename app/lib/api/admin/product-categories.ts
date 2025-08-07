import request from '@/app/lib/api/client';

export interface ProductCategory {
  id: number | string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategoryFormData {
  name: string;
  description?: string;
}

export const getProductCategories = async () => {
  const response = await request<{ data: ProductCategory[] }>('admin/product-categories');

  if (!response) {
    throw new Error('خطایی در دریافت لیست دسته‌بندی محصولات رخ داده است');
  }

  return response;
};

export const getProductCategory = async (id: number | string) => {
  const response = await request<{ data: ProductCategory }>(`admin/product-categories/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت دسته‌بندی محصول رخ داده است');
  }

  return response;
};

export const createProductCategory = async (data: ProductCategoryFormData) => {
  const response = await request<{ data: ProductCategory }>('admin/product-categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ساخت دسته‌بندی محصول رخ داده است');
  }

  return response;
};

export const updateProductCategory = async (id: number | string, data: ProductCategoryFormData) => {
  const response = await request<{ data: ProductCategory }>(`admin/product-categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی دسته‌بندی محصول رخ داده است');
  }

  return response;
};

export const deleteProductCategory = async (id: number | string) => {
  const response = await request<{ data: ProductCategory }>(`admin/product-categories/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف دسته‌بندی محصول رخ داده است');
  }

  return response;
};
