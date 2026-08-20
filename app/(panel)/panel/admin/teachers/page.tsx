import { UserListPage } from "@/components/users/user-list-page";

export default async function TeachersPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const query = await searchParams;
  return <UserListPage role="teacher" toastKey={query.toast} />;
}
