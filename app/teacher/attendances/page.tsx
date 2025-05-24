import Pagination from '@/components/ui/pagination';
import Search from '@/components/ui/search';
import Table from '@/components/ui/teacher/attendances/table';
import { CreateAttendance } from '@/components/ui/teacher/attendances/buttons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'حضور و غیاب', 
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">حضور و غیاب</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="جستجوی حضور و غیاب" />
        <CreateAttendance />
      </div>
      <Table query={query} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
