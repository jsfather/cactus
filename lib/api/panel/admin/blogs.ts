import request from '../../httpClient';

export interface Blog {
  id: number;
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  updated_at: string;
  created_at: string;
}

export const getBlogs = () => request<Blog[]>('admin/blogs');

export const getBlog = (id: number) => request<Blog>(`admin/blogs/${id}`);

export const createBlog = (data: Partial<Blog>) =>
  request<Blog>('admin/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateBlog = (id: number, data: Partial<Blog>) =>
  request<Blog>(`admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteBlog = (id: number) =>
  request<void>(`admin/blogs/${id}`, {
    method: 'DELETE',
  });
