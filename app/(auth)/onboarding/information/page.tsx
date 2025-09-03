'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOnboardingStore } from '@/app/lib/stores/onboarding.store';
import { User, Calendar, Mail, Phone, FileText, Heart, Brain, Focus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { convertToEnglishNumbers, isNumeric } from '@/app/lib/utils/persian';

export default function OnboardingInformationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone: phone,
    email: '',
    national_code: '',
    father_name: '',
    mother_name: '',
    father_job: '',
    mother_job: '',
    has_allergy: '0',
    allergy_details: '',
    interest_level: '50',
    focus_level: '50',
    birth_date: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { submitInformation, loading } = useOnboardingStore();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.first_name.trim()) newErrors.first_name = 'نام الزامی است';
    if (!formData.last_name.trim()) newErrors.last_name = 'نام خانوادگی الزامی است';
    if (!formData.username.trim()) newErrors.username = 'نام کاربری الزامی است';
    if (!formData.national_code.trim()) newErrors.national_code = 'کد ملی الزامی است';
    if (!formData.father_name.trim()) newErrors.father_name = 'نام پدر الزامی است';
    if (!formData.mother_name.trim()) newErrors.mother_name = 'نام مادر الزامی است';
    if (!formData.father_job.trim()) newErrors.father_job = 'شغل پدر الزامی است';
    if (!formData.mother_job.trim()) newErrors.mother_job = 'شغل مادر الزامی است';
    if (!formData.birth_date.trim()) newErrors.birth_date = 'تاریخ تولد الزامی است';

    // National code validation
    if (formData.national_code.trim()) {
      const normalizedNationalCode = convertToEnglishNumbers(formData.national_code.trim());
      if (!isNumeric(formData.national_code.trim())) {
        newErrors.national_code = 'کد ملی فقط باید شامل ارقام باشد';
      } else if (normalizedNationalCode.length !== 10) {
        newErrors.national_code = 'کد ملی باید دقیقا ۱۰ رقم باشد';
      }
    }

    // Email validation (optional)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'فرمت ایمیل صحیح نیست';
      }
    }

    // Username validation
    if (formData.username.trim()) {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(formData.username.trim())) {
        newErrors.username = 'نام کاربری فقط باید شامل حروف انگلیسی، اعداد و آندرلاین باشد';
      } else if (formData.username.trim().length < 3) {
        newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';
      }
    }

    // Allergy details validation
    if (formData.has_allergy === '1' && !formData.allergy_details.trim()) {
      newErrors.allergy_details = 'جزئیات آلرژی الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Special handling for numeric fields
    if (name === 'national_code') {
      const digitsOnly = value.replace(/[^0-9۰-۹٠-٩]/g, '');
      const limited = digitsOnly.slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: limited }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('لطفا خطاهای فرم را اصلاح کنید');
      return;
    }

    try {
      // Convert Persian/Arabic numbers to English
      const payload = {
        ...formData,
        national_code: convertToEnglishNumbers(formData.national_code.trim()),
        interest_level: convertToEnglishNumbers(formData.interest_level),
        focus_level: convertToEnglishNumbers(formData.focus_level),
      };

      const response = await submitInformation(payload);
      toast.success(response.message || 'اطلاعات با موفقیت ثبت شد');
      router.push(`/onboarding/documents?phone=${encodeURIComponent(phone)}`);
    } catch (error) {
      console.error('Information submission error:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          تکمیل اطلاعات فردی
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          لطفا اطلاعات شخصی خود را کامل کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">اطلاعات شخصی</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                نام *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 pr-10 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
                  placeholder="نام خود را وارد کنید"
                />
              </div>
              {errors.first_name && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.first_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                نام خانوادگی *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
                placeholder="نام خانوادگی خود را وارد کنید"
              />
              {errors.last_name && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                نام کاربری *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
                placeholder="نام کاربری منحصر به فرد"
                dir="ltr"
              />
              {errors.username && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                شماره همراه
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-gray-200/50 p-3 pr-10 text-gray-500 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-400"
                  disabled
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ایمیل
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 pr-10 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
                  placeholder="example@domain.com"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                کد ملی *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="national_code"
                  value={formData.national_code}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 pr-10 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
                  placeholder="کد ملی ۱۰ رقمی"
                  dir="ltr"
                />
              </div>
              {errors.national_code && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.national_code}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              تاریخ تولد *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleInputChange}
                className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 pr-10 text-gray-900 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white"
              />
            </div>
            {errors.birth_date && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.birth_date}</p>
            )}
          </div>
        </div>

        {/* Family Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">اطلاعات خانوادگی</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                نام پدر *
              </label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleInputChange}
                className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
                placeholder="نام پدر"
              />
              {errors.father_name && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.father_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                نام مادر *
              </label>
              <input
                type="text"
                name="mother_name"
                value={formData.mother_name}
                onChange={handleInputChange}
                className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
                placeholder="نام مادر"
              />
              {errors.mother_name && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.mother_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                شغل پدر *
              </label>
              <input
                type="text"
                name="father_job"
                value={formData.father_job}
                onChange={handleInputChange}
                className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
                placeholder="شغل پدر"
              />
              {errors.father_job && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.father_job}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                شغل مادر *
              </label>
              <input
                type="text"
                name="mother_job"
                value={formData.mother_job}
                onChange={handleInputChange}
                className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
                placeholder="شغل مادر"
              />
              {errors.mother_job && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.mother_job}</p>
              )}
            </div>
          </div>
        </div>

        {/* Health & Personal Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">اطلاعات سلامت و شخصیتی</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              آیا آلرژی دارید؟ *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="has_allergy"
                  value="1"
                  checked={formData.has_allergy === '1'}
                  onChange={handleInputChange}
                  className="text-primary-600 focus:ring-primary-500 mr-2"
                />
                بله
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="has_allergy"
                  value="0"
                  checked={formData.has_allergy === '0'}
                  onChange={handleInputChange}
                  className="text-primary-600 focus:ring-primary-500 mr-2"
                />
                خیر
              </label>
            </div>
          </div>

          {formData.has_allergy === '1' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                جزئیات آلرژی *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 top-3 flex items-start pr-3">
                  <Heart className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="allergy_details"
                  value={formData.allergy_details}
                  onChange={handleInputChange}
                  rows={3}
                  className="focus:border-primary-500 focus:ring-primary-500/20 block w-full rounded-lg border border-gray-300 bg-white/50 p-3 pr-10 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:text-white dark:placeholder-gray-400"
                  placeholder="جزئیات آلرژی خود را بنویسید"
                />
              </div>
              {errors.allergy_details && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.allergy_details}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                سطح علاقه (۱-۱۰۰) *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Brain className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="range"
                  name="interest_level"
                  min="1"
                  max="100"
                  value={formData.interest_level}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {formData.interest_level}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                سطح تمرکز (۱-۱۰۰) *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Focus className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="range"
                  name="focus_level"
                  min="1"
                  max="100"
                  value={formData.focus_level}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {formData.focus_level}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 relative w-full transform rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </span>
              درحال ثبت اطلاعات...
            </>
          ) : (
            'ادامه'
          )}
        </button>
      </form>
    </div>
  );
}
