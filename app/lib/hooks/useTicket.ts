import { useCallback } from 'react';
import { useTicketStore } from '@/app/lib/stores/ticket.store';
import { CreateTicketRequest, UpdateTicketRequest, Reply } from '@/app/lib/types';

export const useTicket = () => {
  const {
    tickets,
    currentTicket,
    departments,
    isLoading,
    isListLoading,
    error,
    fetchTickets,
    fetchTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    fetchDepartments,
    replyToTicket,
    clearCurrentTicket,
    clearError,
  } = useTicketStore();

  const handleCreateTicket = useCallback(async (payload: CreateTicketRequest) => {
    await createTicket(payload);
  }, [createTicket]);

  const handleUpdateTicket = useCallback(async (id: string, payload: UpdateTicketRequest) => {
    await updateTicket(id, payload);
  }, [updateTicket]);

  const handleDeleteTicket = useCallback(async (id: string) => {
    await deleteTicket(id);
  }, [deleteTicket]);

  const handleReplyToTicket = useCallback(async (id: string, payload: Reply) => {
    await replyToTicket(id, payload);
  }, [replyToTicket]);

  return {
    // State
    tickets,
    currentTicket,
    departments,
    isLoading,
    isListLoading,
    error,

    // Actions
    fetchTickets,
    fetchTicketById,
    fetchDepartments,
    createTicket: handleCreateTicket,
    updateTicket: handleUpdateTicket,
    deleteTicket: handleDeleteTicket,
    replyToTicket: handleReplyToTicket,
    clearCurrentTicket,
    clearError,
  };
};
