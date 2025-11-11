'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { z } from 'zod';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { useSettingsStore } from '@/app/lib/stores/settings.store';

const schema = z.object({
  phone: z.string().min(1, 'شماره تماس الزامی است'),
  email: z.string().email('ایمیل معتبر نیست'),
  address: z.string().min(1, 'آدرس الزامی است'),
  about_us: z.string().min(1, 'درباره ما الزامی است'),
  our_mission: z.string().min(1, 'ماموریت ما الزامی است'),
  our_vision: z.string().min(1, 'چشم انداز ما الزامی است'),
  footer_text: z.string().min(1, 'متن فوتر الزامی است'),
});

type FormData = z.infer<typeof schema>;

export default function AboutUsPage() {
  const { settings, loading, fetchSettings, updateSettings } =
    useSettingsStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    reset,
  } = useFormWithBackendErrors<FormData>(schema);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        reset(data);
      } catch (e: any) {
        toast.error(e.message || 'خطا در دریافت اطلاعات');
      }
    };
    loadSettings();
  }, [fetchSettings, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      // Create the payload with the current id and form data
      const updateData = {
        id: settings.id || 1, // Use existing id or default to 1
        ...data,
      };
      const res = await updateSettings(updateData);
      toast.success('اطلاعات با موفقیت ذخیره شد');
    } catch (e: any) {
      if (e && typeof e === 'object' && 'status' in e && 'message' in e) {
        toast.error(e.message || 'خطا در ذخیره اطلاعات');
      } else {
        toast.error('خطا در ذخیره اطلاعات');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'درباره ما', href: '/admin/about-us', active: true },
        ]}
      />
      <form
        onSubmit={handleSubmit(
          submitWithErrorHandling(onSubmit, (error) => {
            toast.error(error?.message || 'خطا در ذخیره اطلاعات');
          })
        )}
        className="mt-8 space-y-6"
      >
        {globalError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-100 p-4 text-sm text-red-700">
            {globalError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            id="phone"
            label="شماره تماس"
            placeholder="شماره تماس را وارد کنید"
            required
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            id="email"
            label="ایمیل"
            placeholder="ایمیل را وارد کنید"
            required
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
        <div className="w-full">
          <Input
            id="address"
            label="آدرس"
            placeholder="آدرس را وارد کنید"
            required
            error={errors.address?.message}
            {...register('address')}
          />
        </div>
        <div className="w-full">
          <Textarea
            id="about_us"
            label="درباره ما"
            placeholder="درباره ما را وارد کنید"
            required
            error={errors.about_us?.message}
            {...register('about_us')}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Textarea
            id="our_mission"
            label="ماموریت ما"
            placeholder="ماموریت ما را وارد کنید"
            required
            error={errors.our_mission?.message}
            {...register('our_mission')}
          />
          <Textarea
            id="our_vision"
            label="چشم انداز ما"
            placeholder="چشم انداز ما را وارد کنید"
            required
            error={errors.our_vision?.message}
            {...register('our_vision')}
          />
        </div>
        <div className="w-full">
          <Input
            id="footer_text"
            label="متن فوتر"
            placeholder="متن فوتر را وارد کنید"
            required
            error={errors.footer_text?.message}
            {...register('footer_text')}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="submit" loading={isSubmitting}>
            ذخیره تغییرات
          </Button>
        </div>
      </form>
    </main>
  );
}
