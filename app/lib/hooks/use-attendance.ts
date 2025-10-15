import { useCallback } from 'react';
import { useAttendanceStore } from '@/app/lib/stores/attendance.store';
import {
  CreateAttendanceRequest,
  UpdateAttendanceRequest,
  Attendance,
} from '@/app/lib/types/attendance';

export const useAttendance = () => {
  const store = useAttendanceStore();

  // Fetch actions with useCallback optimization
  const fetchTermAttendances = useCallback(
    (termId: string) => store.fetchTermAttendances(termId),
    [store.fetchTermAttendances]
  );

  const fetchStudentAttendances = useCallback(
    (studentId: string) => store.fetchStudentAttendances(studentId),
    [store.fetchStudentAttendances]
  );

  const fetchScheduleAttendances = useCallback(
    (scheduleId: string) => store.fetchScheduleAttendances(scheduleId),
    [store.fetchScheduleAttendances]
  );

  const fetchAbsentStudents = useCallback(
    () => store.fetchAbsentStudents(),
    [store.fetchAbsentStudents]
  );

  const fetchAttendanceById = useCallback(
    (id: string) => store.fetchAttendanceById(id),
    [store.fetchAttendanceById]
  );

  // CRUD actions
  const createAttendance = useCallback(
    (payload: CreateAttendanceRequest) => store.createAttendance(payload),
    [store.createAttendance]
  );

  const updateAttendance = useCallback(
    (id: string, payload: UpdateAttendanceRequest) =>
      store.updateAttendance(id, payload),
    [store.updateAttendance]
  );

  const deleteAttendance = useCallback(
    (id: string) => store.deleteAttendance(id),
    [store.deleteAttendance]
  );

  // Utility actions
  const getAttendanceStats = useCallback(
    (attendances?: Attendance[]) => store.getAttendanceStats(attendances),
    [store.getAttendanceStats]
  );

  return {
    // State
    attendanceList: store.attendanceList,
    termAttendances: store.termAttendances,
    studentAttendances: store.studentAttendances,
    scheduleAttendances: store.scheduleAttendances,
    absentStudents: store.absentStudents,
    currentAttendance: store.currentAttendance,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchTermAttendances,
    fetchStudentAttendances,
    fetchScheduleAttendances,
    fetchAbsentStudents,
    fetchAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceStats,
    clearError: store.clearError,
    clearCurrentAttendance: store.clearCurrentAttendance,
  };
};
