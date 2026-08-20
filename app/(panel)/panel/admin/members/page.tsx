import { UserListPage } from "@/components/users/user-list-page";

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const query = await searchParams;
  return <UserListPage role="member" toastKey={query.toast} />;
}
