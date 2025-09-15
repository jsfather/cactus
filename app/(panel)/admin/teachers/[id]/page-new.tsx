'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import DatePicker from '@/app/components/ui/DatePicker';
import MarkdownEditor from '@/app/components/ui/MarkdownEditor';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { z } from 'zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTeacher } from '@/app/lib/hooks/use-teacher';
import { CreateTeacherRequest, UpdateTeacherRequest } from '@/app/lib/types/teacher';
import { ArrowRight, Save, Plus, Trash2 } from 'lucide-react';

const skillSchema = z.object({
  name: z.string().min(1, 'نام مهارت الزامی است'),
  score: z.number().min(0).max(100, 'امتیاز باید بین ۰ تا ۱۰۰ باشد'),
});

const workExperienceSchema = z.object({
  company: z.string().min(1, 'نام شرکت الزامی است'),
  role: z.string().min(1, 'سمت الزامی است'),
  years: z.string().min(1, 'سال‌های فعالیت الزامی است'),
  description: z.string().optional(),
});

const educationSchema = z.object({
  degree: z.string().min(1, 'مدرک تحصیلی الزامی است'),
  university: z.string().min(1, 'دانشگاه الزامی است'),
  year: z.number().min(1900).max(new Date().getFullYear(), 'سال تحصیل نامعتبر است'),
  description: z.string().optional(),
});

