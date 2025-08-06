'use client';

import { ApiService } from '@/app/lib/api/client';
import { Blog } from '@/app/lib/types';

export const blogService = {
  getBlogs: async (): Promise<Blog[]> => {
    return await ApiService.get<Blog[]>('admin/blogs');
  },

  getBlog: async (id: number | string): Promise<Blog> => {
    return await ApiService.get<Blog>(`admin/blogs/${id}`);
  },

  createBlog: async (data: Partial<Blog>): Promise<Blog> => {
    return await ApiService.post<Blog>('admin/blogs', data);
  },

  updateBlog: async (
    id: number | string,
    data: Partial<Blog>
  ): Promise<Blog> => {
    return await ApiService.put<Blog>(`admin/blogs/${id}`, data);
  },

  deleteBlog: async (id: number | string): Promise<Blog> => {
    return await ApiService.delete<Blog>(`admin/blogs/${id}`);
  },
};
