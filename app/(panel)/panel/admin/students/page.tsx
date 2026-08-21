import { UserListPage } from "@/components/users/user-list-page";
import type { AdminListSearchParams } from "@/lib/panel/pagination";

export default async function StudentsPage({ searchParams }: { searchParams: Promise<AdminListSearchParams> }) {
  return <UserListPage role="student" searchParams={await searchParams} />;
}
