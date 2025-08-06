'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  getStudent,
  createStudent,
  updateStudent,
} from '@/app/lib/api/admin/students';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';
import FileUpload from '@/app/components/ui/FileUpload';
import DatePicker from '@/app/components/ui/DatePicker';
import { Controller } from 'react-hook-form';

import { z } from 'zod';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { ApiError } from '@/app/lib/api/client';
import { convertToEnglishNumbers } from '@/app/lib/utils/persian';

const studentSchema = z.object({
  first_name: z.string().min(1, 'نام الزامی است'),
  last_name: z.string().min(1, 'نام خانوادگی الزامی است'),
  username: z.string().min(1, 'نام کاربری الزامی است'),
  phone: z.string().min(1, 'شماره موبایل الزامی است'),
  email: z.string().optional(),
  national_code: z.string().optional(),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر است'),
  level_id: z.number({ required_error: 'سطح الزامی است' }),
  father_name: z.string().min(1, 'نام پدر الزامی است'),
  mother_name: z.string().min(1, 'نام مادر الزامی است'),
  father_job: z.string().min(1, 'شغل پدر الزامی است'),
  mother_job: z.string().min(1, 'شغل مادر الزامی است'),
  has_allergy: z.number({ required_error: 'وضعیت آلرژی الزامی است' }),
  allergy_details: z.string().optional(),
  interest_level: z.string().min(1, 'سطح علاقه الزامی است'),
  focus_level: z.string().min(1, 'سطح تمرکز الزامی است'),
  birth_date: z.string().min(1, 'تاریخ تولد الزامی است'),
});

type StudentFormData = z.infer<typeof studentSchema>;

const levelOptions = [
  { value: '1', label: 'مبتدی' },
  { value: '2', label: 'متوسط' },
  { value: '3', label: 'پیشرفته' },
];

