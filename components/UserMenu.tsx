'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from './LogoutButton';
import { LayoutDashboard } from 'lucide-react';

interface UserMenuProps {
  userName: string;
}

export function UserMenu({ userName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
          {userName.charAt(0).toUpperCase()}
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white shadow-lg">
          <div className="py-2">
            <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
              <div className="font-medium">{userName}</div>
              <div className="text-xs text-gray-500 mt-1">حساب کاربری</div>
            </div>
            <button
              onClick={() => {
                router.push('/admin');
                setIsOpen(false);
              }}
              className="hover:bg-gray-50 flex w-full cursor-pointer items-center gap-2 p-3 text-gray-700 transition-colors"
            >
              <LayoutDashboard className="mr-3 h-5 w-5 text-green-600" strokeWidth={1.7} />
              <span>داشبورد</span>
            </button>
            <div className="px-3">
              <div className="h-px bg-gray-100 my-1" />
            </div>
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
