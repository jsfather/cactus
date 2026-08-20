import { UserListPage } from "@/components/users/user-list-page";

export default async function AdminsPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const query = await searchParams;
  return <UserListPage role="admin" toastKey={query.toast} />;
}