const allergyOptions = [
  { value: '0', label: 'ندارد' },
  { value: '1', label: 'دارد' },
];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [nationalCard, setNationalCard] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    setGlobalError,
    reset,
    watch,
  } = useFormWithBackendErrors<StudentFormData>(studentSchema);

  const hasAllergy = watch('has_allergy');

  useEffect(() => {
    const fetchStudent = async () => {
      if (isNew) {
        // Set default values for new students
        reset({
          first_name: '',
          last_name: '',
          username: '',
          phone: '',
          email: '',
          national_code: '',
          password: '',
          level_id: 1,
          father_name: '',
          mother_name: '',
          father_job: '',
          mother_job: '',
          has_allergy: 0,
          allergy_details: '',
          interest_level: '',
          focus_level: '',
          birth_date: '',
        });
        setLoading(false);
        return;
      }

      try {
        const response = await getStudent(resolvedParams.id);
        const student = response.data;
        reset({
          first_name: student.user.first_name,
          last_name: student.user.last_name,
          username: student.user.username,
          phone: student.user.phone,
          email: student.user.email || '',
          national_code: student.user.national_code || '',
          password: '', // Don't pre-fill password
          level_id: typeof student.level_id === 'string' ? parseInt(student.level_id) : student.level_id || 1,
          father_name: student.father_name || '',
          mother_name: student.mother_name || '',
          father_job: student.father_job || '',
          mother_job: student.mother_job || '',
          has_allergy: typeof student.has_allergy === 'string' ? parseInt(student.has_allergy) : student.has_allergy || 0,
          allergy_details: student.allergy_details || '',
          interest_level: String(student.interest_level || ''),
          focus_level: String(student.focus_level || ''),
          birth_date: student.birth_date || '',
        });
      } catch (error) {
        toast.error('خطا در بارگذاری دانش‌آموز');
        router.push('/admin/students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: StudentFormData) => {
    console.log('Form data before FormData creation:', data);
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add basic fields
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('username', data.username);
    formData.append('phone', data.phone);
    formData.append('email', data.email || '');
    formData.append('national_code', data.national_code || '');
    formData.append('password', data.password);
    formData.append('level_id', data.level_id.toString());
    formData.append('father_name', data.father_name);
    formData.append('mother_name', data.mother_name);
    formData.append('father_job', data.father_job);
    formData.append('mother_job', data.mother_job);
    formData.append('has_allergy', data.has_allergy.toString());
    formData.append('allergy_details', data.allergy_details || '');
    formData.append('interest_level', convertToEnglishNumbers(data.interest_level));
    formData.append('focus_level', convertToEnglishNumbers(data.focus_level));
    formData.append('birth_date', data.birth_date);
    
    // Add files if selected
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }
    if (nationalCard) {
      formData.append('national_card', nationalCard);
    }
    if (certificate) {
      formData.append('certificate', certificate);
    }

    // Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (isNew) {
      await createStudent(formData);
      toast.success('دانش‌آموز با موفقیت ایجاد شد');
    } else {
      await updateStudent(resolvedParams.id, formData);
      toast.success('دانش‌آموز با موفقیت بروزرسانی شد');
    }
    router.push('/admin/students');
  };

  const handleError = (error: ApiError) => {
    console.log('Student form submission error:', error);
    
    // Show toast error message
    if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error(isNew ? 'خطا در ایجاد دانش‌آموز' : 'خطا در بروزرسانی دانش‌آموز');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'دانش‌آموزان', href: '/admin/students' },
          {
            label: isNew ? 'ایجاد دانش‌آموز' : 'ویرایش دانش‌آموز',
            href: `/admin/students/${resolvedParams.id}`,
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
          <Input
            id="first_name"
            label="نام"
            required
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <Input
            id="last_name"
            label="نام خانوادگی"
            required
            error={errors.last_name?.message}
            {...register('last_name')}
          />
          <Input
            id="username"
            label="نام کاربری"
            required
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            id="phone"
            label="شماره موبایل"
            required
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            id="email"
            label="ایمیل"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            id="national_code"
            label="کد ملی"
            error={errors.national_code?.message}
            {...register('national_code')}
          />
          <Input
            id="password"
            label="رمز عبور"
            type="password"
            required
            error={errors.password?.message}
            {...register('password')}
          />
          <Select
            label="سطح"
            required
            options={levelOptions}
            placeholder="انتخاب کنید"
            error={errors.level_id?.message}
            {...register('level_id', { valueAsNumber: true })}
          />
          <Input
            id="father_name"
            label="نام پدر"
            required
            error={errors.father_name?.message}
            {...register('father_name')}
          />
          <Input
            id="mother_name"
            label="نام مادر"
            required
            error={errors.mother_name?.message}
            {...register('mother_name')}
          />
          <Input
            id="father_job"
            label="شغل پدر"
            required
            error={errors.father_job?.message}
            {...register('father_job')}
          />
          <Input
            id="mother_job"
            label="شغل مادر"
            required
            error={errors.mother_job?.message}
            {...register('mother_job')}
          />
          <Select
            label="آلرژی"
            required
            options={allergyOptions}
            placeholder="انتخاب کنید"
            error={errors.has_allergy?.message}
            {...register('has_allergy', { valueAsNumber: true })}
          />
          <Input
            id="allergy_details"
            label="توضیحات آلرژی"
            error={errors.allergy_details?.message}
            {...register('allergy_details')}
          />
          <Input
            id="interest_level"
            label="سطح علاقه"
            required
            error={errors.interest_level?.message}
            {...register('interest_level')}
          />
          <Input
            id="focus_level"
            label="سطح تمرکز"
            required
            error={errors.focus_level?.message}
            {...register('focus_level')}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FileUpload
            id="profile_picture"
            label="عکس پروفایل"
            accept="image/*"
            onChange={setProfilePicture}
          />
          <FileUpload
            id="national_card"
            label="کارت ملی"
            accept="image/*"
            onChange={setNationalCard}
          />
          <FileUpload
            id="certificate"
            label="مدرک"
            accept="image/*,.pdf"
            onChange={setCertificate}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
          <Controller
            name="birth_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="birth_date"
                label="تاریخ تولد"
                required
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.birth_date?.message}
                placeholder="تاریخ تولد را انتخاب کنید"
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/students')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد دانش‌آموز' : 'بروزرسانی دانش‌آموز'}
          </Button>
        </div>
      </form>
    </main>
  );
}
