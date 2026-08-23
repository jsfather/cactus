import "server-only";

import { and, eq } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { studentDocuments, studentInformation, users } from "@/lib/db/schema";

const informationSelection = {
  id: studentInformation.id,
  userId: studentInformation.userId,
  username: studentInformation.username,
  nationalCode: studentInformation.nationalCode,
  birthDate: studentInformation.birthDate,
  educationLevelFa: studentInformation.educationLevelFa,
  educationLevelEn: studentInformation.educationLevelEn,
  fatherNameFa: studentInformation.fatherNameFa,
  fatherNameEn: studentInformation.fatherNameEn,
  motherNameFa: studentInformation.motherNameFa,
  motherNameEn: studentInformation.motherNameEn,
  fatherOccupationFa: studentInformation.fatherOccupationFa,
  fatherOccupationEn: studentInformation.fatherOccupationEn,
  motherOccupationFa: studentInformation.motherOccupationFa,
  motherOccupationEn: studentInformation.motherOccupationEn,
  allergyStatus: studentInformation.allergyStatus,
  allergyDescriptionFa: studentInformation.allergyDescriptionFa,
  allergyDescriptionEn: studentInformation.allergyDescriptionEn,
  interestLevel: studentInformation.interestLevel,
  focusLevel: studentInformation.focusLevel,
  status: studentInformation.status,
  rejectionReason: studentInformation.rejectionReason,
  submittedAt: studentInformation.submittedAt,
  reviewedAt: studentInformation.reviewedAt,
  reviewedById: studentInformation.reviewedById,
  createdAt: studentInformation.createdAt,
  updatedAt: studentInformation.updatedAt,
};

export async function getStudentInformationForUser(userId: string) {
  const database = getDatabase();
  const [information, documents] = await Promise.all([
    database.select(informationSelection).from(studentInformation).where(eq(studentInformation.userId, userId)).limit(1),
    database.select({
      id: studentDocuments.id,
      kind: studentDocuments.kind,
      originalName: studentDocuments.originalName,
      mimeType: studentDocuments.mimeType,
      size: studentDocuments.size,
      updatedAt: studentDocuments.updatedAt,
    }).from(studentDocuments).where(eq(studentDocuments.userId, userId)),
  ]);

  return { information: information[0] ?? null, documents };
}

export async function getStudentReview(userId: string) {
  const database = getDatabase();
  const [student] = await database.select({
    id: users.id,
    mobile: users.mobile,
    email: users.email,
    firstNameFa: users.firstNameFa,
    lastNameFa: users.lastNameFa,
    firstNameEn: users.firstNameEn,
    lastNameEn: users.lastNameEn,
    avatarUrl: users.avatarUrl,
    isActive: users.isActive,
  }).from(users).where(and(eq(users.id, userId), eq(users.role, "student"))).limit(1);

  if (!student) return null;
  const submission = await getStudentInformationForUser(userId);
  return { student, ...submission };
}

export async function isStudentInformationApproved(userId: string) {
  const [row] = await getDatabase().select({ status: studentInformation.status })
    .from(studentInformation)
    .where(eq(studentInformation.userId, userId))
    .limit(1);
  return row?.status === "approved";
}

