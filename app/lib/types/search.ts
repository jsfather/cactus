import { Blog } from './blog';
import { PublicProduct } from '@/app/lib/services/public-product.service';

export interface SearchParams {
  search?: string;
  tags?: string;
  page?: number;
}

export interface SearchBlogsResponse {
  data: Blog[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface SearchProductsResponse {
  data: PublicProduct[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface CombinedSearchResults {
  blogs: Blog[];
  products: PublicProduct[];
  blogsLoading: boolean;
  productsLoading: boolean;
}
