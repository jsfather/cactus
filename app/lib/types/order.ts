import { User, Product } from './';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderUser {
  id: number;
  name: string;
  email: string | null;
  phone: string;
}

export interface OrderProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  attributes: Record<string, string>;
}

export interface OrderItem {
  product: OrderProduct;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  code: string;
  user: OrderUser;
  status: OrderStatus;
  total_price: number;
  address: string;
  postal_code: string;
  created_at: string;
  items: OrderItem[];
}

export interface ApiOrderListResponse {
  data: Order[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface GetOrderListResponse {
  data: Order[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface GetOrderResponse {
  data: Order;
}

export interface CreateOrderRequest {
  products: number[];
  address: string;
  postal_code: string;
}

export interface CreateOrderResponse {
  success: boolean;
  payment_url: string;
  authority: string;
}

export interface ShowOrderWithCodeRequest {
  code: string;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
