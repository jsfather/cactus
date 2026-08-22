"use server";

import { and, asc, eq, max, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  examQuestionOptions,
  examQuestions,
  exams,
} from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";

const examSchema = z.object({
  titleFa: z.string().trim().min(3).max(240),
  titleEn: z.string().trim().max(240),
  descriptionFa: z.string().trim().max(2000),
  descriptionEn: z.string().trim().max(2000),
  instructionsFa: z.string().trim().max(4000),
  instructionsEn: z.string().trim().max(4000),
  status: z.enum(["draft", "published", "archived"]),
  durationMinutes: z
    .string()
    .trim()
    .refine((value) => !value || /^\d+$/.test(value))
    .transform((value) => (value ? Number(value) : null))
    .refine((value) => value === null || (value >= 1 && value <= 600)),
  passingScore: z.coerce.number().int().min(0).max(100),
  shuffleQuestions: z.boolean(),
  shuffleOptions: z.boolean(),
  locale: z.enum(["fa", "en"]),
});

const optionSchema = z.object({
  labelFa: z.string().trim().min(1).max(1000),
  labelEn: z.string().trim().max(1000),
  isCorrect: z.boolean(),
});

const questionSchema = z
  .object({
    type: z.enum([
      "single_choice",
      "multiple_choice",
      "true_false",
      "short_answer",
    ]),
    promptFa: z.string().trim().min(3).max(4000),
    promptEn: z.string().trim().max(4000),
    explanationFa: z.string().trim().max(4000),
    explanationEn: z.string().trim().max(4000),
    points: z.coerce.number().int().min(1).max(1000),
    correctBoolean: z.enum(["true", "false", ""]),
    correctAnswerFa: z.string().trim().max(1000),
    correctAnswerEn: z.string().trim().max(1000),
    options: z.array(optionSchema).max(8),
    locale: z.enum(["fa", "en"]),
  })
  .superRefine((data, context) => {
    const messages =
      data.locale === "fa"
        ? {
            twoOptions: "حداقل دو گزینه لازم است.",
            oneCorrect: "دقیقاً یک گزینه صحیح انتخاب کنید.",
            someCorrect: "حداقل یک گزینه صحیح انتخاب کنید.",
            chooseAnswer: "پاسخ صحیح را انتخاب کنید.",
            shortAnswer: "پاسخ مورد انتظار فارسی را وارد کنید.",
          }
        : {
            twoOptions: "At least two options are required.",
            oneCorrect: "Select exactly one correct option.",
            someCorrect: "Select at least one correct option.",
            chooseAnswer: "Choose the correct answer.",
            shortAnswer: "Add the expected Persian answer.",
          };
    if (data.type === "single_choice" || data.type === "multiple_choice") {
      if (data.options.length < 2) {
        context.addIssue({
          code: "custom",
          path: ["options"],
          message: messages.twoOptions,
        });
      }
      const correctCount = data.options.filter((option) => option.isCorrect).length;
      if (data.type === "single_choice" && correctCount !== 1) {
        context.addIssue({
          code: "custom",
          path: ["options"],
          message: messages.oneCorrect,
        });
      }
      if (data.type === "multiple_choice" && correctCount < 1) {
        context.addIssue({
          code: "custom",
          path: ["options"],
          message: messages.someCorrect,
        });
      }
    }
    if (data.type === "true_false" && !data.correctBoolean) {
      context.addIssue({
        code: "custom",
        path: ["correctBoolean"],
        message: messages.chooseAnswer,
      });
    }
    if (data.type === "short_answer" && !data.correctAnswerFa) {
      context.addIssue({
        code: "custom",
        path: ["correctAnswerFa"],
        message: messages.shortAnswer,
      });
    }
  });

export type ExamFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export type QuestionFormState = ExamFormState;
export type ExamMutationState = { error?: string; success?: string };

function formLocale(formData: FormData): Locale {
  return formData.get("locale") === "en" ? "en" : "fa";
}

function examData(formData: FormData) {
  return {
    titleFa: formData.get("titleFa"),
    titleEn: formData.get("titleEn"),
    descriptionFa: formData.get("descriptionFa"),
    descriptionEn: formData.get("descriptionEn"),
    instructionsFa: formData.get("instructionsFa"),
    instructionsEn: formData.get("instructionsEn"),
    status: formData.get("status"),
    durationMinutes: formData.get("durationMinutes"),
    passingScore: formData.get("passingScore"),
    shuffleQuestions: formData.get("shuffleQuestions") === "on",
    shuffleOptions: formData.get("shuffleOptions") === "on",
    locale: formData.get("locale"),
  };
}

