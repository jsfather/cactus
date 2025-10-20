import { useCallback, useEffect, useMemo } from 'react';
import { useStudentTerm } from './use-student-term';
import { useAvailableTerm } from './use-available-term';
import { useStudentTicket } from './use-student-ticket';
import { useStudentOrder } from './use-student-order';

export interface StudentDashboardStats {
  // Terms
  totalTerms: number;
  activeTerms: number;
  completedTerms: number;
  availableTerms: number;
  
  // Academic
  totalHomeworks: number;
  pendingHomeworks: number;
  completedHomeworks: number;
  attendanceRate: number;
  
  // Support
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  pendingTickets: number;
  
  // Orders
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface StudentRecentActivity {
  id: string;
  type: 'homework' | 'attendance' | 'ticket' | 'term' | 'order';
  title: string;
  description: string;
  time: string;
  status?: string;
  color: 'blue' | 'purple' | 'emerald' | 'amber' | 'red';
}

export interface StudentUpcomingSession {
  id: string;
  termTitle: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  teacher: string;
  type: string;
}

export const useStudentDashboard = () => {
  // Import all the hooks
  const { 
    termList, 
    loading: termsLoading, 
    getTermList 
  } = useStudentTerm();
  
  const { 
    availableTerms, 
    loading: availableTermsLoading, 
    getAvailableTerms 
  } = useAvailableTerm();
  
  const { 
    tickets, 
    isListLoading: ticketsLoading, 
    fetchTickets 
  } = useStudentTicket();
  
  const { 
    orders, 
    loading: ordersLoading, 
    fetchOrders 
  } = useStudentOrder();

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      await Promise.all([
        getTermList(),
        getAvailableTerms(),
        fetchTickets(),
        fetchOrders(),
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [getTermList, getAvailableTerms, fetchTickets, fetchOrders]);

  // Auto-fetch on hook initialization
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Calculate dashboard statistics
  const stats: StudentDashboardStats = useMemo(() => {
    // Terms stats
    const totalTerms = termList.length;
    const activeTerms = termList.filter((term) => {
      const today = new Date();
      const startDate = new Date(term.term.start_date.replace(/\//g, '-'));
      const endDate = new Date(term.term.end_date.replace(/\//g, '-'));
      return startDate <= today && endDate >= today;
    }).length;
    
    const completedTerms = termList.filter((term) => {
      const today = new Date();
      const endDate = new Date(term.term.end_date.replace(/\//g, '-'));
      return endDate < today;
    }).length;

    // Academic stats (calculated from term data)
    const totalHomeworks = termList.reduce((sum, term) => {
      return sum + (term.schedules?.filter(s => s.homeworks?.length > 0).length || 0);
    }, 0);
    
    // For now, calculate a mock attendance rate since attendance structure is incomplete
    const attendanceRate = termList.length > 0 ? 
      Math.round(termList.reduce((sum, term) => {
        const totalSessions = term.schedules?.length || 0;
        const attendedSessions = Math.floor(totalSessions * 0.85); // Mock 85% attendance
        return sum + (totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0);
      }, 0) / termList.length) : 0;

    // Support stats
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
    const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
    const pendingTickets = tickets.filter(ticket => ticket.status === 'pending').length;

    // Orders stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;

    return {
      totalTerms,
      activeTerms,
      completedTerms,
      availableTerms: availableTerms.length,
      totalHomeworks,
      pendingHomeworks: 0, // Will be calculated when homework data is available
      completedHomeworks: 0, // Will be calculated when homework data is available
      attendanceRate,
      totalTickets,
      openTickets,
      closedTickets,
      pendingTickets,
      totalOrders,
      pendingOrders,
      completedOrders,
    };
  }, [termList, availableTerms, tickets, orders]);

  // Generate recent activities
  const recentActivities: StudentRecentActivity[] = useMemo(() => {
    const activities: StudentRecentActivity[] = [];

    // Add recent terms
    termList.slice(0, 2).forEach((term) => {
      activities.push({
        id: `term-${term.term.id}`,
        type: 'term',
        title: 'ترم جدید',
        description: `ترم ${term.term.title} شروع شده است`,
        time: 'امروز',
        color: 'blue',
      });
    });

    // Add recent tickets
    tickets.slice(0, 2).forEach((ticket) => {
      activities.push({
        id: `ticket-${ticket.id}`,
        type: 'ticket',
        title: ticket.status === 'open' ? 'تیکت جدید' : 'پاسخ تیکت',
        description: ticket.subject,
        time: '۲ ساعت پیش',
        status: ticket.status,
        color: ticket.status === 'open' ? 'amber' : 'emerald',
      });
    });

    // Add recent orders
    orders.slice(0, 2).forEach((order) => {
      activities.push({
        id: `order-${order.id}`,
        type: 'order',
        title: 'سفارش جدید',
        description: `سفارش شماره ${order.code}`,
        time: '۵ ساعت پیش',
        status: order.status,
        color: order.status === 'delivered' ? 'emerald' : 'blue',
      });
    });

    return activities.slice(0, 6); // Limit to 6 activities
  }, [termList, tickets, orders]);

  // Generate upcoming sessions
  const upcomingSessions: StudentUpcomingSession[] = useMemo(() => {
    const sessions: StudentUpcomingSession[] = [];
    const today = new Date();

    termList.forEach((term) => {
      if (term.schedules) {
        term.schedules.forEach((schedule) => {
          const sessionDate = new Date(schedule.session_date);
          if (sessionDate >= today) {
            sessions.push({
              id: `session-${schedule.id}`,
              termTitle: term.term.title,
              sessionDate: schedule.session_date,
              startTime: schedule.start_time,
              endTime: schedule.end_time,
              teacher: term.user ? `${term.user.first_name} ${term.user.last_name}` : 'نامشخص',
              type: term.term.type,
            });
          }
        });
      }
    });

    return sessions
      .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime())
      .slice(0, 5); // Limit to 5 upcoming sessions
  }, [termList]);

  const loading = termsLoading || availableTermsLoading || ticketsLoading || ordersLoading;

  return {
    stats,
    recentActivities,
    upcomingSessions,
    termList,
    availableTerms,
    tickets,
    orders,
    loading,
    fetchAllData,
  };
};