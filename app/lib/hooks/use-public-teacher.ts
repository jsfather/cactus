import { useState, useCallback } from 'react';
import { publicTeacherService } from '@/app/lib/services/public-teacher.service';
import { Teacher } from '@/app/lib/types/teacher';

export const usePublicTeacher = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicTeacherService.getHomeTeachers();
      // Filter out teachers without user data
      setTeachers(response.data.filter((teacher) => teacher.user !== null));
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
