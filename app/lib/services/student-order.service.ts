import { apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  GetOrderListResponse,
  GetOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  ShowOrderWithCodeRequest,
} from '@/app/lib/types/order';

export class StudentOrderService {
  async getList(): Promise<GetOrderListResponse> {
    return apiClient.get<GetOrderListResponse>(
      API_ENDPOINTS.PANEL.STUDENT.ORDERS.GET_ALL
    );
  }

  async getById(id: string): Promise<GetOrderResponse> {
    return apiClient.get<GetOrderResponse>(
      API_ENDPOINTS.PANEL.STUDENT.ORDERS.GET_BY_ID(id)
    );
  }

  async buyOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    return apiClient.post<CreateOrderResponse>(
      API_ENDPOINTS.PANEL.STUDENT.ORDERS.BUY,
      payload
    );
  }

  async showWithCode(
    payload: ShowOrderWithCodeRequest
  ): Promise<GetOrderResponse> {
    return apiClient.post<GetOrderResponse>(
      API_ENDPOINTS.PANEL.STUDENT.ORDERS.SHOW_WITH_CODE,
      payload
    );
  }
}

export const studentOrderService = new StudentOrderService();
