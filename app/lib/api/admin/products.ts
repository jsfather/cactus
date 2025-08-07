import request from '@/app/lib/api/client';

export interface Product {
  id: number | string;
  title: string;
  category_id: number | string;
  description: string;
  price: number;
  stock: number;
  image: string;
  attributes: { key: string; value: string }[];
  category?: {
    id: number | string;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormData {
  title: string;
  category_id: number | string;
  description: string;
  price: number;
  stock: number;
  image: string;
  attributes: { key: string; value: string }[];
}

export const getProducts = async () => {
  const response = await request<{ data: Product[] }>('admin/products');

  if (!response) {
    throw new Error('خطایی در دریافت لیست محصولات رخ داده است');
  }

  return response;
};

export const getProduct = async (id: number | string) => {
  const response = await request<{ data: Product }>(`admin/products/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت محصول رخ داده است');
  }

  return response;
};

export const createProduct = async (data: ProductFormData) => {
  const response = await request<{ data: Product }>('admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ساخت محصول رخ داده است');
  }

  return response;
};

export const updateProduct = async (id: number | string, data: ProductFormData) => {
  const response = await request<{ data: Product }>(`admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی محصول رخ داده است');
  }

  return response;
};

export const deleteProduct = async (id: number | string) => {
  const response = await request<{ data: Product }>(`admin/products/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف محصول رخ داده است');
  }

  return response;
};
