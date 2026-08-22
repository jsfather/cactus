import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import {
  examQuestionOptions,
  examQuestions,
  exams,
  users,
  type ExamStatus,
} from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import {
  ADMIN_PAGE_SIZE,
  escapeLikePattern,
  normalizePage,
  type AdminListQuery,
  type PaginatedResult,
} from "@/lib/panel/pagination";

export type ExamStatusFilter = "all" | ExamStatus;

export async function getAdminExams(
  locale: Locale,
  query: AdminListQuery & { status: ExamStatusFilter },
): Promise<PaginatedResult<{
  id: string;
  titleFa: string;
  titleEn: string | null;
  status: ExamStatus;
  durationMinutes: number | null;
  passingScore: number;
  questionCount: number;
  totalPoints: number;
  creatorName: string;
  updatedAt: Date;
}>> {
  const database = getDatabase();
  const pattern = `%${escapeLikePattern(query.q)}%`;
  const where = and(
    query.status === "all" ? undefined : eq(exams.status, query.status),
    query.q
      ? or(
          ilike(exams.titleFa, pattern),
          ilike(exams.titleEn, pattern),
          ilike(exams.descriptionFa, pattern),
          ilike(exams.descriptionEn, pattern),
        )
      : undefined,
  );
  const [{ total }] = await database
    .select({ total: sql<number>`count(*)::int` })
    .from(exams)
    .where(where);
  const { page, pageCount } = normalizePage(query.page, total);
  const items = await database
    .select({
      id: exams.id,
      titleFa: exams.titleFa,
      titleEn: exams.titleEn,
      status: exams.status,
      durationMinutes: exams.durationMinutes,
      passingScore: exams.passingScore,
      questionCount: sql<number>`count(${examQuestions.id})::int`,
      totalPoints: sql<number>`coalesce(sum(${examQuestions.points}), 0)::int`,
      creatorName:
        locale === "fa"
          ? sql<string>`concat_ws(' ', ${users.firstNameFa}, ${users.lastNameFa})`
          : sql<string>`concat_ws(' ', ${users.firstNameEn}, ${users.lastNameEn})`,
      updatedAt: exams.updatedAt,
    })
    .from(exams)
    .innerJoin(users, eq(exams.creatorId, users.id))
    .leftJoin(examQuestions, eq(examQuestions.examId, exams.id))
    .where(where)
    .groupBy(exams.id, users.id)
    .orderBy(desc(exams.updatedAt))
    .limit(ADMIN_PAGE_SIZE)
    .offset((page - 1) * ADMIN_PAGE_SIZE);

  return { items, page, pageCount, pageSize: ADMIN_PAGE_SIZE, total };
}

export async function getAdminExam(examId: string) {
  const [exam] = await getDatabase()
    .select()
    .from(exams)
    .where(eq(exams.id, examId))
    .limit(1);

  return exam ?? null;
}

export async function getExamQuestions(examId: string) {
  return getDatabase()
    .select({
      id: examQuestions.id,
      examId: examQuestions.examId,
      type: examQuestions.type,
      promptFa: examQuestions.promptFa,
      promptEn: examQuestions.promptEn,
      points: examQuestions.points,
      sortOrder: examQuestions.sortOrder,
      optionCount: sql<number>`count(${examQuestionOptions.id})::int`,
    })
    .from(examQuestions)
    .leftJoin(
      examQuestionOptions,
      eq(examQuestionOptions.questionId, examQuestions.id),
    )
    .where(eq(examQuestions.examId, examId))
    .groupBy(examQuestions.id)
    .orderBy(asc(examQuestions.sortOrder));
}

export async function getExamQuestion(examId: string, questionId: string) {
  const database = getDatabase();
  const [question] = await database
    .select()
    .from(examQuestions)
    .where(
      and(
        eq(examQuestions.id, questionId),
        eq(examQuestions.examId, examId),
      ),
    )
    .limit(1);

  if (!question) return null;

  const options = await database
    .select()
    .from(examQuestionOptions)
    .where(eq(examQuestionOptions.questionId, question.id))
    .orderBy(asc(examQuestionOptions.sortOrder));

  return { ...question, options };
}
