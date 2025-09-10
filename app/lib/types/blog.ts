export interface Blog {
  id: number | string;
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
  slug: string;
  user_id: number;
  publish_at: string;
  created_at: string;
  updated_at: string;
}

export interface GetBlogListResponse {
  data: Blog[];
}

export interface GetBlogResponse {
  data: Blog;
}

export interface CreateBlogRequest {
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
  slug: string;
  user_id: number;
  publish_at: string;
}

export interface UpdateBlogRequest {
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
  slug: string;
  user_id: number;
  publish_at: string;
}

// Legacy interface for backward compatibility
export interface BlogRequest extends CreateBlogRequest {}
