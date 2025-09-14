import { useCallback } from 'react';
import { useTicketStore } from '@/app/lib/stores/ticket.store';
import {
  CreateTicketRequest,
  UpdateTicketRequest,
  ReplyTicketRequest,
  CreateTicketDepartmentRequest,
  UpdateTicketDepartmentRequest,
} from '@/app/lib/types';

export const useTicket = () => {
  const {
    // State
    tickets,
    currentTicket,
    departments,
    isLoading,
    isListLoading,
    isDepartmentsLoading,
    error,
    
    // Actions
    fetchTickets: _fetchTickets,
    fetchTeacherTickets: _fetchTeacherTickets,
    fetchAllTickets: _fetchAllTickets,
    fetchTicketById: _fetchTicketById,
    createTicket: _createTicket,
    updateTicket: _updateTicket,
    deleteTicket: _deleteTicket,
    closeTicket: _closeTicket,
    replyToTicket: _replyToTicket,
    fetchDepartments: _fetchDepartments,
    createDepartment: _createDepartment,
    updateDepartment: _updateDepartment,
    deleteDepartment: _deleteDepartment,
    clearCurrentTicket: _clearCurrentTicket,
    clearError: _clearError,
  } = useTicketStore();

  // Optimized callbacks
  const fetchTickets = useCallback(() => _fetchTickets(), [_fetchTickets]);
  
  const fetchTeacherTickets = useCallback(() => _fetchTeacherTickets(), [_fetchTeacherTickets]);
  
  const fetchAllTickets = useCallback(() => _fetchAllTickets(), [_fetchAllTickets]);
  
  const fetchTicketById = useCallback((id: string) => _fetchTicketById(id), [_fetchTicketById]);
  
  const createTicket = useCallback((payload: CreateTicketRequest) => _createTicket(payload), [_createTicket]);
  
  const updateTicket = useCallback((id: string, payload: UpdateTicketRequest) => _updateTicket(id, payload), [_updateTicket]);
  
  const deleteTicket = useCallback((id: string) => _deleteTicket(id), [_deleteTicket]);
  
  const closeTicket = useCallback((id: string) => _closeTicket(id), [_closeTicket]);
  
  const replyToTicket = useCallback((id: string, payload: ReplyTicketRequest) => _replyToTicket(id, payload), [_replyToTicket]);
  
  const fetchDepartments = useCallback(() => _fetchDepartments(), [_fetchDepartments]);
  
  const createDepartment = useCallback((payload: CreateTicketDepartmentRequest) => _createDepartment(payload), [_createDepartment]);
  
  const updateDepartment = useCallback((id: string, payload: UpdateTicketDepartmentRequest) => _updateDepartment(id, payload), [_updateDepartment]);
  
  const deleteDepartment = useCallback((id: string) => _deleteDepartment(id), [_deleteDepartment]);
  
  const clearCurrentTicket = useCallback(() => _clearCurrentTicket(), [_clearCurrentTicket]);
  
  const clearError = useCallback(() => _clearError(), [_clearError]);

  return {
    // State
    tickets,
    currentTicket,
    departments,
    isLoading,
    isListLoading,
    isDepartmentsLoading,
    error,
    
    // Actions
    fetchTickets,
    fetchTeacherTickets,
    fetchAllTickets,
    fetchTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    closeTicket,
    replyToTicket,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    clearCurrentTicket,
    clearError,
  };
};