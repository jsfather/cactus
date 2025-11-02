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

  // Student actions
  const fetchStudentTerms = useCallback(
    () => store.fetchStudentTerms(),
    [store.fetchStudentTerms]
  );

  const fetchStudentTermAttendances = useCallback(
    (termId: string) => store.fetchStudentTermAttendances(termId),
    [store.fetchStudentTermAttendances]
  );

  const fetchStudentScheduleAttendances = useCallback(
    (scheduleId: string) => store.fetchStudentScheduleAttendances(scheduleId),
    [store.fetchStudentScheduleAttendances]
  );

  const fetchStudentAbsents = useCallback(
    () => store.fetchStudentAbsents(),
    [store.fetchStudentAbsents]
  );

  return {
    // State
    attendanceList: store.attendanceList,
    termAttendances: store.termAttendances,
    studentAttendances: store.studentAttendances,
    scheduleAttendances: store.scheduleAttendances,
    absentStudents: store.absentStudents,
    currentAttendance: store.currentAttendance,
    studentTerms: store.studentTerms,
    studentAbsents: store.studentAbsents,
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
    fetchStudentTerms,
    fetchStudentTermAttendances,
    fetchStudentScheduleAttendances,
    fetchStudentAbsents,
    clearError: store.clearError,
    clearCurrentAttendance: store.clearCurrentAttendance,
  };
};
