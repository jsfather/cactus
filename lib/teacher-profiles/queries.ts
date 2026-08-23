import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import {
  teacherEducations,
  teacherProfiles,
  teacherSkills,
  teacherWorkExperiences,
  users,
} from "@/lib/db/schema";

const teacherAccountSelection = {
  id: users.id,
  mobile: users.mobile,
  email: users.email,
  firstNameFa: users.firstNameFa,
  lastNameFa: users.lastNameFa,
  firstNameEn: users.firstNameEn,
  lastNameEn: users.lastNameEn,
  avatarUrl: users.avatarUrl,
  isActive: users.isActive,
};

export async function getTeacherProfileForUser(userId: string) {
  const database = getDatabase();
  const [row] = await database
    .select({ account: teacherAccountSelection, profile: teacherProfiles })
    .from(users)
    .leftJoin(teacherProfiles, eq(teacherProfiles.userId, users.id))
    .where(and(eq(users.id, userId), eq(users.role, "teacher")))
    .limit(1);

  if (!row) return null;
  if (!row.profile) return { ...row, skills: [], workExperiences: [], educations: [] };

  const [skills, workExperiences, educations] = await Promise.all([
    database.select().from(teacherSkills).where(eq(teacherSkills.teacherProfileId, row.profile.id)).orderBy(asc(teacherSkills.sortOrder)),
    database.select().from(teacherWorkExperiences).where(eq(teacherWorkExperiences.teacherProfileId, row.profile.id)).orderBy(asc(teacherWorkExperiences.sortOrder)),
    database.select().from(teacherEducations).where(eq(teacherEducations.teacherProfileId, row.profile.id)).orderBy(asc(teacherEducations.sortOrder)),
  ]);
  return { ...row, skills, workExperiences, educations };
}

const publicTeacherSelection = {
  id: teacherProfiles.id,
  username: teacherProfiles.username,
  cityFa: teacherProfiles.cityFa,
  cityEn: teacherProfiles.cityEn,
  biographyFa: teacherProfiles.biographyFa,
  biographyEn: teacherProfiles.biographyEn,
  aboutFa: teacherProfiles.aboutFa,
  aboutEn: teacherProfiles.aboutEn,
  achievementsFa: teacherProfiles.achievementsFa,
  achievementsEn: teacherProfiles.achievementsEn,
  memberSince: teacherProfiles.memberSince,
  updatedAt: teacherProfiles.updatedAt,
  firstNameFa: users.firstNameFa,
  lastNameFa: users.lastNameFa,
  firstNameEn: users.firstNameEn,
  lastNameEn: users.lastNameEn,
  avatarUrl: users.avatarUrl,
};

export type PublicTeacher = Awaited<ReturnType<typeof getPublicTeachers>>[number];

export async function getPublicTeachers(limit?: number) {
  const database = getDatabase();
  const query = database
    .select(publicTeacherSelection)
    .from(teacherProfiles)
    .innerJoin(users, eq(users.id, teacherProfiles.userId))
    .where(and(eq(teacherProfiles.isPublic, true), eq(users.isActive, true), eq(users.role, "teacher")))
    .orderBy(desc(teacherProfiles.updatedAt), asc(users.firstNameFa));
  const profiles = limit ? await query.limit(limit) : await query;
  if (!profiles.length) return [];

  const profileIds = profiles.map((profile) => profile.id);
  const [skills, workExperiences] = await Promise.all([
    database.select().from(teacherSkills).where(inArray(teacherSkills.teacherProfileId, profileIds)).orderBy(asc(teacherSkills.sortOrder)),
    database.select().from(teacherWorkExperiences).where(inArray(teacherWorkExperiences.teacherProfileId, profileIds)).orderBy(asc(teacherWorkExperiences.sortOrder)),
  ]);
  return profiles.map((profile) => ({
    ...profile,
    skills: skills.filter((skill) => skill.teacherProfileId === profile.id),
    workExperiences: workExperiences.filter((experience) => experience.teacherProfileId === profile.id),
  }));
}

export async function getPublicTeacher(username: string) {
  const database = getDatabase();
  const [profile] = await database
    .select(publicTeacherSelection)
    .from(teacherProfiles)
    .innerJoin(users, eq(users.id, teacherProfiles.userId))
    .where(and(eq(teacherProfiles.username, username), eq(teacherProfiles.isPublic, true), eq(users.isActive, true), eq(users.role, "teacher")))
    .limit(1);
  if (!profile) return null;
  const [skills, workExperiences, educations] = await Promise.all([
    database.select().from(teacherSkills).where(eq(teacherSkills.teacherProfileId, profile.id)).orderBy(asc(teacherSkills.sortOrder)),
    database.select().from(teacherWorkExperiences).where(eq(teacherWorkExperiences.teacherProfileId, profile.id)).orderBy(asc(teacherWorkExperiences.sortOrder)),
    database.select().from(teacherEducations).where(eq(teacherEducations.teacherProfileId, profile.id)).orderBy(asc(teacherEducations.sortOrder)),
  ]);
  return { ...profile, skills, workExperiences, educations };
}
