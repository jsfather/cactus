import { useCallback } from 'react';
import { useStudentTicketStore } from '@/app/lib/stores/student-ticket.store';

export const useStudentTicket = () => {
  const {
    tickets,
    currentTicket,
    departments,
    isLoading,
    isListLoading,
    isDepartmentsLoading,
    error,
    fetchTickets,
    fetchTicketById,
    createTicket,
    fetchDepartments,
    clearCurrentTicket,
    clearError,
  } = useStudentTicketStore();

  const handleFetchTickets = useCallback(() => {
    return fetchTickets();
  }, [fetchTickets]);

  const handleFetchTicketById = useCallback(
    (id: string) => {
      return fetchTicketById(id);
    },
    [fetchTicketById]
  );

  const handleCreateTicket = useCallback(
    (payload: any) => {
      return createTicket(payload);
    },
    [createTicket]
  );

  const handleFetchDepartments = useCallback(() => {
    return fetchDepartments();
  }, [fetchDepartments]);

  const handleClearCurrentTicket = useCallback(() => {
    clearCurrentTicket();
  }, [clearCurrentTicket]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    tickets,
    currentTicket,
    departments,
    isLoading,
    isListLoading,
    isDepartmentsLoading,
    error,
    fetchTickets: handleFetchTickets,
    fetchTicketById: handleFetchTicketById,
    createTicket: handleCreateTicket,
    fetchDepartments: handleFetchDepartments,
    clearCurrentTicket: handleClearCurrentTicket,
    clearError: handleClearError,
  };
};
