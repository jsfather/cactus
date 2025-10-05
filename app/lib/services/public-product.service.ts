import { publicApiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';

export interface PublicProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  attributes?: Record<string, string>;
  category?: {
    id: number;
    title: string;
  };
  discount_price?: number | null;
  rating?: number;
  reviews_count?: number;
}

export interface GetPublicProductsResponse {
  data: PublicProduct[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export class PublicProductService {
  async getHomeProducts(): Promise<GetPublicProductsResponse> {
    return publicApiClient.get<GetPublicProductsResponse>(
      API_ENDPOINTS.PUBLIC.SHOP.HOME_PRODUCTS
    );
  }
}

export const publicProductService = new PublicProductService();
