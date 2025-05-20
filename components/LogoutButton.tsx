'use client';

import { Power } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      Cookies.remove('authToken');
      router.push('/auth/send-otp');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex w-full cursor-pointer items-center gap-2 p-3 text-gray-800 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <div className="relative mr-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200"></div>
          <div className="absolute left-0 top-0 h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <Power className="mr-3 h-5 w-5" strokeWidth={1.7} />
      )}
      <span>{loading ? 'در حال خروج...' : 'خروج'}</span>
    </button>
  );
} 