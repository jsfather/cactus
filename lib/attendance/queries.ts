import { and, asc, desc, eq, ilike, ne, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import {
  sessionStudentRecords,
  termEnrollments,
  termLevels,
  termSessions,
  termTeachers,
  terms,
  users,
} from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { getTehranTodayIso } from "@/lib/date/local";
import { escapeLikePattern } from "@/lib/panel/pagination";

const localizedUserName = (locale: Locale) => locale === "fa"
  ? sql<string>`concat_ws(' ', ${users.firstNameFa}, ${users.lastNameFa})`
  : sql<string>`concat_ws(' ', ${users.firstNameEn}, ${users.lastNameEn})`;

export type AttendanceWorkspaceView = "today" | "needs_action" | "upcoming" | "all";

export type AttendanceTaskSession = {
  id: string;
  termId: string;
  termTitleFa: string;
  termTitleEn: string | null;
  levelTitleFa: string;
  levelTitleEn: string | null;
  termStatus: "draft" | "enrollment_open" | "active" | "completed" | "cancelled";
  sessionDate: string;
  startTime: string;
  endTime: string;
  sequence: number;
  gradeMax: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  gradedCount: number;
  recordedCount: number;
  eligibleCount: number;
};

export type StudentUpcomingSession = {
  id: string;
  termId: string;
  termTitleFa: string;
  termTitleEn: string | null;
  levelTitleFa: string;
  levelTitleEn: string | null;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sequence: number;
  deliveryMode: "in_person" | "online" | "hybrid";
  locationFa: string | null;
  locationEn: string | null;
  meetingUrl: string | null;
};

export async function getStudentUpcomingSessions(studentId: string, limit = 4): Promise<StudentUpcomingSession[]> {
  const today = getTehranTodayIso();
  return getDatabase()
    .select({
      id: termSessions.id,
      termId: terms.id,
      termTitleFa: terms.titleFa,
      termTitleEn: terms.titleEn,
      levelTitleFa: termLevels.titleFa,
      levelTitleEn: termLevels.titleEn,
      sessionDate: termSessions.sessionDate,
      startTime: termSessions.startTime,
      endTime: termSessions.endTime,
      sequence: termSessions.sequence,
      deliveryMode: terms.deliveryMode,
      locationFa: terms.locationFa,
      locationEn: terms.locationEn,
      meetingUrl: terms.meetingUrl,
    })
    .from(termEnrollments)
    .innerJoin(terms, eq(termEnrollments.termId, terms.id))
    .innerJoin(termLevels, eq(terms.levelId, termLevels.id))
    .innerJoin(termSessions, eq(termSessions.termId, terms.id))
    .where(and(
      eq(termEnrollments.studentId, studentId),
      eq(termEnrollments.status, "active"),
      or(eq(terms.status, "active"), eq(terms.status, "enrollment_open")),
      sql`${termEnrollments.enrolledAt}::date <= ${termSessions.sessionDate}`,
      sql`${termSessions.sessionDate} >= ${today}::date`,
    ))
    .orderBy(asc(termSessions.sessionDate), asc(termSessions.startTime))
    .limit(Math.min(Math.max(limit, 1), 10));
}

export async function getAttendanceSessions({
  teacherId,
  termId,
  view = "today",
  query = "",
  limit = 200,
}: {
  teacherId?: string;
  termId?: string;
  view?: AttendanceWorkspaceView;
  query?: string;
  limit?: number;
} = {}): Promise<AttendanceTaskSession[]> {
  const today = getTehranTodayIso();
  const search = query.trim().slice(0, 100);
  const pattern = `%${escapeLikePattern(search)}%`;
  const eligibleCount = sql<number>`(
    select count(*)::int
    from ${termEnrollments} enrollment
    where enrollment.term_id = ${termSessions.termId}
      and enrollment.enrolled_at::date <= ${termSessions.sessionDate}
  )`;
  const recordedCount = sql<number>`count(${sessionStudentRecords.id}) filter (where ${sessionStudentRecords.attendance} is not null)::int`;
  const results = await getDatabase()
    .select({
      id: termSessions.id,
      termId: terms.id,
      termTitleFa: terms.titleFa,
      termTitleEn: terms.titleEn,
      levelTitleFa: termLevels.titleFa,
      levelTitleEn: termLevels.titleEn,
      termStatus: terms.status,
      sessionDate: termSessions.sessionDate,
      startTime: termSessions.startTime,
      endTime: termSessions.endTime,
      sequence: termSessions.sequence,
      gradeMax: termSessions.gradeMax,
      presentCount: sql<number>`count(${sessionStudentRecords.id}) filter (where ${sessionStudentRecords.attendance} = 'present')::int`,
      absentCount: sql<number>`count(${sessionStudentRecords.id}) filter (where ${sessionStudentRecords.attendance} = 'absent')::int`,
      lateCount: sql<number>`count(${sessionStudentRecords.id}) filter (where ${sessionStudentRecords.attendance} = 'late')::int`,
      excusedCount: sql<number>`count(${sessionStudentRecords.id}) filter (where ${sessionStudentRecords.attendance} = 'excused')::int`,
      gradedCount: sql<number>`count(${sessionStudentRecords.id}) filter (where ${sessionStudentRecords.grade} is not null)::int`,
      recordedCount,
      eligibleCount,
    })
    .from(termSessions)
    .innerJoin(terms, eq(termSessions.termId, terms.id))
    .innerJoin(termLevels, eq(terms.levelId, termLevels.id))
    .leftJoin(sessionStudentRecords, eq(sessionStudentRecords.sessionId, termSessions.id))
    .where(and(
      ne(terms.status, "cancelled"),
      view === "all" ? undefined : or(eq(terms.status, "active"), eq(terms.status, "enrollment_open")),
      termId ? eq(terms.id, termId) : undefined,
      teacherId ? sql`exists (
        select 1 from ${termTeachers} assignment
        where assignment.term_id = ${terms.id}
          and assignment.teacher_id = ${teacherId}::uuid
      )` : undefined,
      view === "today" ? eq(termSessions.sessionDate, today) : undefined,
      view === "needs_action" ? sql`${termSessions.sessionDate} <= ${today}::date` : undefined,
      view === "upcoming" ? sql`${termSessions.sessionDate} > ${today}::date` : undefined,
      search ? or(
        ilike(terms.titleFa, pattern),
        ilike(terms.titleEn, pattern),
        ilike(termLevels.titleFa, pattern),
        ilike(termLevels.titleEn, pattern),
      ) : undefined,
    ))
    .groupBy(termSessions.id, terms.id, termLevels.id)
    .having(view === "needs_action" ? sql`${eligibleCount} > 0 and ${recordedCount} < ${eligibleCount}` : undefined)
    .orderBy(
      view === "today" || view === "upcoming" ? asc(termSessions.sessionDate) : desc(termSessions.sessionDate),
      asc(termSessions.startTime),
    )
    .limit(Math.min(Math.max(limit, 1), 200));
  return results;
}

export async function getTermSession(sessionId: string) {
  const [session] = await getDatabase()
    .select({
      id: termSessions.id,
      termId: terms.id,
      termTitleFa: terms.titleFa,
      termTitleEn: terms.titleEn,
      termStatus: terms.status,
      levelTitleFa: termLevels.titleFa,
      levelTitleEn: termLevels.titleEn,
      sessionDate: termSessions.sessionDate,
      startTime: termSessions.startTime,
      endTime: termSessions.endTime,
      sequence: termSessions.sequence,
      gradeMax: termSessions.gradeMax,
    })
    .from(termSessions)
    .innerJoin(terms, eq(termSessions.termId, terms.id))
    .innerJoin(termLevels, eq(terms.levelId, termLevels.id))
    .where(eq(termSessions.id, sessionId))
    .limit(1);
  return session ?? null;
}

export async function getSessionRoster(sessionId: string, termId: string, sessionDate: string, locale: Locale) {
  return getDatabase()
    .select({
      enrollmentId: termEnrollments.id,
      enrollmentStatus: termEnrollments.status,
      studentId: users.id,
      studentName: localizedUserName(locale),
      mobile: users.mobile,
      avatarUrl: users.avatarUrl,
      attendance: sessionStudentRecords.attendance,
      grade: sessionStudentRecords.grade,
      note: sessionStudentRecords.note,
      updatedAt: sessionStudentRecords.updatedAt,
    })
    .from(termEnrollments)
    .innerJoin(users, eq(termEnrollments.studentId, users.id))
    .leftJoin(
      sessionStudentRecords,
      and(
        eq(sessionStudentRecords.sessionId, sessionId),
        eq(sessionStudentRecords.studentId, users.id),
      ),
    )
    .where(and(
      eq(termEnrollments.termId, termId),
      sql`${termEnrollments.enrolledAt}::date <= ${sessionDate}::date`,
    ))
    .orderBy(
      sql`case when ${termEnrollments.status} = 'active' then 0 else 1 end`,
      asc(users.firstNameFa),
      asc(users.lastNameFa),
    );
}
