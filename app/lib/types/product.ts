export interface ProductAttribute {
  key: string;
  value: string;
}

export interface Product {
  id: number | string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  attributes: Record<string, string>;
  category: ProductCategory | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategory {
  id: number | string;
  name: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductRequest {
  title: string;
  category_id: number;
  description: string;
  price: number;
  stock: number;
  image?: string;
  attributes?: ProductAttribute[];
}

export interface UpdateProductRequest {
  title: string;
  category_id: number;
  description: string;
  price: number;
  stock: number;
  image?: string;
  attributes?: ProductAttribute[];
}

export interface GetProductListResponse {
  data: Product[];
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

export interface GetProductResponse {
  data: Product;
}

// Product Category types
export interface GetProductCategoryListResponse {
  data: ProductCategory[];
}

export interface GetProductCategoryResponse {
  data: ProductCategory;
}

export interface CreateProductCategoryRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateProductCategoryRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}
