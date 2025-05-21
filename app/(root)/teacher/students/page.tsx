import Pagination from '@/components/ui/pagination';
import Search from '@/components/ui/search';
import { Metadata } from 'next';

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
        <Search placeholder="جستجوی دانش آموزان" />
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
