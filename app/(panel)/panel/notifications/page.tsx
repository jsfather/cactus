import { NotificationsPage } from "@/components/workflows/support-pages";
export default async function Page({searchParams}: {searchParams: Promise<{page?: string; filter?: string}>}) {
 const query = await searchParams;
 return <NotificationsPage page={Number(query.page ?? 1)} filter={query.filter === "unread" || query.filter === "read" ? query.filter : ""}/>;
}
