import { useCallback } from 'react';
import { useCoursePageStore } from '@/app/lib/stores/course-page.store';
import {
  CreateCoursePageRequest,
  UpdateCoursePageRequest,
} from '@/app/lib/types/course';

export function useCoursePage() {
  const {
    coursePageList,
    currentCoursePage,
    loading,
    error,
    fetchCoursePageList,
    fetchCoursePageById,
    createCoursePage,
    updateCoursePage,
    deleteCoursePage,
    clearError,
  } = useCoursePageStore();

  return {
    coursePageList,
    currentCoursePage,
    loading,
    error,
    fetchCoursePageList: useCallback(fetchCoursePageList, [fetchCoursePageList]),
    fetchCoursePageById: useCallback(fetchCoursePageById, [fetchCoursePageById]),
    createCoursePage: useCallback(createCoursePage, [createCoursePage]),
    updateCoursePage: useCallback(updateCoursePage, [updateCoursePage]),
    deleteCoursePage: useCallback(deleteCoursePage, [deleteCoursePage]),
    clearError: useCallback(clearError, [clearError]),
  };
}
