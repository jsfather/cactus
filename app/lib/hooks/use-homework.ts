import { useCallback } from 'react';
import { useHomeworkStore } from '@/app/lib/stores/homework.store';
import {
  SendMessageRequest,
  ReplyMessageRequest,
  SubmitAnswerRequest,
} from '@/app/lib/types/homework';

export const useHomework = () => {
  const {
    homeworkList,
    currentConversation,
    loading,
    error,
    submitting,
    setLoading,
    setError,
    clearError,
    setSubmitting,
    fetchHomeworksByTerm,
    submitAnswer,
    sendMessage,
    replyMessage,
    fetchConversation,
    clearCurrentConversation,
  } = useHomeworkStore();

  const handleFetchHomeworksByTerm = useCallback(
    async (termId: string) => {
      return fetchHomeworksByTerm(termId);
    },
    [fetchHomeworksByTerm]
  );

  const handleSubmitAnswer = useCallback(
    async (payload: SubmitAnswerRequest) => {
      return submitAnswer(payload);
    },
    [submitAnswer]
  );

  const handleSendMessage = useCallback(
    async (payload: SendMessageRequest) => {
      return sendMessage(payload);
    },
    [sendMessage]
  );

  const handleReplyMessage = useCallback(
    async (payload: ReplyMessageRequest) => {
      return replyMessage(payload);
    },
    [replyMessage]
  );

  const handleFetchConversation = useCallback(
    async (conversationId: string) => {
      return fetchConversation(conversationId);
    },
    [fetchConversation]
  );

  const handleClearConversation = useCallback(() => {
    clearCurrentConversation();
  }, [clearCurrentConversation]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    homeworkList,
    currentConversation,
    loading,
    error,
    submitting,
    setLoading,
    setError,
    clearError: handleClearError,
    setSubmitting,
    fetchHomeworksByTerm: handleFetchHomeworksByTerm,
    submitAnswer: handleSubmitAnswer,
    sendMessage: handleSendMessage,
    replyMessage: handleReplyMessage,
    fetchConversation: handleFetchConversation,
    clearConversation: handleClearConversation,
  };
};
