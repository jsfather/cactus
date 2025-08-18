export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  category?: ProductCategory;
  images: string[];
  specifications: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: number | string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface GetProductListResponse {
  data: Product[];
}

export interface GetProductResponse {
  data: Product;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  images?: string[];
  specifications?: Record<string, any>;
  is_active?: boolean;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  images?: string[];
  specifications?: Record<string, any>;
  is_active?: boolean;
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
