import { useCallback } from 'react';
import { useBlogStore } from '@/app/lib/stores/blog.store';
import { CreateBlogRequest, UpdateBlogRequest } from '@/app/lib/types';

export const useBlog = () => {
  const store = useBlogStore();

  const fetchBlogList = useCallback(() => store.fetchBlogList(), [store.fetchBlogList]);

  const createBlog = useCallback(
    (payload: CreateBlogRequest) => store.createBlog(payload),
    [store.createBlog]
  );

  const updateBlog = useCallback(
    (id: string, payload: UpdateBlogRequest) => store.updateBlog(id, payload),
    [store.updateBlog]
  );

  const deleteBlog = useCallback(
    (id: string) => store.deleteBlog(id),
    [store.deleteBlog]
  );

  const fetchBlogById = useCallback(
    (id: string) => store.fetchBlogById(id),
    [store.fetchBlogById]
  );

  return {
    // State
    blogList: store.blogList,
    currentBlog: store.currentBlog,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchBlogList,
    updateBlog,
    createBlog,
    deleteBlog,
    fetchBlogById,
    clearError: store.clearError,
  };
};
