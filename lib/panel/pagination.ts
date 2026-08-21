export const ADMIN_PAGE_SIZE = 20;

export type AdminListSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type AdminListQuery = {
  page: number;
  q: string;
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export function getSearchParam(
  params: AdminListSearchParams,
  key: string,
): string {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function parseAdminListQuery(
  params: AdminListSearchParams,
): AdminListQuery {
  const requestedPage = Number.parseInt(getSearchParam(params, "page"), 10);

  return {
    page:
      Number.isSafeInteger(requestedPage) && requestedPage > 0
        ? Math.min(requestedPage, 100_000)
        : 1,
    q: getSearchParam(params, "q").slice(0, 100),
  };
}

export function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/g, "\\$&");
}

export function normalizePage(requestedPage: number, total: number) {
  const pageCount = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  return { page: Math.min(requestedPage, pageCount), pageCount };
}
