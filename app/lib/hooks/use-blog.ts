import { useCallback } from 'react';
import { useBlogStore } from '@/app/lib/stores/blog.store';
import { BlogRequest } from '@/app/lib/types';

export const useBlog = () => {
  const store = useBlogStore();

  const fetchBlogList = useCallback(() => store.fetchBlogList(), [store.fetchBlogList]);

  const createBlog = useCallback(
    (payload: BlogRequest) => store.createBlog(payload),
    [store.createBlog]
  );

  const updateBlog = useCallback(
    (id: string, payload: BlogRequest) => store.updateBlog(id, payload),
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
