import { useState, useCallback } from 'react';
import { publicTeacherService } from '@/app/lib/services/public-teacher.service';
import { Teacher } from '@/app/lib/types/teacher';
import { filterPublicTeachers } from '@/app/lib/utils/teacher-display';

export const usePublicTeacher = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicTeacherService.getHomeTeachers();
      setTeachers(filterPublicTeachers(response.data));
    } catch (err) {
      setError('خطا در دریافت لیست مدرسان');
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    teachers,
    loading,
    error,
    fetchHomeTeachers,
  };
};
