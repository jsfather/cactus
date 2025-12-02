import { create } from 'zustand';
import { productCommentService } from '@/app/lib/services/product-comment.service';
import { AdminProductComment } from '@/app/lib/types/product';

interface ProductCommentState {
  commentList: AdminProductComment[];
  loading: boolean;
  error: string | null;
  fetchCommentList: () => Promise<void>;
  approveComment: (id: string) => Promise<void>;
  rejectComment: (id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useProductCommentStore = create<ProductCommentState>(
  (set, get) => ({
    commentList: [],
    loading: false,
    error: null,

    fetchCommentList: async () => {
      set({ loading: true, error: null });
      try {
        const response = await productCommentService.getAll();
        set({ commentList: response.data, loading: false });
      } catch (error: any) {
        set({
          error: error.message || 'خطا در دریافت لیست نظرات',
          loading: false,
        });
        throw error;
      }
    },

    approveComment: async (id: string) => {
      try {
        await productCommentService.approve(id);
        // Update local state
        const { commentList } = get();
        set({
          commentList: commentList.map((comment) =>
            comment.id.toString() === id
              ? { ...comment, approved: true }
              : comment
          ),
        });
      } catch (error: any) {
        set({ error: error.message || 'خطا در تایید نظر' });
        throw error;
      }
    },

    rejectComment: async (id: string) => {
      try {
        await productCommentService.reject(id);
        // Update local state
        const { commentList } = get();
        set({
          commentList: commentList.map((comment) =>
            comment.id.toString() === id
              ? { ...comment, approved: false }
              : comment
          ),
        });
      } catch (error: any) {
        set({ error: error.message || 'خطا در رد نظر' });
        throw error;
      }
    },

    deleteComment: async (id: string) => {
      try {
        await productCommentService.delete(id);
        // Remove from local state
        const { commentList } = get();
        set({
          commentList: commentList.filter(
            (comment) => comment.id.toString() !== id
          ),
        });
      } catch (error: any) {
        set({ error: error.message || 'خطا در حذف نظر' });
        throw error;
      }
    },

    clearError: () => set({ error: null }),
  })
);
