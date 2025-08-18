import { User, Product } from './';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: number | string;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number | string;
  user_id: number;
  user: User;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address: string;
  billing_address: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GetOrderListResponse {
  data: Order[];
}

export interface GetOrderResponse {
  data: Order;
}

export interface CreateOrderRequest {
  user_id: number;
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
  shipping_address: string;
  billing_address: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
}
