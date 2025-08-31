export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  email: string | null;
  address: string | null;
  postal_code: string | null;
  national_code: string | null;
  profile_picture: string | null;
  files: {
    type: string;
    file_path: string;
  }[];
}

export interface Comment {
  // Define comment structure based on your needs
}

export interface Blog {
  id: number;
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  tags: string[] | null;
  created_at: string;
  publish_at: string | null;
  user: User | null;
  comments: Comment[];
}

export interface BlogListResponse {
  data: Blog[];
}

export interface BlogResponse {
  data: Blog;
}

export interface CreateBlogRequest {
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  tags: string[];
  user_id: number;
  publish_at: string;
}

export interface UpdateBlogRequest {
  title?: string;
  little_description?: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  tags?: string[];
  user_id?: number;
  publish_at?: string;
}
