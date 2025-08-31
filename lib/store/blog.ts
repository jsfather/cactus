import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Blog, CreateBlogRequest, UpdateBlogRequest } from "../types/blog";
import { blogApi } from "../api/blog";
import { toast } from "react-toastify";

interface BlogState {
  // State
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchBlogs: () => Promise<void>;
  fetchBlog: (id: number) => Promise<void>;
  createBlog: (data: CreateBlogRequest) => Promise<boolean>;
  updateBlog: (id: number, data: UpdateBlogRequest) => Promise<boolean>;
  deleteBlog: (id: number) => Promise<boolean>;
  clearError: () => void;
  clearCurrentBlog: () => void;
}

export const useBlogStore = create<BlogState>()(
  devtools(
    (set, get) => ({
      // Initial state
      blogs: [],
      currentBlog: null,
      loading: false,
      error: null,

      // Fetch all blogs
      fetchBlogs: async () => {
        set({ loading: true, error: null });
        try {
          const blogs = await blogApi.getBlogs();
          set({ blogs, loading: false });
          toast.success("Blogs loaded successfully");
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch blogs";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
        }
      },

      // Fetch single blog
      fetchBlog: async (id: number) => {
        set({ loading: true, error: null, currentBlog: null });
        try {
          const blog = await blogApi.getBlog(id);
          set({ currentBlog: blog, loading: false });
          toast.success("Blog loaded successfully");
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch blog";
          set({ error: errorMessage, loading: false, currentBlog: null });
          toast.error(errorMessage);
        }
      },

      // Create new blog
      createBlog: async (data: CreateBlogRequest) => {
        set({ loading: true, error: null });
        try {
          const newBlog = await blogApi.createBlog(data);
          const { blogs } = get();
          set({
            blogs: [newBlog, ...blogs],
            loading: false,
          });
          toast.success("Blog created successfully");
          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to create blog";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      // Update existing blog
      updateBlog: async (id: number, data: UpdateBlogRequest) => {
        set({ loading: true, error: null });
        try {
          const updatedBlog = await blogApi.updateBlog(id, data);
          const { blogs } = get();
          const updatedBlogs = blogs.map((blog) =>
            blog.id === id ? updatedBlog : blog
          );
          set({
            blogs: updatedBlogs,
            currentBlog: updatedBlog,
            loading: false,
          });
          toast.success("Blog updated successfully");
          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update blog";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      // Delete blog
      deleteBlog: async (id: number) => {
        set({ loading: true, error: null });
        try {
          await blogApi.deleteBlog(id);
          const { blogs } = get();
          const filteredBlogs = blogs.filter((blog) => blog.id !== id);
          set({
            blogs: filteredBlogs,
            currentBlog: null,
            loading: false,
          });
          toast.success("Blog deleted successfully");
          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to delete blog";
          set({ error: errorMessage, loading: false });
          toast.error(errorMessage);
          return false;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Clear current blog
      clearCurrentBlog: () => set({ currentBlog: null }),
    }),
    {
      name: "blog-store",
    }
  )
);
