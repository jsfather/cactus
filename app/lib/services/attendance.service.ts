import { apiClient } from '@/app/lib/api/client';
import {
  GetAttendanceListResponse,
  GetAttendanceResponse,
  CreateAttendanceRequest,
  CreateAttendanceResponse,
  UpdateAttendanceRequest,
  UpdateAttendanceResponse,
} from '@/app/lib/types/attendance';

/**
 * Teacher Attendance Service
 * Handles all teacher attendance management operations
 */
class AttendanceService {
  /**
   * Get attendances for a specific term
   * GET /teacher/attendances/term/{termId}
   */
  async getTermAttendances(termId: string): Promise<GetAttendanceListResponse> {
    return await apiClient.get<GetAttendanceListResponse>(
      `/teacher/attendances/term/${termId}`
    );
  }

  /**
   * Get attendances for a specific student
   * GET /teacher/attendances/student/{studentId}
   */
  async getStudentAttendances(
    studentId: string
  ): Promise<GetAttendanceListResponse> {
    return await apiClient.get<GetAttendanceListResponse>(
      `/teacher/attendances/student/${studentId}`
    );
  }

  /**
   * Get attendances for a specific schedule
   * GET /attendances/schedule/{scheduleId}
   */
  async getScheduleAttendances(
    scheduleId: string
  ): Promise<GetAttendanceListResponse> {
    return await apiClient.get<GetAttendanceListResponse>(
      `/attendances/schedule/${scheduleId}`
    );
  }

  /**
   * Get list of absent students
   * GET /teacher/attendances/absents
   */
  async getAbsentStudents(): Promise<GetAttendanceListResponse> {
    return await apiClient.get<GetAttendanceListResponse>(
      '/teacher/attendances/absents'
    );
  }

  /**
   * Create a new attendance record
   * POST /teacher/attendances
   */
  async createAttendance(
    data: CreateAttendanceRequest
  ): Promise<CreateAttendanceResponse> {
    return await apiClient.post<CreateAttendanceResponse>(
      '/teacher/attendances',
      data
    );
  }

  /**
   * Update an existing attendance record
   * PUT /teacher/attendances/{id}
   */
  async updateAttendance(
    id: string,
    data: UpdateAttendanceRequest
  ): Promise<UpdateAttendanceResponse> {
    return await apiClient.put<UpdateAttendanceResponse>(
      `/teacher/attendances/${id}`,
      data
    );
  }

  /**
   * Delete an attendance record
   * DELETE /teacher/attendances/{id}
   */
  async deleteAttendance(id: string): Promise<void> {
    await apiClient.delete(`/teacher/attendances/${id}`);
  }

  /**
   * Get single attendance record
   * GET /teacher/attendances/{id}
   */
  async getAttendance(id: string): Promise<GetAttendanceResponse> {
    return await apiClient.get<GetAttendanceResponse>(
      `/teacher/attendances/${id}`
    );
  }
}

// Export singleton instance
export const attendanceService = new AttendanceService();
export default attendanceService;
