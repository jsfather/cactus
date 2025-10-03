'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/Card';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { apiClient } from '@/app/lib/api/client';
import { AlertCircle, FileText, HelpCircle } from 'lucide-react';

interface PanelGuide {
  id: number;
  title: string;
  description: string;
  file?: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export default function StudentGuidesPage() {
  const [guides, setGuides] = useState<PanelGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        // We'll filter for student guides on the frontend since we can't modify the API
        const response = await apiClient.get<{ data: PanelGuide[] }>(
          'panel-guides'
        );

        if (response && response.data) {
          // Filter guides for students
          const studentGuides = response.data.filter(
            (guide) => guide.type === 'student' || guide.type === 'all'
          );
          setGuides(studentGuides);
        }
      } catch (error) {
        console.error('Error fetching guides:', error);
        setError('خطا در بارگذاری راهنماها');
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const breadcrumbItems = [
    { label: 'داشبورد', href: '/student/dashboard' },
    { label: 'راهنمای کار با پنل', href: '/student/guides', active: true },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
        <div className="flex min-h-[400px] items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
        <Card className="p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              خطا در بارگذاری راهنماها
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!guides || guides.length === 0) {
    return (
      <div className="space-y-6">
        <Breadcrumbs breadcrumbs={breadcrumbItems} />
        <Card className="p-8">
          <div className="text-center">
            <HelpCircle className="mx-auto mb-4 h-16 w-16 text-blue-500" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              راهنمایی در دسترس نیست
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              در حال حاضر راهنمایی برای دانش‌پژوها موجود نیست.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          راهنمای کار با پنل
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Card
            key={guide.id}
            className="p-6 transition-shadow hover:shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {guide.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    {new Date(guide.created_at).toLocaleDateString('fa-IR')}
                  </span>
                  {guide.file && (
                    <a
                      href={guide.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      دانلود فایل
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
