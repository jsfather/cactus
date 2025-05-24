import Pagination from '@/components/ui/pagination';
import Search from '@/components/ui/search';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'دانش آموزان',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const totalPages = 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">دانش آموزان</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />}>
          <Search placeholder="جستجوی دانش آموزان" />
        </Suspense>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Suspense fallback={<div className="h-10 animate-pulse rounded-md bg-gray-200 px-4" />}>
          <Pagination totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
}
