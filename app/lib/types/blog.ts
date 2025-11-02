export interface BlogUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  email: string | null;
  address: string | null;
  postal_code: string | null;
  national_code: string;
  profile_picture: string;
  files: any[];
}

export interface BlogComment {
  id: number;
  content: string;
  user: BlogUser;
  created_at: string;
}

export interface Blog {
  id: number | string;
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
  slug: string;
  user_id?: number;
  user?: BlogUser;
  publish_at: string;
  created_at: string;
  updated_at?: string;
  comments?: BlogComment[];
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
