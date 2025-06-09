'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import Image from 'next/image';

export default function DocumentUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement API call to upload document
    // For now, just navigate to dashboard
    router.push('/admin/dashboard');
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          آپلود مدارک
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          لطفا تصویر کارت ملی خود را آپلود کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="file"
              id="document"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {!preview ? (
              <label
                htmlFor="document"
                className="focus:border-primary-500 focus:ring-primary-500/20 group flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm transition-all hover:border-gray-400 focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-900/50 dark:hover:border-gray-500"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="mb-3 h-12 w-12 text-gray-400 transition-colors group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">برای آپلود کلیک کنید</span> یا فایل را اینجا رها کنید
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG یا JPEG (حداکثر 5MB)
                  </p>
                </div>
              </label>
            ) : (
              <div className="relative">
                <Image
                  src={preview}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {file && (
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                  <ImageIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {file.name}
                  </p>
                  <p className="text-sm text-green-500 dark:text-green-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 relative w-full transform rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </span>
              در حال آپلود...
            </>
          ) : (
            'تکمیل ثبت نام'
          )}
        </button>
      </form>
    </div>
  );
} 