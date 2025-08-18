export interface Blog {
  id: number | string;
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
  slug: string;
  created_at: string;
}

export interface GetBlogListResponse {
  data: Blog[];
}

export interface GetBlogResponse {
  data: Blog;
}

export interface BlogRequest {
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
  slug: string;
}
