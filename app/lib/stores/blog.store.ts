import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { blogService } from '@/app/lib/services/blog.service';
import type { ApiError } from '@/app/lib/api/client';
import { Blog, BlogRequest, GetBlogResponse } from '@/app/lib/types';

interface BlogState {
  // State
  blogList: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchBlogList: () => Promise<void>;
  createBlog: (payload: BlogRequest) => Promise<GetBlogResponse>;
  updateBlog: (id: string, payload: BlogRequest) => Promise<GetBlogResponse>;
  deleteBlog: (id: string) => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
}

export const useBlogStore = create<BlogState>()(
  devtools((set, get) => ({
    // Initial state
    blogList: [],
    currentBlog: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    fetchBlogList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await blogService.getList();
        set({
          blogList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createBlog: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newBlog = await blogService.create(payload);
        set((state) => ({
          list: [newBlog.data, ...state.blogList],
          loading: false,
        }));
        return newBlog.data;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateBlog: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const updatedBlog = await blogService.update(id, payload);
        set((state) => ({
          list: state.blogList.map((blog) =>
            blog.id === updatedBlog.data.id ? updatedBlog.data : blog
          ),
          current: updatedBlog.data,
          loading: false,
        }));
        return updatedBlog.data;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteBlog: async (id) => {
      try {
        set({ loading: true, error: null });
        await blogService.delete(id);
        set((state) => ({
          list: state.blogList.filter((blog) => blog.id !== id),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchBlogById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const blog = await blogService.getById(id);
        set({ currentBlog: blog.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
