import { and, asc, desc, eq, ilike, inArray, ne, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import {
  termEnrollments,
  termInvitations,
  termLevels,
  termPrerequisites,
  termSchedules,
  termTeachers,
  terms,
  users,
  type TermStatus,
} from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { escapeLikePattern } from "@/lib/panel/pagination";
import { hashTermInvitationToken } from "./invitations";

const localizedUserName = (locale: Locale) => locale === "fa"
  ? sql<string>`concat_ws(' ', ${users.firstNameFa}, ${users.lastNameFa})`
  : sql<string>`concat_ws(' ', ${users.firstNameEn}, ${users.lastNameEn})`;

export async function getTermLevels() {
  return getDatabase().select().from(termLevels).orderBy(asc(termLevels.sortOrder));
}

export async function getTermLevel(levelId: string) {
  const [level] = await getDatabase().select().from(termLevels).where(eq(termLevels.id, levelId)).limit(1);
  return level ?? null;
}

export async function getActiveTeachers(locale: Locale) {
  return getDatabase()
    .select({ id: users.id, name: localizedUserName(locale), mobile: users.mobile })
    .from(users)
    .where(and(eq(users.role, "teacher"), eq(users.isActive, true)))
    .orderBy(asc(users.firstNameFa), asc(users.lastNameFa));
}

export async function getActiveStudents(locale: Locale) {
  return getDatabase()
    .select({ id: users.id, name: localizedUserName(locale), mobile: users.mobile })
    .from(users)
    .where(and(eq(users.role, "student"), eq(users.isActive, true)))
    .orderBy(asc(users.firstNameFa), asc(users.lastNameFa));
}

export async function getAdminTerms(locale: Locale, status: TermStatus | "all" = "all", query = "") {
  const search = query.trim().slice(0, 100);
  const pattern = `%${escapeLikePattern(search)}%`;
  return getDatabase()
    .select({
      id: terms.id,
      titleFa: terms.titleFa,
      titleEn: terms.titleEn,
      status: terms.status,
      deliveryMode: terms.deliveryMode,
      startDate: terms.startDate,
      endDate: terms.endDate,
      capacity: terms.capacity,
      levelTitleFa: termLevels.titleFa,
      levelTitleEn: termLevels.titleEn,
      teacherCount: sql<number>`count(distinct ${termTeachers.teacherId})::int`,
      studentCount: sql<number>`count(distinct ${termEnrollments.studentId}) filter (where ${termEnrollments.status} = 'active')::int`,
      scheduleCount: sql<number>`count(distinct ${termSchedules.id})::int`,
    })
    .from(terms)
    .innerJoin(termLevels, eq(terms.levelId, termLevels.id))
    .leftJoin(termTeachers, eq(termTeachers.termId, terms.id))
    .leftJoin(termEnrollments, eq(termEnrollments.termId, terms.id))
    .leftJoin(termSchedules, eq(termSchedules.termId, terms.id))
    .where(and(
      status === "all" ? undefined : eq(terms.status, status),
      search ? or(ilike(terms.titleFa, pattern), ilike(terms.titleEn, pattern), ilike(termLevels.titleFa, pattern), ilike(termLevels.titleEn, pattern)) : undefined,
    ))
    .groupBy(terms.id, termLevels.id)
    .orderBy(desc(terms.startDate), desc(terms.createdAt));
}

export async function getTermOptions(locale: Locale, excludeTermId?: string) {
  const [levels, teachers, prerequisiteTerms] = await Promise.all([
    getTermLevels(),
    getActiveTeachers(locale),
    getDatabase()
      .select({ id: terms.id, titleFa: terms.titleFa, titleEn: terms.titleEn, startDate: terms.startDate })
      .from(terms)
      .where(excludeTermId ? ne(terms.id, excludeTermId) : undefined)
      .orderBy(desc(terms.startDate), asc(terms.titleFa)),
  ]);
  return { levels, teachers, prerequisiteTerms };
}

export async function getTerm(termId: string) {
  const database = getDatabase();
  const [term] = await database.select().from(terms).where(eq(terms.id, termId)).limit(1);
  if (!term) return null;
  const [teachers, prerequisites, schedules] = await Promise.all([
    database.select({ teacherId: termTeachers.teacherId }).from(termTeachers).where(eq(termTeachers.termId, termId)),
    database.select({ prerequisiteTermId: termPrerequisites.prerequisiteTermId }).from(termPrerequisites).where(eq(termPrerequisites.termId, termId)),
    database.select().from(termSchedules).where(eq(termSchedules.termId, termId)).orderBy(asc(termSchedules.dayOfWeek), asc(termSchedules.startTime)),
  ]);
  return {
    ...term,
    teacherIds: teachers.map((item) => item.teacherId),
    prerequisiteIds: prerequisites.map((item) => item.prerequisiteTermId),
    schedules,
  };
}

export async function getTermRoster(termId: string, locale: Locale) {
  return getDatabase()
    .select({
      enrollmentId: termEnrollments.id,
      studentId: users.id,
      studentName: localizedUserName(locale),
      mobile: users.mobile,
      status: termEnrollments.status,
      source: termEnrollments.source,
      enrolledAt: termEnrollments.enrolledAt,
    })
    .from(termEnrollments)
    .innerJoin(users, eq(termEnrollments.studentId, users.id))
    .where(eq(termEnrollments.termId, termId))
    .orderBy(asc(users.firstNameFa), asc(users.lastNameFa));
}

export async function getTermInvitations(termId: string) {
  return getDatabase()
    .select({ id: termInvitations.id, expiresAt: termInvitations.expiresAt, maxUses: termInvitations.maxUses, useCount: termInvitations.useCount, revokedAt: termInvitations.revokedAt, createdAt: termInvitations.createdAt })
    .from(termInvitations)
    .where(eq(termInvitations.termId, termId))
    .orderBy(desc(termInvitations.createdAt));
}

export async function isTeacherAssignedToTerm(termId: string, teacherId: string) {
  const [assignment] = await getDatabase()
    .select({ termId: termTeachers.termId })
    .from(termTeachers)
    .where(and(eq(termTeachers.termId, termId), eq(termTeachers.teacherId, teacherId)))
    .limit(1);
  return Boolean(assignment);
}

export async function getUserTermSchedule(userId: string, role: "teacher" | "student") {
  const database = getDatabase();
  const termIds = role === "teacher"
    ? database.select({ termId: termTeachers.termId }).from(termTeachers).where(eq(termTeachers.teacherId, userId))
    : database.select({ termId: termEnrollments.termId }).from(termEnrollments).where(and(eq(termEnrollments.studentId, userId), eq(termEnrollments.status, "active")));
  return database
    .select({
      termId: terms.id,
      titleFa: terms.titleFa,
      titleEn: terms.titleEn,
      status: terms.status,
      deliveryMode: terms.deliveryMode,
      startDate: terms.startDate,
      endDate: terms.endDate,
      locationFa: terms.locationFa,
      locationEn: terms.locationEn,
      meetingUrl: terms.meetingUrl,
      dayOfWeek: termSchedules.dayOfWeek,
      startTime: termSchedules.startTime,
      endTime: termSchedules.endTime,
    })
    .from(terms)
    .innerJoin(termSchedules, eq(termSchedules.termId, terms.id))
    .where(and(inArray(terms.id, termIds), or(eq(terms.status, "enrollment_open"), eq(terms.status, "active"))))
    .orderBy(asc(termSchedules.dayOfWeek), asc(termSchedules.startTime), asc(terms.titleFa));
}

export async function getTeacherTerms(teacherId: string) {
  return getDatabase()
    .select({
      id: terms.id,
      titleFa: terms.titleFa,
      titleEn: terms.titleEn,
      status: terms.status,
      startDate: terms.startDate,
      endDate: terms.endDate,
      capacity: terms.capacity,
      levelTitleFa: termLevels.titleFa,
      levelTitleEn: termLevels.titleEn,
      studentCount: sql<number>`count(distinct ${termEnrollments.studentId}) filter (where ${termEnrollments.status} = 'active')::int`,
    })
    .from(termTeachers)
    .innerJoin(terms, eq(termTeachers.termId, terms.id))
    .innerJoin(termLevels, eq(terms.levelId, termLevels.id))
    .leftJoin(termEnrollments, eq(termEnrollments.termId, terms.id))
    .where(eq(termTeachers.teacherId, teacherId))
    .groupBy(terms.id, termLevels.id)
    .orderBy(desc(terms.startDate));
}

export async function getPrerequisiteNames(termId: string, locale: Locale) {
  const prerequisite = getDatabase().$with("prerequisite").as(
    getDatabase().select({ id: termPrerequisites.prerequisiteTermId }).from(termPrerequisites).where(eq(termPrerequisites.termId, termId)),
  );
  return getDatabase().with(prerequisite).select({ id: terms.id, title: locale === "fa" ? terms.titleFa : sql<string>`coalesce(${terms.titleEn}, ${terms.titleFa})` }).from(terms).innerJoin(prerequisite, eq(terms.id, prerequisite.id));
}

export async function getTermInvitationPreview(token: string, locale: Locale) {
  const [invitation] = await getDatabase()
    .select({
      id: termInvitations.id,
      termId: terms.id,
      titleFa: terms.titleFa,
      titleEn: terms.titleEn,
      startDate: terms.startDate,
      endDate: terms.endDate,
      status: terms.status,
      levelFa: termLevels.titleFa,
      levelEn: termLevels.titleEn,
      expiresAt: termInvitations.expiresAt,
      maxUses: termInvitations.maxUses,
      useCount: termInvitations.useCount,
      revokedAt: termInvitations.revokedAt,
    })
    .from(termInvitations)
    .innerJoin(terms, eq(termInvitations.termId, terms.id))
    .innerJoin(termLevels, eq(terms.levelId, termLevels.id))
    .where(eq(termInvitations.tokenHash, hashTermInvitationToken(token)))
    .limit(1);
  if (!invitation) return null;
  return {
    ...invitation,
    title: locale === "en" ? invitation.titleEn || invitation.titleFa : invitation.titleFa,
    level: locale === "en" ? invitation.levelEn || invitation.levelFa : invitation.levelFa,
    usable: !invitation.revokedAt && invitation.expiresAt > new Date() && invitation.status === "enrollment_open" && (invitation.maxUses === null || invitation.useCount < invitation.maxUses),
  };
}
