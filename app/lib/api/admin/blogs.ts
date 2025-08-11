'use client';

import { ApiService } from '@/app/lib/api/client';
import { Blog } from '@/app/lib/types';

export const blogService = {
  getBlogs: async (): Promise<{data: Blog[] } > => {
    return await ApiService.get<{data: Blog[] }>('admin/blogs');
  },

  getBlog: async (id: number | string): Promise<{data: Blog}> => {
    return await ApiService.get<{data:Blog}>(`admin/blogs/${id}`);
  },

  createBlog: async (data: Partial<Blog>): Promise<{data:Blog}> => {
    return await ApiService.post<{data:Blog}>('admin/blogs', data);
  },

  updateBlog: async (
    id: number | string,
    data: Partial<Blog>
  ): Promise<{data:Blog}> => {
    return await ApiService.put<{data:Blog}>(`admin/blogs/${id}`, data);
  },

  deleteBlog: async (id: number | string): Promise<{data:Blog}> => {
    return await ApiService.delete<{data:Blog}>(`admin/blogs/${id}`);
  },
};
