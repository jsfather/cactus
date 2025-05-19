import request from '../../httpClient';
import { redirect } from 'next/navigation';

export interface Blog {
  id: string;
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
}

export const getBlogs = () => request<Blog[]>('admin/blogs');

export const getBlog = (id: string) => request<Blog>(`admin/blogs/${id}`);

export const createBlog = (data: Partial<Blog>) =>
  request<Blog>('admin/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(() => {
      redirect('/admin/blogs');
    })
    .catch((error) => {
      console.error('Failed to save blog:', error);
    });

export const updateBlog = (id: string, data: Partial<Blog>) =>
  request<Blog>(`admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteBlog = (id: string) =>
  request<void>(`admin/blogs/${id}`, {
    method: 'DELETE',
  });
