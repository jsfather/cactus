import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetOrderListResponse,
  GetOrderResponse,
  UpdateOrderStatusRequest,
} from '@/app/lib/types';

export class OrderService {
  async getList(): Promise<GetOrderListResponse> {
    return apiClient.get<GetOrderListResponse>(
      API_ENDPOINTS.PANEL.ADMIN.ORDERS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetOrderResponse> {
    return apiClient.get<GetOrderResponse>(
      API_ENDPOINTS.PANEL.ADMIN.ORDERS.GET_BY_ID(id)
    );
  }

  async updateStatus(id: string, payload: UpdateOrderStatusRequest): Promise<void> {
    return apiClient.put<void>(
      API_ENDPOINTS.PANEL.ADMIN.ORDERS.UPDATE_STATUS(id),
      payload
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_ENDPOINTS.PANEL.ADMIN.ORDERS.DELETE(id)
    );
  }
}

export const orderService = new OrderService();
