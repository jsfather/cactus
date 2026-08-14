import { clsx } from 'clsx';
import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav
      aria-label="مسیر صفحه"
      className="mb-5 max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ol className={clsx('flex min-w-max items-center gap-1 text-sm')}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active ? 'page' : undefined}
            className="flex items-center gap-1"
          >
            {breadcrumb.active ? (
              <span className="max-w-64 truncate rounded-lg bg-gray-100 px-2.5 py-1.5 font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="inline-flex min-h-9 max-w-56 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                {index === 0 && (
                  <Home className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span className="truncate">{breadcrumb.label}</span>
              </Link>
            )}
            {index < breadcrumbs.length - 1 && (
              <ChevronLeft
                className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
