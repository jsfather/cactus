'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Bell, Check, ExternalLink } from 'lucide-react';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { userService } from '@/app/lib/services/user.service';
import type { UserNotification } from '@/app/lib/types/notification';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingId, setReadingId] = useState<string | number | null>(null);

  useEffect(() => {
    userService
      .getNotifications()
      .then((response) => {
        setNotifications(
          Array.isArray(response.data) ? response.data : response.data.data
        );
      })
      .catch(() => toast.error('دریافت اعلان‌ها انجام نشد'))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (notification: UserNotification) => {
    try {
      setReadingId(notification.id);
      await userService.markNotificationRead(notification.id.toString());
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read_at: new Date().toISOString() }
            : item
        )
      );
    } catch {
      toast.error('ثبت وضعیت خوانده‌شده انجام نشد');
    } finally {
      setReadingId(null);
    }
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'حساب کاربری', href: '/user/profile' },
          {
            label: 'اعلان‌ها',
            href: '/user/notifications',
            active: true,
          },
        ]}
      />
      <div className="mt-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          اعلان‌های من
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          پیام‌ها و رویدادهای حساب کاربری شما
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : notifications.length === 0 ? (
        <Card className="mt-8 p-12 text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            اعلانی برای شما وجود ندارد.
          </p>
        </Card>
      ) : (
        <div className="mt-8 space-y-4">
          {notifications.map((notification) => {
            const title =
              notification.title || notification.data?.title || 'اعلان';
            const message =
              notification.message ||
              notification.data?.message ||
              notification.data?.body ||
              '';
            const url = notification.data?.url;

            return (
              <Card
                key={notification.id}
                className={`p-5 ${notification.read_at ? '' : 'border-primary-300 bg-primary-50/30 dark:border-primary-800 dark:bg-primary-950/10'}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {String(title)}
                    </h2>
                    {message && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {String(message)}
                      </p>
                    )}
                    {notification.created_at && (
                      <p className="mt-3 text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString(
                          'fa-IR'
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {url && (
                      <Link
                        href={String(url)}
                        className="text-primary-600 inline-flex h-10 items-center gap-2 px-3 text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        مشاهده
                      </Link>
                    )}
                    {!notification.read_at && (
                      <Button
                        variant="white"
                        className="gap-2"
                        loading={readingId === notification.id}
                        onClick={() => markRead(notification)}
                      >
                        <Check className="h-4 w-4" />
                        خواندم
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
