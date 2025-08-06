'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  getTermTeacher,
  createTermTeacher,
  updateTermTeacher,
} from '@/app/lib/api/admin/term-teachers';
import { getTerms } from '@/app/lib/api/admin/terms';
import { getTeachers } from '@/app/lib/api/admin/teachers';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';
import TimePicker from '@/app/components/ui/TimePicker';

import { z } from 'zod';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { ApiError } from '@/app/lib/api/client';
import { useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

const termTeacherSchema = z.object({
  term_id: z.number({ required_error: 'ترم الزامی است' }),
  teacher_id: z.number({ required_error: 'مدرس الزامی است' }),
  days: z.array(
    z.object({
      day_of_week: z.string().min(1, 'روز هفته الزامی است'),
      start_time: z.string().min(1, 'ساعت شروع الزامی است'),
      end_time: z.string().min(1, 'ساعت پایان الزامی است'),
    })
  ).min(1, 'حداقل یک روز الزامی است'),
});

type TermTeacherFormData = z.infer<typeof termTeacherSchema>;

const daysOfWeek = [
  { value: 'شنبه', label: 'شنبه' },
  { value: 'یکشنبه', label: 'یکشنبه' },
  { value: 'دوشنبه', label: 'دوشنبه' },
  { value: 'سه‌شنبه', label: 'سه‌شنبه' },
  { value: 'چهارشنبه', label: 'چهارشنبه' },
  { value: 'پنجشنبه', label: 'پنجشنبه' },
  { value: 'جمعه', label: 'جمعه' },
];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(true);
  const [termOptions, setTermOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [teacherOptions, setTeacherOptions] = useState<Array<{ value: string; label: string }>>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    setGlobalError,
    reset,
  } = useFormWithBackendErrors<TermTeacherFormData>(termTeacherSchema);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'days',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch terms and teachers in parallel
        const [termsResponse, teachersResponse] = await Promise.all([
          getTerms(),
          getTeachers()
        ]);

        // Set terms options
        const termOptions = termsResponse.data.map(term => ({
          value: term.id.toString(),
          label: term.title
        }));
        setTermOptions(termOptions);

        // Set teachers options
        const teacherOptions = teachersResponse.data.map(teacher => ({
          value: teacher.user_id.toString(),
          label: `${teacher.user.first_name} ${teacher.user.last_name}`
        }));
        setTeacherOptions(teacherOptions);

        // If editing, fetch the specific term-teacher data
        if (!isNew) {
          const response = await getTermTeacher(resolvedParams.id);
          const termTeacher = response.data;
          reset({
            term_id: typeof termTeacher.term_id === 'string' ? parseInt(termTeacher.term_id) : termTeacher.term_id,
            teacher_id: typeof termTeacher.teacher_id === 'string' ? parseInt(termTeacher.teacher_id) : termTeacher.teacher_id,
            days: termTeacher.days || [],
          });
        } else {
          // Set default values for new term-teachers after options are loaded
          reset({
            term_id: termOptions.length > 0 ? parseInt(termOptions[0].value) : 0,
            teacher_id: teacherOptions.length > 0 ? parseInt(teacherOptions[0].value) : 0,
            days: [
              {
                day_of_week: 'شنبه',
                start_time: '',
                end_time: '',
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (!isNew) {
          toast.error('خطا در بارگذاری ترم مدرس');
          router.push('/admin/term-teachers');
        } else {
          toast.error('خطا در بارگذاری اطلاعات');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: TermTeacherFormData) => {
    console.log('Form data before submission:', data);
    console.log('term_id type:', typeof data.term_id, 'value:', data.term_id);
    console.log('teacher_id type:', typeof data.teacher_id, 'value:', data.teacher_id);

    if (isNew) {
      await createTermTeacher(data);
      toast.success('ترم مدرس با موفقیت ایجاد شد');
    } else {
      await updateTermTeacher(resolvedParams.id, data);
      toast.success('ترم مدرس با موفقیت بروزرسانی شد');
    }
    router.push('/admin/term-teachers');
  };

  const handleError = (error: ApiError) => {
    console.log('Term teacher form submission error:', error);
    
    // Show toast error message
    if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error(isNew ? 'خطا در ایجاد ترم مدرس' : 'خطا در بروزرسانی ترم مدرس');
    }
  };

  const addDay = () => {
    append({
      day_of_week: 'شنبه',
      start_time: '',
      end_time: '',
    });
  };

  const removeDay = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'ترم مدرسین', href: '/admin/term-teachers' },
          {
            label: isNew ? 'ایجاد ترم مدرس' : 'ویرایش ترم مدرس',
            href: `/admin/term-teachers/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form 
        onSubmit={handleSubmit(submitWithErrorHandling(onSubmit, handleError))} 
        className="mt-8 space-y-6"
      >
        {globalError && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
            {globalError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Select
            id="term_id"
            label="ترم"
            placeholder="ترم را انتخاب کنید"
            options={termOptions}
            required
            error={errors.term_id?.message}
            {...register('term_id', { valueAsNumber: true })}
          />

          <Select
            id="teacher_id"
            label="مدرس"
            placeholder="مدرس را انتخاب کنید"
            options={teacherOptions}
            required
            error={errors.teacher_id?.message}
            {...register('teacher_id', { valueAsNumber: true })}
          />
        </div>

        {/* Days Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              برنامه کلاس‌ها
            </h3>
            <Button
              type="button"
              variant="secondary"
              onClick={addDay}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              افزودن روز
            </Button>
          </div>
          
          {errors.days?.message && (
            <p className="text-sm text-red-600">{errors.days.message}</p>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                <Controller
                  name={`days.${index}.day_of_week`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id={`day_${index}`}
                      label="روز هفته"
                      placeholder="روز را انتخاب کنید"
                      options={daysOfWeek}
                      required
                      error={errors.days?.[index]?.day_of_week?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name={`days.${index}.start_time`}
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      id={`start_time_${index}`}
                      label="ساعت شروع"
                      placeholder="ساعت شروع"
                      required
                      error={errors.days?.[index]?.start_time?.message}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  )}
                />

                <Controller
                  name={`days.${index}.end_time`}
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      id={`end_time_${index}`}
                      label="ساعت پایان"
                      placeholder="ساعت پایان"
                      required
                      error={errors.days?.[index]?.end_time?.message}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  )}
                />

                <div className="flex items-end">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => removeDay(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/term-teachers')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد ترم مدرس' : 'بروزرسانی ترم مدرس'}
          </Button>
        </div>
      </form>
    </main>
  );
}
