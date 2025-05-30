'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface SearchProps {
  placeholder: string;
  className?: string;
  searchParamName?: string;
}

export default function Search({
  placeholder,
  className = '',
  searchParamName = 'query',
}: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set(searchParamName, term);
    } else {
      params.delete(searchParamName);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={`relative flex flex-1 flex-shrink-0 ${className}`}>
      <label htmlFor="search" className="sr-only">
        {placeholder}
      </label>
      <input
        className="peer focus:border-primary-500 block w-full rounded-md border border-gray-200 py-[9px] pr-4 text-sm outline-none placeholder:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get(searchParamName)?.toString()}
      />
      <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 dark:text-gray-400 dark:peer-focus:text-white" />
    </div>
  );
}
