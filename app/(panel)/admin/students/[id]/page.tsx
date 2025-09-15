'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

// UI Components
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import DatePicker from '@/app/components/ui/DatePicker';
import FileUpload from '@/app/components/ui/FileUpload';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

// Hooks and Types
import { useStudent } from '@/app/lib/hooks/use-student';
import { useLevel } from '@/app/lib/hooks/use-level';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import {
  CreateStudentRequest,
  UpdateStudentRequest,
} from '@/app/lib/types/student';

// Utils
import { convertToEnglishNumbers } from '@/app/lib/utils';

// Form Validation Schema
const studentSchema = z.object({
  first_name: z.string().min(1, 'نام ضروری است'),
  last_name: z.string().min(1, 'نام خانوادگی ضروری است'),
  username: z.string().min(1, 'نام کاربری ضروری است'),
  phone: z.string().min(11, 'شماره تلفن باید حداقل ۱۱ رقم باشد'),
  email: z.string().email('ایمیل معتبر وارد کنید').optional().or(z.literal('')),
  national_code: z.string().optional(),
  level_id: z.string().min(1, 'سطح ضروری است'),
  father_name: z.string().min(1, 'نام پدر ضروری است'),
  mother_name: z.string().min(1, 'نام مادر ضروری است'),
  father_job: z.string().min(1, 'شغل پدر ضروری است'),
  mother_job: z.string().min(1, 'شغل مادر ضروری است'),
  has_allergy: z.string().min(1, 'وضعیت آلرژی ضروری است'),
  allergy_details: z.string().optional(),
  interest_level: z.string().min(1, 'سطح علاقه ضروری است'),
  focus_level: z.string().min(1, 'سطح تمرکز ضروری است'),
  birth_date: z.string().min(1, 'تاریخ تولد ضروری است'),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const StudentFormPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const {
    createStudent,
    updateStudent,
    fetchStudentById,
    currentStudent,
    clearCurrentStudent,
  } = useStudent();

  const { levelList, loading: levelsLoading, fetchLevelList } = useLevel();

  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [nationalCard, setNationalCard] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<File | null>(null);

  const isNew = resolvedParams?.id === 'new';

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useFormWithBackendErrors<StudentFormData>(studentSchema);

  const hasAllergy = watch('has_allergy');

  useEffect(() => {
    return () => {
      clearCurrentStudent();
    };
  }, [clearCurrentStudent]);

  useEffect(() => {
    fetchLevelList();
  }, [fetchLevelList]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParamsData = await params;
      setResolvedParams(resolvedParamsData);

      if (resolvedParamsData.id === 'new') {
        // Clear form for new student
        reset({
          first_name: '',
          last_name: '',
          username: '',
          phone: '',
          email: '',
          national_code: '',
          level_id: '',
          father_name: '',
          mother_name: '',
          father_job: '',
          mother_job: '',
          has_allergy: '0',
          allergy_details: '',
          interest_level: '',
          focus_level: '',
          birth_date: '',
        });
        setLoading(false);
        return;
      }

      try {
        await fetchStudentById(resolvedParamsData.id);
      } catch (error) {
        toast.error('خطا در بارگذاری اطلاعات دانش‌آموز');
        router.push('/admin/students');
      } finally {
        setLoading(false);
      }
    };

    resolveParams();
  }, [fetchStudentById, reset, router]);

  // Set form data when currentStudent changes
  useEffect(() => {
    if (currentStudent && !isNew) {
      reset({
        first_name: currentStudent.user?.first_name || '',
        last_name: currentStudent.user?.last_name || '',
        username: '', // Username not available in current student data
        phone: currentStudent.user?.phone || '',
        email: currentStudent.user?.email || '',
        national_code: currentStudent.user?.national_code || '',
        level_id: currentStudent.level_id?.toString() || '',
        father_name: currentStudent.father_name || '',
        mother_name: currentStudent.mother_name || '',
        father_job: currentStudent.father_job || '',
        mother_job: currentStudent.mother_job || '',
        has_allergy: currentStudent.has_allergy?.toString() || '0',
        allergy_details: currentStudent.allergy_details || '',
        interest_level: currentStudent.interest_level?.toString() || '',
        focus_level: currentStudent.focus_level?.toString() || '',
        birth_date: currentStudent.birth_date || '',
      });
    }
  }, [currentStudent, reset, isNew]);

  const onSubmit = async (data: StudentFormData) => {
    try {
      const formData: CreateStudentRequest | UpdateStudentRequest = {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        username: data.username.trim(),
        phone: convertToEnglishNumbers(data.phone).trim(),
        email: data.email?.trim() || undefined,
        national_code: data.national_code?.trim() || undefined,
        level_id: parseInt(data.level_id),
        father_name: data.father_name.trim(),
        mother_name: data.mother_name.trim(),
        father_job: data.father_job.trim(),
        mother_job: data.mother_job.trim(),
        has_allergy: parseInt(data.has_allergy),
        allergy_details: data.allergy_details?.trim() || undefined,
        interest_level: parseInt(data.interest_level),
        focus_level: parseInt(data.focus_level),
        birth_date: data.birth_date,
        profile_picture: profilePicture || undefined,
        national_card: nationalCard || undefined,
        certificate: certificate || undefined,
      };

      if (isNew) {
        await createStudent(formData as CreateStudentRequest);
        toast.success('دانش‌آموز با موفقیت ایجاد شد');
      } else {
        await updateStudent(
          resolvedParams!.id,
          formData as UpdateStudentRequest
        );
        toast.success('دانش‌آموز با موفقیت ویرایش شد');
      }

      router.push('/admin/students');
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error?.message || 'خطا در ثبت اطلاعات');
    }
  };

  const levelOptions = [
    { value: '1', label: 'مبتدی' },
    { value: '2', label: 'متوسط' },
    { value: '3', label: 'پیشرفته' },
  ];

  const allergyOptions = [
    { value: '0', label: 'ندارد' },
    { value: '1', label: 'دارد' },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'دانش‌آموزان', href: '/admin/students' },
          { label: isNew ? 'افزودن دانش‌آموز' : 'ویرایش دانش‌آموز', href: '#' },
        ]}
      />

      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isNew ? 'افزودن دانش‌آموز جدید' : 'ویرایش دانش‌آموز'}
        </h1>
      </div>

      {/* Form */}
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          {/* Personal Information */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              اطلاعات شخصی
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="first_name"
                    label="نام"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.first_name?.message}
                    required
                  />
                )}
              />

              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="last_name"
                    label="نام خانوادگی"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.last_name?.message}
                    required
                  />
                )}
              />

              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    id="username"
                    label="نام کاربری"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.username?.message}
                    required
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    id="phone"
                    label="شماره تلفن"
                    type="tel"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.phone?.message}
                    required
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    label="ایمیل"
                    type="email"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="national_code"
                control={control}
                render={({ field }) => (
                  <Input
                    id="national_code"
                    label="کد ملی"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.national_code?.message}
                  />
                )}
              />

              <Controller
                name="birth_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="birth_date"
                    label="تاریخ تولد"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.birth_date?.message}
                    required
                  />
                )}
              />

              <Controller
                name="level_id"
                control={control}
                render={({ field }) => (
                  <Select
                    id="level_id"
                    label="سطح"
                    value={field.value}
                    onChange={field.onChange}
                    options={levelList.map((level) => ({
                      value: level.id.toString(),
                      label: `${level.label} - ${level.name}`,
                    }))}
                    error={errors.level_id?.message}
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* Family Information */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              اطلاعات خانوادگی
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Controller
                name="father_name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="father_name"
                    label="نام پدر"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.father_name?.message}
                    required
                  />
                )}
              />

              <Controller
                name="mother_name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="mother_name"
                    label="نام مادر"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.mother_name?.message}
                    required
                  />
                )}
              />

              <Controller
                name="father_job"
                control={control}
                render={({ field }) => (
                  <Input
                    id="father_job"
                    label="شغل پدر"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.father_job?.message}
                    required
                  />
                )}
              />

              <Controller
                name="mother_job"
                control={control}
                render={({ field }) => (
                  <Input
                    id="mother_job"
                    label="شغل مادر"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.mother_job?.message}
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* Health and Performance Information */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              اطلاعات سلامتی و عملکرد
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Controller
                name="has_allergy"
                control={control}
                render={({ field }) => (
                  <Select
                    id="has_allergy"
                    label="وضعیت آلرژی"
                    value={field.value}
                    onChange={field.onChange}
                    options={allergyOptions}
                    error={errors.has_allergy?.message}
                    required
                  />
                )}
              />

              {hasAllergy === '1' && (
                <Controller
                  name="allergy_details"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="allergy_details"
                      label="جزئیات آلرژی"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={errors.allergy_details?.message}
                    />
                  )}
                />
              )}

              <Controller
                name="interest_level"
                control={control}
                render={({ field }) => (
                  <Input
                    id="interest_level"
                    label="سطح علاقه (۱-۱۰۰)"
                    type="number"
                    min="1"
                    max="100"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.interest_level?.message}
                    required
                  />
                )}
              />

              <Controller
                name="focus_level"
                control={control}
                render={({ field }) => (
                  <Input
                    id="focus_level"
                    label="سطح تمرکز (۱-۱۰۰)"
                    type="number"
                    min="1"
                    max="100"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.focus_level?.message}
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* File Uploads */}
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              فایل‌ها و مدارک
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FileUpload
                id="profile_picture"
                label="تصویر پروفایل"
                accept="image/*"
                onChange={setProfilePicture}
                placeholder="انتخاب تصویر"
              />

              <FileUpload
                id="national_card"
                label="تصویر کارت ملی"
                accept="image/*"
                onChange={setNationalCard}
                placeholder="انتخاب تصویر"
              />

              <FileUpload
                id="certificate"
                label="مدرک تحصیلی"
                accept="image/*,.pdf"
                onChange={setCertificate}
                placeholder="انتخاب فایل"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 space-x-reverse pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/admin/students')}
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isNew ? 'ایجاد دانش‌آموز' : 'ویرایش دانش‌آموز'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormPage;
