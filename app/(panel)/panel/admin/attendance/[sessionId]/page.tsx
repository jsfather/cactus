import { AttendanceSessionPage } from "@/components/attendance/session-page";

export default async function AdminAttendanceSessionRoute({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <AttendanceSessionPage role="admin" sessionId={sessionId} />;
}
