import { useCallback, useEffect, useMemo } from 'react';
import { useTeacherTerm } from './use-teacher-term';
import { useTeacherStudent } from './use-teacher-student';
import { useTeacherHomework } from './use-teacher-homework';
import { useAttendance } from './use-attendance';
import { useReport } from './use-report';
import { useTeacherTicket } from './use-teacher-ticket';

export interface DashboardStats {
  totalTerms: number;
  activeTerms: number;
  totalStudents: number;
  totalSessions: number;
  totalHomeworks: number;
  homeworksWithFiles: number;
  totalAnswers: number;
  recentHomeworks: number;
  totalReports: number;
  recentReports: number;
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  pendingTickets: number;
  studentsWithLevel: number;
  studentsWithProfile: number;
  studentsWithAllergy: number;
  completedSessions: number;
  averageStudentsPerTerm: number;
  homeworksAnsweredCount: number;
  homeworksUnansweredCount: number;
}

export interface RecentActivity {
  title: string;
  description: string;
  time: string;
  type:
    | 'enrollment'
    | 'grade'
    | 'attendance'
    | 'homework'
    | 'report'
    | 'ticket';
}

export interface UpcomingClass {
  title: string;
  time: string;
  location: string;
  termId?: string;
}

export const useTeacherDashboard = () => {
  // Import all the hooks
  const { terms, loading: termsLoading, fetchTerms } = useTeacherTerm();
  const {
    studentList,
    loading: studentsLoading,
    fetchStudentList,
  } = useTeacherStudent();
  const {
    homeworks,
    loading: homeworksLoading,
    fetchHomeworks,
  } = useTeacherHomework();
  const { reportList, loading: reportsLoading, fetchReportList } = useReport();
  const {
    ticketList,
    loading: ticketsLoading,
    fetchTicketList,
  } = useTeacherTicket();

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      await Promise.all([
        fetchTerms(),
        fetchStudentList(),
        fetchHomeworks(),
        fetchReportList(),
        fetchTicketList(),
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [
    fetchTerms,
    fetchStudentList,
    fetchHomeworks,
    fetchReportList,
    fetchTicketList,
  ]);

  // Calculate dashboard statistics
  const stats: DashboardStats = useMemo(() => {
    // Terms stats
    const totalTerms = terms.length;
    const activeTerms = terms.filter((term) => {
      const today = new Date();
      const endDate = new Date(term.end_date.replace(/\//g, '-'));
      return endDate >= today;
    }).length;
    const totalSessions = terms.reduce(
      (sum, term) => sum + term.number_of_sessions,
      0
    );

    // Students stats
    const totalStudents = studentList.length;
    const studentsWithLevel = studentList.filter(
      (student) => student.level_id !== null
    ).length;
    const studentsWithProfile = studentList.filter(
      (student) => student.user !== null
    ).length;
    const studentsWithAllergy = studentList.filter(
      (student) => student.has_allergy === 1
    ).length;

    // Homeworks stats
    const totalHomeworks = homeworks.length;
    const homeworksWithFiles = homeworks.filter((hw) => hw.file_url).length;
    const totalAnswers = homeworks.reduce(
      (sum, hw) => sum + (hw.answers?.length || 0),
      0
    );
    const recentHomeworks = homeworks.filter((hw) => {
      if (!hw.schedule?.session_date) return false;
      const hwDate = new Date(hw.schedule.session_date);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return hwDate >= oneWeekAgo;
    }).length;

    // Reports stats
    const totalReports = reportList.length;
    const recentReports = reportList.filter((report) => {
      const reportDate = new Date(report.created_at);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return reportDate >= oneWeekAgo;
    }).length;

    // Tickets stats
    const totalTickets = ticketList.length;
    const openTickets = ticketList.filter(
      (ticket) => ticket.status === 'open'
    ).length;
    const closedTickets = ticketList.filter(
      (ticket) => ticket.status === 'closed'
    ).length;
    const pendingTickets = ticketList.filter(
      (ticket) => ticket.status === 'pending'
    ).length;

    // Calculate additional metrics
    const completedSessions = terms.reduce((sum, term) => {
      const today = new Date();
      const endDate = new Date(term.end_date.replace(/\//g, '-'));
      return sum + (endDate < today ? term.number_of_sessions : 0);
    }, 0);

    const averageStudentsPerTerm =
      totalTerms > 0 ? Math.round(totalStudents / totalTerms) : 0;
    const homeworksAnsweredCount = homeworks.filter(
      (hw) => hw.answers && hw.answers.length > 0
    ).length;
    const homeworksUnansweredCount = totalHomeworks - homeworksAnsweredCount;

    return {
      totalTerms,
      activeTerms,
      totalStudents,
      totalSessions,
      totalHomeworks,
      homeworksWithFiles,
      totalAnswers,
      recentHomeworks,
      totalReports,
      recentReports,
      totalTickets,
      openTickets,
      closedTickets,
      pendingTickets,
      studentsWithLevel,
      studentsWithProfile,
      studentsWithAllergy,
      completedSessions,
      averageStudentsPerTerm,
      homeworksAnsweredCount,
      homeworksUnansweredCount,
    };
  }, [terms, studentList, homeworks, reportList, ticketList]);

  // Generate recent activities from various sources
  const recentActivities: RecentActivity[] = useMemo(() => {
    const activities: RecentActivity[] = [];

    // Add recent homeworks
    homeworks.slice(0, 2).forEach((homework) => {
      if (homework.schedule?.session_date) {
        activities.push({
          title: 'تکلیف جدید',
          description: `تکلیف جدید برای جلسه ${homework.schedule.session_date} ایجاد شد`,
          time: homework.schedule.session_date,
          type: 'homework',
        });
      }
    });

    // Add recent reports
    reportList.slice(0, 2).forEach((report) => {
      activities.push({
        title: 'گزارش جدید',
        description: `گزارش جلسه ${report.schedule?.session_date || 'نامشخص'} ثبت شد`,
        time: new Date(report.created_at).toLocaleDateString('fa-IR'),
        type: 'report',
      });
    });

    // Add recent tickets
    ticketList.slice(0, 1).forEach((ticket) => {
      activities.push({
        title: 'تیکت جدید',
        description: `تیکت "${ticket.subject}" دریافت شد`,
        time: ticket.created_at
          ? new Date(ticket.created_at).toLocaleDateString('fa-IR')
          : 'نامشخص',
        type: 'ticket',
      });
    });

    // Sort by most recent and limit to 5
    return activities.slice(0, 5);
  }, [homeworks, reportList, ticketList]);

  // Generate upcoming classes from active terms
  const upcomingClasses: UpcomingClass[] = useMemo(() => {
    const today = new Date();
    const classes: UpcomingClass[] = [];

    terms.forEach((term) => {
      const endDate = new Date(term.end_date.replace(/\//g, '-'));
      if (endDate >= today) {
        // Add mock upcoming classes for active terms
        classes.push({
          title: term.title,
          time: '۱۰:۰۰ - ۱۲:۰۰',
          location: 'کلاس ۳۰۱ - طبقه سوم',
          termId: term.id.toString(),
        });
      }
    });

    return classes.slice(0, 3); // Limit to 3 upcoming classes
  }, [terms]);

  // Calculate loading state
  const loading =
    termsLoading ||
    studentsLoading ||
    homeworksLoading ||
    reportsLoading ||
    ticketsLoading;

  return {
    // Data
    stats,
    recentActivities,
    upcomingClasses,
    terms,
    studentList,
    homeworks,
    reportList,
    ticketList,

    // State
    loading,

    // Actions
    fetchAllData,
    refreshData: fetchAllData,
  };
};
