import {
  publicApiClient,
  apiClient,
  type ApiError,
} from '@/app/lib/api/client';
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

export interface ProductSearchParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export class PublicProductService {
  private normalizeProduct(product: PublicProduct): PublicProduct {
    return {
      ...product,
      comments: (product.comments ?? []).map((comment) => ({
        ...comment,
        content: comment.content || comment.comment || '',
        approved:
          typeof comment.approved === 'boolean'
            ? comment.approved
            : Boolean(comment.is_approved),
      })),
    };
  }

  async getHomeProducts(
    params?: ProductSearchParams
  ): Promise<GetPublicProductsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page)
      queryParams.append('per_page', params.per_page.toString());

    const queryString = queryParams.toString();
    const url = `${API_ENDPOINTS.PUBLIC.SHOP.HOME_PRODUCTS}${queryString ? `?${queryString}` : ''}`;

    return publicApiClient.get<GetPublicProductsResponse>(url);
  }

  async getProducts(
    params?: ProductSearchParams
  ): Promise<GetPublicProductsResponse> {
    return this.getHomeProducts(params);
  }

  async getById(id: string): Promise<GetPublicProductResponse> {
    try {
      const response = await publicApiClient.get<GetPublicProductResponse>(
        API_ENDPOINTS.PUBLIC.SHOP.PRODUCT_BY_ID(id),
        { suppressErrorStatuses: [404] }
      );
      return { data: this.normalizeProduct(response.data) };
    } catch (error) {
      if ((error as ApiError).status !== 404) throw error;

      // The deployed backend exposes the full public product payload only in
      // /home/products. Resolve the requested real record from that list until
      // a dedicated GET /products/{id} route is added server-side.
      let page = 1;
      let lastPage = 1;

      do {
        const response = await this.getHomeProducts({ page, per_page: 100 });
        const product = response.data.find((item) => item.id.toString() === id);
        if (product) return { data: this.normalizeProduct(product) };

        lastPage = response.meta?.last_page ?? 1;
        page += 1;
      } while (page <= lastPage);

      throw {
        status: 404,
        message: 'محصول مورد نظر یافت نشد',
      } satisfies ApiError;
    }
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
