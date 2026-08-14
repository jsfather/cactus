import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import OfflineSessionForm from '@/app/components/teacher/OfflineSessionForm';

export default function NewOfflineSessionPage() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'کلاس‌های آفلاین', href: '/teacher/offline-sessions' },
          {
            label: 'کلاس جدید',
            href: '/teacher/offline-sessions/new',
            active: true,
          },
        ]}
      />
      <h1 className="mt-8 text-2xl font-bold text-gray-900 dark:text-white">
        ایجاد کلاس آفلاین
      </h1>
      <OfflineSessionForm />
    </main>
  );
}
