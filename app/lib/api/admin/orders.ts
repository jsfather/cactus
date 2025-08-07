import request from '@/app/lib/api/client';

export interface OrderItem {
  id: number | string;
  product_id: number | string;
  quantity: number;
  price: number;
  product?: {
    id: number | string;
    title: string;
    image: string;
  };
}

export interface Order {
  id: number | string;
  user_id: number | string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  total_amount: number;
  shipping_address: string;
  phone: string;
  notes?: string;
  items: OrderItem[];
  user?: {
    id: number | string;
    name: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
}

export const getOrders = async () => {
  const response = await request<{ data: Order[] }>('admin/orders');

  if (!response) {
    throw new Error('خطایی در دریافت لیست سفارش‌ها رخ داده است');
  }

  return response;
};

export const getOrder = async (id: number | string) => {
  const response = await request<{ data: Order }>(`admin/orders/${id}`);

  if (!response) {
    throw new Error('خطایی در دریافت سفارش رخ داده است');
  }

  return response;
};

export const updateOrderStatus = async (id: number | string, status: string) => {
  const formData = new FormData();
  formData.append('status', status);

  const response = await request<{ data: Order }>(`admin/orders/update-status/${id}`, {
    method: 'POST',
    body: formData,
  });

  if (!response) {
    throw new Error('خطایی در بروزرسانی وضعیت سفارش رخ داده است');
  }

  return response;
};

export const deleteOrder = async (id: number | string) => {
  const response = await request<{ data: Order }>(`admin/orders/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف سفارش رخ داده است');
  }

  return response;
};
