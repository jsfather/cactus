import { publicApiClient, apiClient } from '@/app/lib/api/client';
import { API_ENDPOINTS } from '@/app/lib/api/endpoints';
import {
  ProductComment,
  ProductCommentRequest,
  ProductCommentResponse,
} from '@/app/lib/types/product';

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
  comments?: ProductComment[];
}

export interface GetPublicProductResponse {
  data: PublicProduct;
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

  async getById(id: string): Promise<GetPublicProductResponse> {
    return publicApiClient.get<GetPublicProductResponse>(
      API_ENDPOINTS.PUBLIC.SHOP.PRODUCT_BY_ID(id)
    );
  }

  // Comment methods (require authentication)
  async addComment(
    productId: string,
    payload: ProductCommentRequest
  ): Promise<ProductCommentResponse> {
    return apiClient.post<ProductCommentResponse>(
      API_ENDPOINTS.PUBLIC.SHOP.PRODUCT_COMMENTS(productId),
      payload
    );
  }
}

export const publicProductService = new PublicProductService();
