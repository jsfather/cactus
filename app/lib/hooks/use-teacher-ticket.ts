import { useCallback } from 'react';
import { useTeacherTicketStore } from '@/app/lib/stores/teacher-ticket.store';
import { TeacherReplyTicketRequest } from '@/app/lib/types';

export const useTeacherTicket = () => {
  const store = useTeacherTicketStore();

  const fetchTicketList = useCallback(
    () => store.fetchTicketList(),
    [store.fetchTicketList]
  );

  const fetchTicketById = useCallback(
    (id: string) => store.fetchTicketById(id),
    [store.fetchTicketById]
  );

  const replyToTicket = useCallback(
    (id: string, payload: TeacherReplyTicketRequest) =>
      store.replyToTicket(id, payload),
    [store.replyToTicket]
  );

  return {
    // State
    ticketList: store.ticketList,
    currentTicket: store.currentTicket,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchTicketList,
    fetchTicketById,
    replyToTicket,
    clearError: store.clearError,
  };
};
