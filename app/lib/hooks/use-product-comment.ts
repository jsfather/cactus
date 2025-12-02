import { useCallback } from 'react';
import { useProductCommentStore } from '@/app/lib/stores/product-comment.store';

export function useProductComment() {
  const store = useProductCommentStore();

  const fetchCommentList = useCallback(() => {
    return store.fetchCommentList();
  }, [store.fetchCommentList]);

  const approveComment = useCallback(
    (id: string) => {
      return store.approveComment(id);
    },
    [store.approveComment]
  );

  const rejectComment = useCallback(
    (id: string) => {
      return store.rejectComment(id);
    },
    [store.rejectComment]
  );

  const deleteComment = useCallback(
    (id: string) => {
      return store.deleteComment(id);
    },
    [store.deleteComment]
  );

  const clearError = useCallback(() => {
    store.clearError();
  }, [store.clearError]);

  return {
    commentList: store.commentList,
    loading: store.loading,
    error: store.error,
    fetchCommentList,
    approveComment,
    rejectComment,
    deleteComment,
    clearError,
  };
}
