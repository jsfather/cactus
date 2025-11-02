import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { attendanceService } from '@/app/lib/services/attendance.service';
import type { ApiError } from '@/app/lib/api/client';
import {
  Attendance,
  CreateAttendanceRequest,
  UpdateAttendanceRequest,
  GetAttendanceResponse,
  CreateAttendanceResponse,
  AttendanceStats,
  StudentTerm,
} from '@/app/lib/types/attendance';

interface AttendanceState {
  // State
  attendanceList: Attendance[];
  termAttendances: Attendance[];
  studentAttendances: Attendance[];
  scheduleAttendances: Attendance[];
  absentStudents: Attendance[];
  currentAttendance: Attendance | null;
  studentTerms: StudentTerm[];
  studentAbsents: Attendance[];
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Fetch actions
  fetchTermAttendances: (termId: string) => Promise<void>;
  fetchStudentAttendances: (studentId: string) => Promise<void>;
  fetchScheduleAttendances: (scheduleId: string) => Promise<void>;
  fetchAbsentStudents: () => Promise<void>;
  fetchAttendanceById: (id: string) => Promise<void>;

  // CRUD actions
  createAttendance: (
    payload: CreateAttendanceRequest
  ) => Promise<CreateAttendanceResponse>;
  updateAttendance: (
    id: string,
    payload: UpdateAttendanceRequest
  ) => Promise<GetAttendanceResponse>;
  deleteAttendance: (id: string) => Promise<void>;

  // Student actions
  fetchStudentTerms: () => Promise<void>;
  fetchStudentTermAttendances: (termId: string) => Promise<void>;
  fetchStudentScheduleAttendances: (scheduleId: string) => Promise<void>;
  fetchStudentAbsents: () => Promise<void>;

  // Utility actions
  getAttendanceStats: (attendances?: Attendance[]) => AttendanceStats;
  clearCurrentAttendance: () => void;
}

export const useAttendanceStore = create<AttendanceState>()(
  devtools((set, get) => ({
    // Initial state
    attendanceList: [],
    termAttendances: [],
    studentAttendances: [],
    scheduleAttendances: [],
    absentStudents: [],
    currentAttendance: null,
    studentTerms: [],
    studentAbsents: [],
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    clearCurrentAttendance: () => set({ currentAttendance: null }),

    fetchTermAttendances: async (termId: string) => {
      try {
        set({ loading: true, error: null });
        const response = await attendanceService.getTermAttendances(termId);
        set({
          termAttendances: response.data,
          attendanceList: response.data, // Also update main list
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchStudentAttendances: async (studentId: string) => {
      try {
        set({ loading: true, error: null });
        const response =
          await attendanceService.getStudentAttendances(studentId);
        set({
          studentAttendances: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchScheduleAttendances: async (scheduleId: string) => {
      try {
        set({ loading: true, error: null });
        const response =
          await attendanceService.getScheduleAttendances(scheduleId);
        set({
          scheduleAttendances: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchAbsentStudents: async () => {
      try {
        set({ loading: true, error: null });
        const response = await attendanceService.getAbsentStudents();
        set({
          absentStudents: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchAttendanceById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const response = await attendanceService.getAttendance(id);
        set({ currentAttendance: response.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createAttendance: async (payload) => {
      try {
        set({ loading: true, error: null });
        const response = await attendanceService.createAttendance(payload);
        set((state) => ({
          attendanceList: [response.data, ...state.attendanceList],
          termAttendances: [response.data, ...state.termAttendances],
          loading: false,
        }));
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateAttendance: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const response = await attendanceService.updateAttendance(id, payload);
        set((state) => ({
          attendanceList: state.attendanceList.map((attendance) =>
            attendance.id === response.data.id ? response.data : attendance
          ),
          termAttendances: state.termAttendances.map((attendance) =>
            attendance.id === response.data.id ? response.data : attendance
          ),
          studentAttendances: state.studentAttendances.map((attendance) =>
            attendance.id === response.data.id ? response.data : attendance
          ),
          scheduleAttendances: state.scheduleAttendances.map((attendance) =>
            attendance.id === response.data.id ? response.data : attendance
          ),
          currentAttendance: response.data,
          loading: false,
        }));
        return response;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteAttendance: async (id) => {
      try {
        set({ loading: true, error: null });
        await attendanceService.deleteAttendance(id);
        set((state) => ({
          attendanceList: state.attendanceList.filter(
            (attendance) => attendance.id !== parseInt(id)
          ),
          termAttendances: state.termAttendances.filter(
            (attendance) => attendance.id !== parseInt(id)
          ),
          studentAttendances: state.studentAttendances.filter(
            (attendance) => attendance.id !== parseInt(id)
          ),
          scheduleAttendances: state.scheduleAttendances.filter(
            (attendance) => attendance.id !== parseInt(id)
          ),
          absentStudents: state.absentStudents.filter(
            (attendance) => attendance.id !== parseInt(id)
          ),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    getAttendanceStats: (attendances?: Attendance[]) => {
      const list = attendances || get().attendanceList;
      const total = list.length;
      const present = list.filter((a) => a.status === 'present').length;
      const absent = list.filter((a) => a.status === 'absent').length;
      const averageMark =
        total > 0
          ? list.reduce((sum, a) => sum + parseFloat(a.mark || '0'), 0) / total
          : 0;

      return {
        total,
        present,
        absent,
        averageMark: Math.round(averageMark * 100) / 100,
      };
    },

    // Student-specific actions
    fetchStudentTerms: async () => {
      try {
        set({ loading: true, error: null });
        const response = await attendanceService.getStudentTerms();
        set({
          studentTerms: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchStudentTermAttendances: async (termId: string) => {
      try {
        set({ loading: true, error: null });
        const response =
          await attendanceService.getStudentTermAttendances(termId);
        set({
          termAttendances: response.data,
          attendanceList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchStudentScheduleAttendances: async (scheduleId: string) => {
      try {
        set({ loading: true, error: null });
        const response =
          await attendanceService.getStudentScheduleAttendances(scheduleId);
        set({
          scheduleAttendances: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchStudentAbsents: async () => {
      try {
        set({ loading: true, error: null });
        const response = await attendanceService.getStudentAbsents();
        set({
          studentAbsents: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
