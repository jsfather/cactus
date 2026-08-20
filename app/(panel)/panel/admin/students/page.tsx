import { UserListPage } from "@/components/users/user-list-page";

export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const query = await searchParams;
  return <UserListPage role="student" toastKey={query.toast} />;
}
