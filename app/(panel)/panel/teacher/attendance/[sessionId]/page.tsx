import { AttendanceSessionPage } from "@/components/attendance/session-page";

export default async function TeacherAttendanceSessionRoute({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <AttendanceSessionPage role="teacher" sessionId={sessionId} />;
}
