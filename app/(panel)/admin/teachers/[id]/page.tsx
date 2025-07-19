'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import {
  getTeacher,
  createTeacher,
  updateTeacher,
} from '@/app/lib/api/admin/teachers';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';
import FileUpload from '@/app/components/ui/FileUpload';

const teacherSchema = z.object({
  first_name: z.string().min(1, 'نام الزامی است'),
  last_name: z.string().min(1, 'نام خانوادگی الزامی است'),
  username: z.string().min(1, 'نام کاربری الزامی است'),
  phone: z.string().min(1, 'شماره موبایل الزامی است'),
  email: z.string().email('ایمیل نامعتبر است').optional().or(z.literal('')),
  national_code: z.string().min(1, 'کد ملی الزامی است'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر است'),
  level_id: z.string().min(1, 'سطح الزامی است'),
  father_name: z.string().min(1, 'نام پدر الزامی است'),
  mother_name: z.string().min(1, 'نام مادر الزامی است'),
  father_job: z.string().min(1, 'شغل پدر الزامی است'),
  mother_job: z.string().min(1, 'شغل مادر الزامی است'),
  has_allergy: z.string().min(1, 'آلرژی الزامی است'),
  allergy_details: z.string().optional().or(z.literal('')),
  interest_level: z.string().min(1, 'سطح علاقه الزامی است'),
  focus_level: z.string().min(1, 'سطح تمرکز الزامی است'),
  profile_picture: z.any().optional(),
  national_card: z.any().optional(),
  certificate: z.any().optional(),
  birth_date: z.string().min(1, 'تاریخ تولد الزامی است'),
  bio: z.string().min(1, 'بیوگرافی الزامی است'),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'new';
  const [loading, setLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      if (isNew) return;

      try {
        const response = await getTeacher(resolvedParams.id);
        const teacher = response.data;
        reset({
          first_name: teacher.user.first_name,
          last_name: teacher.user.last_name,
          username: teacher.user.username,
          phone: teacher.user.phone,
          email: teacher.user.email || '',
          national_code: teacher.user.national_code || '',
          profile_picture: teacher.user.profile_picture || '',
          level_id: teacher.level_id || '',
          father_name: teacher.father_name || '',
          mother_name: teacher.mother_name || '',
          father_job: teacher.father_job || '',
          mother_job: teacher.mother_job || '',
          has_allergy: teacher.has_allergy || '',
          allergy_details: teacher.allergy_details || '',
          interest_level: teacher.interest_level || '',
          focus_level: teacher.focus_level || '',
          national_card: teacher.national_card || '',
          certificate: teacher.certificate || '',
          birth_date: teacher.birth_date || '',
          bio: teacher.bio,
        });
      } catch (error) {
        router.push('/admin/teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: TeacherFormData) => {
    try {
      const payload = {
        bio: data.bio,
        user: {
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          phone: data.phone,
          email: data.email,
          national_code: data.national_code,
          profile_picture: data.profile_picture,
        },
        level_id: data.level_id,
        father_name: data.father_name,
        mother_name: data.mother_name,
        father_job: data.father_job,
        mother_job: data.mother_job,
        has_allergy: data.has_allergy,
        allergy_details: data.allergy_details,
        interest_level: data.interest_level,
        focus_level: data.focus_level,
        national_card: data.national_card,
        certificate: data.certificate,
        birth_date: data.birth_date,
      };
      if (isNew) {
        await createTeacher(payload);
        toast.success('مدرس با موفقیت ایجاد شد');
      } else {
        await updateTeacher(resolvedParams.id, payload);
        toast.success('مدرس با موفقیت بروزرسانی شد');
      }
      router.push('/admin/teachers');
    } catch (error) {
      toast.error(isNew ? 'خطا در ایجاد مدرس' : 'خطا در بروزرسانی مدرس');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'مدرسین', href: '/admin/teachers' },
          {
            label: isNew ? 'ایجاد مدرس' : 'ویرایش مدرس',
            href: `/admin/teachers/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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
            required
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
          <Input
            id="level_id"
            label="سطح"
            required
            error={errors.level_id?.message}
            {...register('level_id')}
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
          <Input
            id="has_allergy"
            label="آلرژی دارد؟ (۰/۱)"
            required
            error={errors.has_allergy?.message}
            {...register('has_allergy')}
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
            error={errors.profile_picture?.message}
            register={register('profile_picture')}
          />
          <FileUpload
            id="national_card"
            label="کارت ملی"
            accept="image/*"
            error={errors.national_card?.message}
            register={register('national_card')}
          />
          <FileUpload
            id="certificate"
            label="مدرک"
            accept="image/*,.pdf"
            error={errors.certificate?.message}
            register={register('certificate')}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="birth_date"
            label="تاریخ تولد"
            required
            error={errors.birth_date?.message}
            {...register('birth_date')}
          />
        </div>
        <div className="w-full">
          <Textarea
            id="bio"
            label="بیوگرافی"
            required
            error={errors.bio?.message}
            {...register('bio')}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="white"
            onClick={() => router.push('/admin/teachers')}
          >
            انصراف
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? 'ایجاد مدرس' : 'بروزرسانی مدرس'}
          </Button>
        </div>
      </form>
    </main>
  );
}
