import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

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

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.refresh();
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-2 transition hover:bg-gray-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
          {userName.charAt(0).toUpperCase()}
        </div>
      </button>

      {isOpen && (
        <div className="ring-opacity-5 absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black">
          <div className="py-1">
            <div className="border-b px-4 py-2 text-sm text-gray-700">
              {userName}
            </div>
            <Button
              onClick={handleLogout}
              className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              خروج
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
