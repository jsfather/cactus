'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';

export default function UnauthorizedPage() {
  const { role, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleGoToDashboard = () => {
    if (!isAuthenticated) {
      router.push('/send-otp');
      return;
    }

    switch (role) {
      case 'admin':
        router.push('/admin');
        break;
      case 'manager':
        router.push('/manager');
        break;
      case 'student':
        router.push('/student');
        break;
      default:
        router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">عدم دسترسی</h1>
          <p className="text-gray-600">
            شما اجازه دسترسی به این صفحه را ندارید.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleGoToDashboard} className="w-full">
            {isAuthenticated ? 'بازگشت به داشبورد' : 'ورود به حساب کاربری'}
          </Button>

          <Button
            variant="secondary"
            onClick={() => router.push('/')}
            className="w-full"
          >
            بازگشت به صفحه اصلی
          </Button>
        </div>

        {isAuthenticated && role && (
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              نقش شما:{' '}
              <span className="font-semibold">{getRoleName(role)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getRoleName(role: string): string {
  switch (role) {
    case 'admin':
      return 'مدیر سیستم';
    case 'manager':
      return 'مدیر';
    case 'student':
      return 'دانشجو';
    default:
      return role;
  }
}
