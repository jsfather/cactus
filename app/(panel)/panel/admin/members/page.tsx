import { UserListPage } from "@/components/users/user-list-page";
import type { AdminListSearchParams } from "@/lib/panel/pagination";

export default async function MembersPage({ searchParams }: { searchParams: Promise<AdminListSearchParams> }) {
  return <UserListPage role="member" searchParams={await searchParams} />;
}
