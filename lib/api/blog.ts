import apiClient from "./client";
import {
  Blog,
  BlogListResponse,
  BlogResponse,
  CreateBlogRequest,
  UpdateBlogRequest,
} from "../types/blog";

export const blogApi = {
  // Get all blogs
  getBlogs: async (): Promise<Blog[]> => {
    const response = await apiClient.get<BlogListResponse>("/api/admin/blogs");
    return response.data.data;
  },

  // Get single blog by ID
  getBlog: async (id: number): Promise<Blog> => {
    const response = await apiClient.get<BlogResponse>(
      `/api/admin/blogs/${id}`
    );
    return response.data.data;
  },

  // Create new blog
  createBlog: async (data: CreateBlogRequest): Promise<Blog> => {
    const response = await apiClient.post<BlogResponse>(
      "/api/admin/blogs",
      data
    );
    return response.data.data;
  },

  // Update existing blog
  updateBlog: async (id: number, data: UpdateBlogRequest): Promise<Blog> => {
    const response = await apiClient.put<BlogResponse>(
      `/api/admin/blogs/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete blog
  deleteBlog: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/admin/blogs/${id}`);
  },
};