function parseOptions(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function questionData(formData: FormData) {
  return {
    type: formData.get("type"),
    promptFa: formData.get("promptFa"),
    promptEn: formData.get("promptEn"),
    explanationFa: formData.get("explanationFa"),
    explanationEn: formData.get("explanationEn"),
    points: formData.get("points"),
    correctBoolean: formData.get("correctBoolean") ?? "",
    correctAnswerFa: formData.get("correctAnswerFa"),
    correctAnswerEn: formData.get("correctAnswerEn"),
    options: parseOptions(formData.get("options")),
    locale: formData.get("locale"),
  };
}

function revalidateExamPages(examId?: string) {
  revalidatePath("/panel/admin/exams");
  if (examId) revalidatePath(`/panel/admin/exams/${examId}/edit`);
}

function invalidExamMessage(locale: Locale) {
  return locale === "fa"
    ? "لطفاً اطلاعات آزمون را بررسی کنید."
    : "Please review the exam information.";
}

function invalidQuestionMessage(locale: Locale) {
  return locale === "fa"
    ? "لطفاً اطلاعات و پاسخ صحیح سؤال را بررسی کنید."
    : "Please review the question and its correct answer.";
}

export async function createExam(
  _previousState: ExamFormState,
  formData: FormData,
): Promise<ExamFormState> {
  const admin = await requireRole("admin");
  const locale = formLocale(formData);
  const parsed = examSchema.safeParse(examData(formData));

  if (!parsed.success) {
    return {
      error: invalidExamMessage(locale),
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (parsed.data.status === "published") {
    return {
      error:
        locale === "fa"
          ? "ابتدا آزمون را به‌صورت پیش‌نویس بسازید و دست‌کم یک سؤال به آن اضافه کنید."
          : "Create the exam as a draft and add at least one question before publishing it.",
    };
  }

  let createdExam: { id: string };
  try {
    [createdExam] = await getDatabase()
      .insert(exams)
      .values({
        titleFa: parsed.data.titleFa,
        titleEn: parsed.data.titleEn || null,
        descriptionFa: parsed.data.descriptionFa || null,
        descriptionEn: parsed.data.descriptionEn || null,
        instructionsFa: parsed.data.instructionsFa || null,
        instructionsEn: parsed.data.instructionsEn || null,
        status: parsed.data.status,
        durationMinutes: parsed.data.durationMinutes,
        passingScore: parsed.data.passingScore,
        shuffleQuestions: parsed.data.shuffleQuestions,
        shuffleOptions: parsed.data.shuffleOptions,
        creatorId: admin.id,
      })
      .returning({ id: exams.id });
  } catch {
    return {
      error:
        locale === "fa"
          ? "ذخیره آزمون انجام نشد. دوباره تلاش کنید."
          : "The exam could not be saved. Please try again.",
    };
  }

  revalidateExamPages(createdExam.id);
  redirect(
    `/panel/admin/exams/${createdExam.id}/questions/new?toast=exam-created`,
  );
}

export async function updateExam(
  examIdValue: string,
  _previousState: ExamFormState,
  formData: FormData,
): Promise<ExamFormState> {
  await requireRole("admin");
  const locale = formLocale(formData);
  const examId = z.uuid().safeParse(examIdValue);
  const parsed = examSchema.safeParse(examData(formData));

  if (!examId.success || !parsed.success) {
    return {
      error: invalidExamMessage(locale),
      fieldErrors: parsed.success
        ? undefined
        : z.flattenError(parsed.error).fieldErrors,
    };
  }

  const database = getDatabase();
  let updateResult: "missing" | "empty" | "updated";
  try {
    updateResult = await database.transaction(async (transaction) => {
    const lockedExam = await transaction.execute(
      sql`select ${exams.id} from ${exams} where ${exams.id} = ${examId.data} for update`,
    );
    if (!lockedExam.rowCount) return "missing" as const;

    if (parsed.data.status === "published") {
      const [{ count }] = await transaction
        .select({ count: sql<number>`count(*)::int` })
        .from(examQuestions)
        .where(eq(examQuestions.examId, examId.data));
      if (count < 1) return "empty" as const;
    }

    await transaction
      .update(exams)
      .set({
        titleFa: parsed.data.titleFa,
        titleEn: parsed.data.titleEn || null,
        descriptionFa: parsed.data.descriptionFa || null,
        descriptionEn: parsed.data.descriptionEn || null,
        instructionsFa: parsed.data.instructionsFa || null,
        instructionsEn: parsed.data.instructionsEn || null,
        status: parsed.data.status,
        durationMinutes: parsed.data.durationMinutes,
        passingScore: parsed.data.passingScore,
        shuffleQuestions: parsed.data.shuffleQuestions,
        shuffleOptions: parsed.data.shuffleOptions,
        updatedAt: new Date(),
      })
      .where(eq(exams.id, examId.data));
    return "updated" as const;
    });
  } catch {
    return {
      error:
        locale === "fa"
          ? "به‌روزرسانی آزمون انجام نشد. دوباره تلاش کنید."
          : "The exam could not be updated. Please try again.",
    };
  }

  if (updateResult === "missing") {
    return {
      error: locale === "fa" ? "این آزمون دیگر وجود ندارد." : "This exam no longer exists.",
    };
  }
  if (updateResult === "empty") {
    return {
      error:
        locale === "fa"
          ? "آزمون بدون سؤال قابل انتشار نیست."
          : "An exam cannot be published without questions.",
    };
  }

  revalidateExamPages(examId.data);
  redirect("/panel/admin/exams?toast=updated");
}

export async function deleteExam(
  examIdValue: string,
  locale: Locale,
): Promise<ExamMutationState> {
  await requireRole("admin");
  const examId = z.uuid().safeParse(examIdValue);
  if (!examId.success) {
    return { error: locale === "fa" ? "شناسه آزمون معتبر نیست." : "The exam identifier is invalid." };
  }

  try {
    const removed = await getDatabase()
      .delete(exams)
      .where(eq(exams.id, examId.data))
      .returning({ id: exams.id });
    if (!removed.length) {
      return { error: locale === "fa" ? "آزمون پیدا نشد." : "The exam was not found." };
    }
  } catch {
    return {
      error:
        locale === "fa"
          ? "حذف آزمون انجام نشد. دوباره تلاش کنید."
          : "The exam could not be deleted. Please try again.",
    };
  }
  revalidateExamPages(examId.data);
  return { success: locale === "fa" ? "آزمون حذف شد." : "Exam deleted." };
}

async function ensureExam(examId: string) {
  const [exam] = await getDatabase()
    .select({ id: exams.id })
    .from(exams)
    .where(eq(exams.id, examId))
    .limit(1);
  return exam ?? null;
}

export async function createQuestion(
  examIdValue: string,
  _previousState: QuestionFormState,
  formData: FormData,
): Promise<QuestionFormState> {
  await requireRole("admin");
  const locale = formLocale(formData);
  const examId = z.uuid().safeParse(examIdValue);
  const parsed = questionSchema.safeParse(questionData(formData));
  if (!examId.success || !parsed.success) {
    return {
      error: invalidQuestionMessage(locale),
      fieldErrors: parsed.success
        ? undefined
        : z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (!(await ensureExam(examId.data))) {
    return { error: locale === "fa" ? "آزمون پیدا نشد." : "The exam was not found." };
  }

  try {
    await getDatabase().transaction(async (transaction) => {
    await transaction.execute(
      sql`select ${exams.id} from ${exams} where ${exams.id} = ${examId.data} for update`,
    );
    const [position] = await transaction
      .select({ value: max(examQuestions.sortOrder) })
      .from(examQuestions)
      .where(eq(examQuestions.examId, examId.data));
    const [question] = await transaction
      .insert(examQuestions)
      .values({
        examId: examId.data,
        type: parsed.data.type,
        promptFa: parsed.data.promptFa,
        promptEn: parsed.data.promptEn || null,
        explanationFa: parsed.data.explanationFa || null,
        explanationEn: parsed.data.explanationEn || null,
        points: parsed.data.points,
        sortOrder: (position.value ?? 0) + 1,
        correctBoolean:
          parsed.data.type === "true_false"
            ? parsed.data.correctBoolean === "true"
            : null,
        correctAnswerFa:
          parsed.data.type === "short_answer"
            ? parsed.data.correctAnswerFa
            : null,
        correctAnswerEn:
          parsed.data.type === "short_answer"
            ? parsed.data.correctAnswerEn || null
            : null,
      })
      .returning({ id: examQuestions.id });

    if (parsed.data.type === "single_choice" || parsed.data.type === "multiple_choice") {
      await transaction.insert(examQuestionOptions).values(
        parsed.data.options.map((option, index) => ({
          questionId: question.id,
          labelFa: option.labelFa,
          labelEn: option.labelEn || null,
          isCorrect: option.isCorrect,
          sortOrder: index + 1,
        })),
      );
    }
    await transaction
      .update(exams)
      .set({ updatedAt: new Date() })
      .where(eq(exams.id, examId.data));
    });
  } catch {
    return {
      error:
        locale === "fa"
          ? "ذخیره سؤال انجام نشد. دوباره تلاش کنید."
          : "The question could not be saved. Please try again.",
    };
  }

  revalidateExamPages(examId.data);
  redirect(`/panel/admin/exams/${examId.data}/edit?toast=question-created`);
}

export async function updateQuestion(
  examIdValue: string,
  questionIdValue: string,
  _previousState: QuestionFormState,
  formData: FormData,
): Promise<QuestionFormState> {
  await requireRole("admin");
  const locale = formLocale(formData);
  const examId = z.uuid().safeParse(examIdValue);
  const questionId = z.uuid().safeParse(questionIdValue);
  const parsed = questionSchema.safeParse(questionData(formData));
  if (!examId.success || !questionId.success || !parsed.success) {
    return {
      error: invalidQuestionMessage(locale),
      fieldErrors: parsed.success
        ? undefined
        : z.flattenError(parsed.error).fieldErrors,
    };
  }

  const database = getDatabase();
  let updated: boolean;
  try {
    updated = await database.transaction(async (transaction) => {
    const lockedExam = await transaction.execute(
      sql`select ${exams.id} from ${exams} where ${exams.id} = ${examId.data} for update`,
    );
    if (!lockedExam.rowCount) return false;
    const [existingQuestion] = await transaction
      .select({ id: examQuestions.id })
      .from(examQuestions)
      .where(
        and(
          eq(examQuestions.id, questionId.data),
          eq(examQuestions.examId, examId.data),
        ),
      )
      .limit(1);
    if (!existingQuestion) return false;
    await transaction
      .update(examQuestions)
      .set({
        type: parsed.data.type,
        promptFa: parsed.data.promptFa,
        promptEn: parsed.data.promptEn || null,
        explanationFa: parsed.data.explanationFa || null,
        explanationEn: parsed.data.explanationEn || null,
        points: parsed.data.points,
        correctBoolean:
          parsed.data.type === "true_false"
            ? parsed.data.correctBoolean === "true"
            : null,
        correctAnswerFa:
          parsed.data.type === "short_answer"
            ? parsed.data.correctAnswerFa
            : null,
        correctAnswerEn:
          parsed.data.type === "short_answer"
            ? parsed.data.correctAnswerEn || null
            : null,
        updatedAt: new Date(),
      })
      .where(eq(examQuestions.id, questionId.data));
    await transaction
      .delete(examQuestionOptions)
      .where(eq(examQuestionOptions.questionId, questionId.data));
    if (parsed.data.type === "single_choice" || parsed.data.type === "multiple_choice") {
      await transaction.insert(examQuestionOptions).values(
        parsed.data.options.map((option, index) => ({
          questionId: questionId.data,
          labelFa: option.labelFa,
          labelEn: option.labelEn || null,
          isCorrect: option.isCorrect,
          sortOrder: index + 1,
        })),
      );
    }
    await transaction
      .update(exams)
      .set({ updatedAt: new Date() })
      .where(eq(exams.id, examId.data));
    return true;
    });
  } catch {
    return {
      error:
        locale === "fa"
          ? "به‌روزرسانی سؤال انجام نشد. دوباره تلاش کنید."
          : "The question could not be updated. Please try again.",
    };
  }
  if (!updated) {
    return { error: locale === "fa" ? "سؤال پیدا نشد." : "The question was not found." };
  }

  revalidateExamPages(examId.data);
  redirect(`/panel/admin/exams/${examId.data}/edit?toast=question-updated`);
}

export async function deleteQuestion(
  examIdValue: string,
  questionIdValue: string,
  locale: Locale,
): Promise<ExamMutationState> {
  await requireRole("admin");
  const examId = z.uuid().safeParse(examIdValue);
  const questionId = z.uuid().safeParse(questionIdValue);
  if (!examId.success || !questionId.success) {
    return { error: locale === "fa" ? "شناسه سؤال معتبر نیست." : "The question identifier is invalid." };
  }

  const database = getDatabase();
  let deleted: "missing" | "last-published" | "deleted";
  try {
    deleted = await database.transaction(async (transaction) => {
    const lockedExam = await transaction.execute(
      sql`select ${exams.status} from ${exams} where ${exams.id} = ${examId.data} for update`,
    );
    if (!lockedExam.rowCount) return "missing" as const;
    const [{ count }] = await transaction
      .select({ count: sql<number>`count(*)::int` })
      .from(examQuestions)
      .where(eq(examQuestions.examId, examId.data));
    const status = lockedExam.rows[0]?.status;
    if (status === "published" && count <= 1) return "last-published" as const;

    const removed = await transaction
      .delete(examQuestions)
      .where(
        and(
          eq(examQuestions.id, questionId.data),
          eq(examQuestions.examId, examId.data),
        ),
      )
      .returning({ id: examQuestions.id });
    if (!removed.length) return "missing" as const;
    await transaction
      .update(exams)
      .set({ updatedAt: new Date() })
      .where(eq(exams.id, examId.data));
    return "deleted" as const;
    });
  } catch {
    return {
      error:
        locale === "fa"
          ? "حذف سؤال انجام نشد. دوباره تلاش کنید."
          : "The question could not be deleted. Please try again.",
    };
  }
  if (deleted === "last-published") {
    return {
      error:
        locale === "fa"
          ? "آخرین سؤال آزمون منتشرشده قابل حذف نیست؛ ابتدا آزمون را به پیش‌نویس تغییر دهید."
          : "The last question of a published exam cannot be deleted. Change the exam to draft first.",
    };
  }
  if (deleted === "missing") {
    return { error: locale === "fa" ? "سؤال پیدا نشد." : "The question was not found." };
  }
  revalidateExamPages(examId.data);
  return { success: locale === "fa" ? "سؤال حذف شد." : "Question deleted." };
}

export async function moveQuestion(
  examIdValue: string,
  questionIdValue: string,
  direction: "up" | "down",
  locale: Locale,
): Promise<ExamMutationState> {
  await requireRole("admin");
  const examId = z.uuid().safeParse(examIdValue);
  const questionId = z.uuid().safeParse(questionIdValue);
  if (!examId.success || !questionId.success) {
    return { error: locale === "fa" ? "شناسه سؤال معتبر نیست." : "The question identifier is invalid." };
  }

  const database = getDatabase();
  try {
    await database.transaction(async (transaction) => {
    await transaction.execute(
      sql`select ${exams.id} from ${exams} where ${exams.id} = ${examId.data} for update`,
    );
    const questions = await transaction
      .select({ id: examQuestions.id, sortOrder: examQuestions.sortOrder })
      .from(examQuestions)
      .where(eq(examQuestions.examId, examId.data))
      .orderBy(asc(examQuestions.sortOrder));
    const currentIndex = questions.findIndex((question) => question.id === questionId.data);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= questions.length) return;

    const current = questions[currentIndex];
    const target = questions[targetIndex];
    const temporarySortOrder =
      Math.max(...questions.map((question) => question.sortOrder)) + 1;
    await transaction
      .update(examQuestions)
      .set({ sortOrder: temporarySortOrder })
      .where(eq(examQuestions.id, current.id));
    await transaction
      .update(examQuestions)
      .set({ sortOrder: current.sortOrder })
      .where(eq(examQuestions.id, target.id));
    await transaction
      .update(examQuestions)
      .set({ sortOrder: target.sortOrder })
      .where(eq(examQuestions.id, current.id));
    await transaction
      .update(exams)
      .set({ updatedAt: new Date() })
      .where(eq(exams.id, examId.data));
    });
  } catch {
    return {
      error:
        locale === "fa"
          ? "تغییر ترتیب سؤال‌ها انجام نشد. دوباره تلاش کنید."
          : "The question order could not be updated. Please try again.",
    };
  }
  revalidateExamPages(examId.data);
  return { success: locale === "fa" ? "ترتیب سؤال‌ها به‌روز شد." : "Question order updated." };
}
