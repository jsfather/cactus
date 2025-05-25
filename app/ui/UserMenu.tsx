'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from './LogoutButton';
import { LayoutDashboard, GraduationCap } from 'lucide-react';

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
        className="flex cursor-pointer items-center gap-2 rounded-full p-2 transition hover:bg-gray-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
          {userName.charAt(0).toUpperCase()}
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white shadow-lg">
          <div className="py-2">
            <div className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
              <div className="font-medium">{userName}</div>
              <div className="mt-1 text-xs text-gray-500">حساب کاربری</div>
            </div>
            <button
              onClick={() => {
                router.push('/admin');
                setIsOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-2 p-3 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <LayoutDashboard
                className="mr-3 h-5 w-5 text-green-600"
                strokeWidth={1.7}
              />
              <span>داشبورد ادمین</span>
            </button>
            <button
              onClick={() => {
                router.push('/teacher');
                setIsOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-2 p-3 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <GraduationCap
                className="mr-3 h-5 w-5 text-green-600"
                strokeWidth={1.7}
              />
              <span>داشبورد مدرس</span>
            </button>
            <div className="px-3">
              <div className="my-1 h-px bg-gray-100" />
            </div>
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
