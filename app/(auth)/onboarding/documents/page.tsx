'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOnboardingStore } from '@/app/lib/stores/onboarding.store';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function OnboardingDocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  const [files, setFiles] = useState<{
    national_card: globalThis.File | null;
    certificate: globalThis.File | null;
  }>({
    national_card: null,
    certificate: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { uploadDocuments, loading } = useOnboardingStore();

  const validateFiles = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!files.national_card) {
      newErrors.national_card = 'آپلود تصویر کارت ملی الزامی است';
    }

    if (!files.certificate) {
      newErrors.certificate = 'آپلود مدرک تحصیلی الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange =
    (type: 'national_card' | 'certificate') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;

      // Clear error for this field
      if (errors[type]) {
        setErrors((prev) => ({ ...prev, [type]: '' }));
      }

      if (file) {
        // Validate file type
        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'application/pdf',
        ];
        if (!allowedTypes.includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            [type]: 'فرمت فایل مجاز نیست. فقط JPG، PNG یا PDF',
          }));
          return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          setErrors((prev) => ({
            ...prev,
            [type]: 'حجم فایل نباید بیشتر از ۵ مگابایت باشد',
          }));
          return;
        }
      }

      setFiles((prev) => ({
        ...prev,
        [type]: file,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFiles()) {
      toast.error('لطفا تمام فایل‌های مورد نیاز را آپلود کنید');
      return;
    }

    try {
      const payload = {
        national_card: files.national_card!,
        certificate: files.certificate!,
      };

      const response = await uploadDocuments(payload);
      toast.success(response.message || 'مدارک با موفقیت آپلود شد');
      // Redirect to previous courses question page
      router.push(
        `/onboarding/previous-courses?phone=${encodeURIComponent(phone)}`
      );
    } catch (error) {
      console.error('Documents upload error:', error);
    }
  };

  const FileUploadBox = ({
    type,
    title,
    description,
    file,
    error,
    onChange,
  }: {
    type: 'national_card' | 'certificate';
    title: string;
    description: string;
    file: globalThis.File | null;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {title} *
      </label>
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
          error
            ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
            : file
              ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-gray-500'
        }`}
      >
        <input
          type="file"
          id={type}
          onChange={onChange}
          accept="image/jpeg,image/jpg,image/png,application/pdf"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />

        <div className="text-center">
          {file ? (
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  {file.name}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {(file.size / 1024 / 1024).toFixed(2)} مگابایت
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {error ? (
                <AlertCircle className="mb-2 h-8 w-8 text-red-500" />
              ) : (
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
              )}
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                کلیک کنید یا فایل را بکشید
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
      {error && (
        <p className="flex items-center text-sm text-red-500 dark:text-red-400">
          <AlertCircle className="ml-1 h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          آپلود مدارک
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          لطفا مدارک مورد نیاز را آپلود کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FileUploadBox
            type="national_card"
            title="تصویر کارت ملی"
            description="JPG، PNG یا PDF - حداکثر ۵ مگابایت"
            file={files.national_card}
            error={errors.national_card}
            onChange={handleFileChange('national_card')}
          />

          <FileUploadBox
            type="certificate"
            title="مدرک تحصیلی"
            description="JPG، PNG یا PDF - حداکثر ۵ مگابایت"
            file={files.certificate}
            error={errors.certificate}
            onChange={handleFileChange('certificate')}
          />
        </div>

        {/* Upload Guidelines */}
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-start">
            <FileText className="mt-0.5 ml-3 h-5 w-5 text-blue-500" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                راهنمای آپلود مدارک
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-300">
                <li>• تصاویر باید واضح و خوانا باشند</li>
                <li>• فرمت‌های مجاز: JPG، PNG، PDF</li>
                <li>• حداکثر حجم هر فایل: ۵ مگابایت</li>
                <li>• تصویر کارت ملی باید شامل هر دو طرف باشد</li>
                <li>• مدرک تحصیلی باید معتبر و قابل تایید باشد</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="focus:ring-primary-500 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            بازگشت
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 relative flex-1 transform rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </span>
                درحال آپلود...
              </>
            ) : (
              'تکمیل ثبت‌نام'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
