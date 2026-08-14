'use client';

import { useEffect, useState } from 'react';
import { FileText, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Card } from '@/app/components/ui/Card';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { panelGuideService } from '@/app/lib/services/panel-guide.service';
import type { PanelGuide } from '@/app/lib/types/panel_guide';
import { getImageUrl } from '@/app/lib/utils/image';

export default function UserGuidesPage() {
  const [guides, setGuides] = useState<PanelGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    panelGuideService
      .getPublicList()
      .then((response) => setGuides(response.data))
      .catch(() => toast.error('دریافت راهنماهای پنل انجام نشد'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'حساب کاربری', href: '/user/profile' },
          {
            label: 'راهنمای پنل',
            href: '/user/guides',
            active: true,
          },
        ]}
      />
      <h1 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
        راهنما و اطلاعیه‌های پنل
      </h1>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : guides.length === 0 ? (
        <Card className="mt-8 p-12 text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            راهنما یا اطلاعیه‌ای موجود نیست.
          </p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => {
            const fileUrl = getImageUrl(guide.file);
            return (
              <Card key={guide.id} className="p-6">
                <div className="flex items-start gap-3">
                  <FileText className="text-primary-600 mt-1 h-5 w-5" />
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {guide.title}
                    </h2>
                    <p className="mt-2 text-sm whitespace-pre-line text-gray-600 dark:text-gray-400">
                      {guide.description}
                    </p>
                  </div>
                </div>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-600 mt-5 inline-block text-sm font-medium"
                  >
                    دریافت فایل پیوست
                  </a>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
