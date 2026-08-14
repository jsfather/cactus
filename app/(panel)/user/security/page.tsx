'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { LockKeyhole } from 'lucide-react';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import { userService } from '@/app/lib/services/user.service';

export default function SecurityPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (form.new_password.length < 8) {
      toast.error('رمز عبور جدید باید حداقل ۸ کاراکتر باشد');
      return;
    }

    if (form.new_password !== form.new_password_confirmation) {
      toast.error('تکرار رمز عبور جدید مطابقت ندارد');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.updatePassword(form);
      toast.success(response.message || 'رمز عبور با موفقیت تغییر کرد');
      setForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch {
      toast.error('تغییر رمز عبور انجام نشد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'حساب کاربری', href: '/user/profile' },
          {
            label: 'تغییر رمز عبور',
            href: '/user/security',
            active: true,
          },
        ]}
      />
      <Card className="mx-auto mt-8 max-w-2xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <LockKeyhole className="text-primary-600 h-7 w-7" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              تغییر رمز عبور
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              برای امنیت حساب، یک رمز عبور قوی و منحصربه‌فرد انتخاب کنید.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="current_password"
            type="password"
            autoComplete="current-password"
            label="رمز عبور فعلی"
            value={form.current_password}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                current_password: event.target.value,
              }))
            }
            required
          />
          <Input
            id="new_password"
            type="password"
            autoComplete="new-password"
            label="رمز عبور جدید"
            value={form.new_password}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                new_password: event.target.value,
              }))
            }
            required
          />
          <Input
            id="new_password_confirmation"
            type="password"
            autoComplete="new-password"
            label="تکرار رمز عبور جدید"
            value={form.new_password_confirmation}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                new_password_confirmation: event.target.value,
              }))
            }
            required
          />
          <Button type="submit" loading={loading}>
            ذخیره رمز عبور جدید
          </Button>
        </form>
      </Card>
    </main>
  );
}
