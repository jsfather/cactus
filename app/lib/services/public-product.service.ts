import { publicApiClient } from "@/app/lib/api/client";
import { API_ENDPOINTS } from "@/app/lib/api/endpoints";

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
    name: string;
    type: string;
  };
  discount_price?: number | null;
  rating?: number;
  reviews_count?: number;
}

export interface GetPublicProductsResponse {
  data: PublicProduct[];
  links: {
    first: string;
    last: string;
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

export class PublicProductService {
  async getHomeProducts(): Promise<GetPublicProductsResponse> {
    return publicApiClient.get<GetPublicProductsResponse>(
      API_ENDPOINTS.PUBLIC.SHOP.HOME_PRODUCTS
    );
  }

  async getProducts(): Promise<GetPublicProductsResponse> {
    return publicApiClient.get<GetPublicProductsResponse>(
      API_ENDPOINTS.PUBLIC.SHOP.HOME_PRODUCTS
    );
  }
}

export const publicProductService = new PublicProductService();