const schema = z.object({
  first_name: z.string().min(1, 'نام الزامی است'),
  last_name: z.string().min(1, 'نام خانوادگی الزامی است'),
  username: z.string().min(3, 'نام کاربری حداقل ۳ کاراکتر است'),
  email: z.string().email('ایمیل نامعتبر است'),
  national_code: z.string().min(10, 'کد ملی باید ۱۰ رقم باشد').max(10, 'کد ملی باید ۱۰ رقم باشد'),
  phone: z.string().min(11, 'شماره موبایل نامعتبر است'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر است').optional(),
  bio: z.string().optional(),
  about_me: z.string().optional(),
  member_since: z.string().optional(),
  city: z.string().optional(),
  achievements: z.string().optional(),
  skills: z.array(skillSchema).optional(),
  work_experiences: z.array(workExperienceSchema).optional(),
  educations: z.array(educationSchema).optional(),
});

type FormData = z.infer<typeof schema>;

export default function TeacherFormPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      national_code: '',
      phone: '',
      password: '',
      bio: '',
      about_me: '',
      member_since: '',
      city: '',
      achievements: '',
      skills: [],
      work_experiences: [],
      educations: [],
    },
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill
  } = useFieldArray({
    control,
    name: 'skills'
  });

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork
  } = useFieldArray({
    control,
    name: 'work_experiences'
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation
  } = useFieldArray({
    control,
    name: 'educations'
  });

  const {
    currentTeacher,
    loading,
    fetchTeacherById,
    createTeacher,
    updateTeacher,
    clearError,
  } = useTeacher();

  useEffect(() => {
    if (!isNew && resolvedParams.id) {
      fetchTeacherById(resolvedParams.id);
    }
  }, [isNew, resolvedParams.id, fetchTeacherById]);

  useEffect(() => {
    if (currentTeacher && !isNew) {
      reset({
        first_name: currentTeacher.user.first_name,
        last_name: currentTeacher.user.last_name,
        username: currentTeacher.user.username,
        email: currentTeacher.user.email,
        national_code: currentTeacher.user.national_code,
        phone: currentTeacher.user.phone,
        bio: currentTeacher.bio || '',
        about_me: currentTeacher.about_me || '',
        member_since: currentTeacher.member_since || '',
        city: currentTeacher.city || '',
        achievements: currentTeacher.achievements || '',
        skills: currentTeacher.skills || [],
        work_experiences: currentTeacher.work_experiences || [],
        educations: currentTeacher.educations || [],
      });
    }
  }, [currentTeacher, isNew, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      clearError();
      if (isNew) {
        const payload: CreateTeacherRequest = {
          ...data,
          password: data.password!,
        };
        await createTeacher(payload);
        toast.success('مربی با موفقیت ایجاد شد');
      } else {
        const payload: UpdateTeacherRequest = {
          ...data,
        };
        await updateTeacher(resolvedParams.id, payload);
        toast.success('مربی با موفقیت به‌روزرسانی شد');
      }
      router.push('/admin/teachers');
    } catch (error: any) {
      toast.error(error.message || 'خطایی رخ داده است');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت مربیان', href: '/admin/teachers' },
          { 
            label: isNew ? 'افزودن مربی جدید' : 'ویرایش مربی', 
            href: `/admin/teachers/${resolvedParams.id}`, 
            active: true 
          },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push('/admin/teachers')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {isNew ? 'افزودن مربی جدید' : 'ویرایش مربی'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {isNew ? 'اطلاعات مربی جدید را وارد کنید' : 'اطلاعات مربی را ویرایش کنید'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  اطلاعات شخصی
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    id="first_name"
                    label="نام"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    required
                  />
                  <Input
                    id="last_name"
                    label="نام خانوادگی"
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    required
                  />
                  <Input
                    id="username"
                    label="نام کاربری"
                    {...register('username')}
                    error={errors.username?.message}
                    required
                  />
                  <Input
                    id="email"
                    label="ایمیل"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    required
                  />
                  <Input
                    id="national_code"
                    label="کد ملی"
                    {...register('national_code')}
                    error={errors.national_code?.message}
                    required
                  />
                  <Input
                    id="phone"
                    label="شماره موبایل"
                    {...register('phone')}
                    error={errors.phone?.message}
                    required
                  />
                  {isNew && (
                    <Input
                      id="password"
                      label="رمز عبور"
                      type="password"
                      {...register('password')}
                      error={errors.password?.message}
                      required
                    />
                  )}
                  <Input
                    id="city"
                    label="شهر"
                    {...register('city')}
                    error={errors.city?.message}
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  اطلاعات حرفه‌ای
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        id="bio"
                        label="بیوگرافی"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.bio?.message}
                      />
                    )}
                  />
                  <Controller
                    name="about_me"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        id="about_me"
                        label="درباره من"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.about_me?.message}
                      />
                    )}
                  />
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Controller
                      name="member_since"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          id="member_since"
                          label="عضو از تاریخ"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          error={errors.member_since?.message}
                        />
                      )}
                    />
                  </div>
                  <Controller
                    name="achievements"
                    control={control}
                    render={({ field }) => (
                      <MarkdownEditor
                        id="achievements"
                        label="دستاوردها"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.achievements?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    مهارت‌ها
                  </h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => appendSkill({ name: '', score: 0 })}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    افزودن مهارت
                  </Button>
                </div>
                <div className="space-y-4">
                  {skillFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Input
                        label="نام مهارت"
                        {...register(`skills.${index}.name`)}
                        error={errors.skills?.[index]?.name?.message}
                      />
                      <Input
                        label="امتیاز (۰-۱۰۰)"
                        type="number"
                        min="0"
                        max="100"
                        {...register(`skills.${index}.score`, { valueAsNumber: true })}
                        error={errors.skills?.[index]?.score?.message}
                      />
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => removeSkill(index)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experiences */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    تجربیات کاری
                  </h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => appendWork({ company: '', role: '', years: '', description: '' })}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    افزودن تجربه کاری
                  </Button>
                </div>
                <div className="space-y-6">
                  {workFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                        <Input
                          label="نام شرکت"
                          {...register(`work_experiences.${index}.company`)}
                          error={errors.work_experiences?.[index]?.company?.message}
                        />
                        <Input
                          label="سمت"
                          {...register(`work_experiences.${index}.role`)}
                          error={errors.work_experiences?.[index]?.role?.message}
                        />
                        <Input
                          label="سال‌های فعالیت"
                          placeholder="مثال: ۲۰۱۸-۲۰۲۰"
                          {...register(`work_experiences.${index}.years`)}
                          error={errors.work_experiences?.[index]?.years?.message}
                        />
                      </div>
                      <Textarea
                        label="توضیحات"
                        {...register(`work_experiences.${index}.description`)}
                        error={errors.work_experiences?.[index]?.description?.message}
                      />
                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => removeWork(index)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          حذف تجربه کاری
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    تحصیلات
                  </h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => appendEducation({ degree: '', university: '', year: new Date().getFullYear(), description: '' })}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    افزودن تحصیلات
                  </Button>
                </div>
                <div className="space-y-6">
                  {educationFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
                        <Input
                          label="مدرک تحصیلی"
                          {...register(`educations.${index}.degree`)}
                          error={errors.educations?.[index]?.degree?.message}
                        />
                        <Input
                          label="دانشگاه"
                          {...register(`educations.${index}.university`)}
                          error={errors.educations?.[index]?.university?.message}
                        />
                        <Input
                          label="سال فارغ‌التحصیلی"
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          {...register(`educations.${index}.year`, { valueAsNumber: true })}
                          error={errors.educations?.[index]?.year?.message}
                        />
                      </div>
                      <Textarea
                        label="توضیحات"
                        {...register(`educations.${index}.description`)}
                        error={errors.educations?.[index]?.description?.message}
                      />
                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => removeEducation(index)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          حذف تحصیلات
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/admin/teachers')}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'در حال ذخیره...' : isNew ? 'ایجاد مربی' : 'به‌روزرسانی'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}