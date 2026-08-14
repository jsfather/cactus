import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  Order,
  GetOrderListResponse,
  GetOrderResponse,
  UpdateOrderStatusRequest,
} from '@/app/lib/types';

const normalizeOrder = (order: Order): Order => ({
  ...order,
  total_amount: order.total_amount ?? order.total_price ?? 0,
  total_price: order.total_price ?? order.total_amount ?? 0,
  payment_status: order.payment_status || 'pending',
  address: order.address || order.shipping_address || '',
  shipping_address: order.shipping_address || order.address || '',
  user: {
    ...order.user,
    name:
      order.user.name ||
      `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim(),
  },
});

export class OrderService {
  async getList(): Promise<GetOrderListResponse> {
    const response = await apiClient.get<GetOrderListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.ORDERS.GET_ALL
    );
    return { ...response, data: response.data.map(normalizeOrder) };
  }

  async getById(id: string): Promise<GetOrderResponse> {
    const response = await apiClient.get<GetOrderResponse>(
      API_ENDPOINTS.PANEL.ADMIN.ORDERS.GET_BY_ID(id)
    );
    return { ...response, data: normalizeOrder(response.data) };
  }

  async updateStatus(
    id: string,
    payload: UpdateOrderStatusRequest
  ): Promise<void> {
    return apiClient.post<void>(
      API_ENDPOINTS.PANEL.ADMIN.ORDERS.UPDATE_STATUS(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.PANEL.ADMIN.ORDERS.DELETE(id));
  }
}

export const orderService = new OrderService();
