'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectToNew() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the [id] route with id="new"
    router.replace('/admin/products/new');
  }, [router]);

  return null;
}
