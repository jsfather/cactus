'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateAttendance() {
  return (
    <Link
      href="/teacher/attendances/create"
      className="bg-primary-600 hover:bg-primary-400 focus-visible:outline-primary-400 flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className="hidden md:block">ساخت حضور و غیاب</span>{' '}
      <PlusIcon className="h-5 md:mr-4" />
    </Link>
  );
}
