import { UserListPage } from "@/components/users/user-list-page";
import type { AdminListSearchParams } from "@/lib/panel/pagination";

export default async function TeachersPage({ searchParams }: { searchParams: Promise<AdminListSearchParams> }) {
  return <UserListPage role="teacher" searchParams={await searchParams} />;
}
