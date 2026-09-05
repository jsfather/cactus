import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { examAssignments, examAttempts, exams, users } from "@/lib/db/schema";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { userNameSql } from "@/lib/learning/queries";
import { text, title } from "@/lib/workflows";
import {
  assignExam,
  deleteExamAssignment,
  startExam,
  deleteExamAttempt,
} from "@/lib/exams/attempt-actions";
import { scoreExam } from "@/lib/exams/scoring";
import {
  ActionForm,
  ActionButton,
  DeleteAction,
  type Field,
} from "./action-form";
import { ExamRunner } from "./exam-runner";
import {
  PanelPage,
  PanelPageHeader,
  PanelSurface,
  PanelFormSection,
  PanelEmptyState,
} from "@/components/panel/ui";
export async function ExamAssignmentsPage({
  admin = false,
}: {
  admin?: boolean;
}) {
  const user = await requireRole(admin ? "admin" : "student");
  const locale = await getPanelLocale();
  const db = getDatabase();
  const assignments = await db
    .select({
      assignment: examAssignments,
      exam: exams,
      name: userNameSql(locale),
    })
    .from(examAssignments)
    .innerJoin(exams, eq(exams.id, examAssignments.examId))
    .innerJoin(users, eq(users.id, examAssignments.studentId))
    .where(admin ? undefined : eq(examAssignments.studentId, user.id));
  const attempts = await db
    .select()
    .from(examAttempts)
    .where(admin ? undefined : eq(examAttempts.studentId, user.id))
    .orderBy(desc(examAttempts.startedAt));
  const examOptions = admin ? await db.select().from(exams) : [];
  const people = admin
    ? await db
        .select({ id: users.id, name: userNameSql(locale) })
        .from(users)
        .where(eq(users.role, "student"))
    : [];
  const fields: Field[] = [
    {
      name: "examId",
      label: text(locale, "آزمون", "Exam"),
      options: examOptions.map((e) => ({
        value: e.id,
        label: title(e, locale),
      })),
    },
    {
      name: "studentId",
      label: text(locale, "دانش پژوه", "Student"),
      options: people.map((p) => ({ value: p.id, label: p.name })),
    },
    {
      name: "availableAt",
      label: text(locale, "زمان شروع دسترسی", "Available from"),
      type: "datetime-local",
    },
    {
      name: "dueAt",
      label: text(locale, "پایان دسترسی", "Due date"),
      type: "datetime-local",
    },
    {
      name: "maxAttempts",
      label: text(locale, "تعداد تلاش مجاز", "Maximum attempts"),
      type: "number",
      min: 1,
      max: 20,
    },
  ];
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "آموزش", "Learning")}
        title={text(
          locale,
          "آزمون‌ها و تعیین سطح",
          "Exams and placement tests",
        )}
        description={text(
          locale,
          "آزمون‌های اختصاص داده شده، تلاش‌ها و نتایج",
          "Assigned exams, attempts, and results",
        )}
      />
      {admin && (
        <ActionForm
          locale={locale}
          action={assignExam.bind(null, null)}
          fields={fields}
          initial={{ maxAttempts: "1" }}
        />
      )}
      {assignments.map(({ assignment: a, exam, name }) => (
        <PanelFormSection
          key={a.id}
          title={`${title(exam, locale)}${admin ? ` · ${name}` : ""}`}
        >
          <p className="mb-4 text-sm text-zinc-500">
            {locale === "en"
              ? exam.instructionsEn || exam.instructionsFa
              : exam.instructionsFa}
          </p>
          <p className="mb-4">
            {exam.durationMinutes
              ? `${exam.durationMinutes} ${text(locale, "دقیقه", "minutes")}`
              : text(locale, "بدون محدودیت زمانی", "No time limit")}{" "}
            · {text(locale, "حداکثر تلاش", "Maximum attempts")}: {a.maxAttempts}
          </p>
          <div className="space-y-3">
            {attempts
              .filter((at) => at.assignmentId === a.id)
              .map((at) => (
                <div
                  className="flex items-center justify-between gap-4"
                  key={at.id}
                >
                  <Link
                    className="text-emerald-700 dark:text-emerald-400"
                    href={`/panel/${admin ? "admin" : "student"}/exams/attempts/${at.id}`}
                  >
                    {at.startedAt.toLocaleString(locale)} ·{" "}
                    {at.finishedAt
                      ? `${at.score}%`
                      : text(locale, "ادامه آزمون", "Resume exam")}
                  </Link>
                  {admin && (
                    <DeleteAction
                      locale={locale}
                      action={deleteExamAttempt.bind(null, at.id, locale)}
                    />
                  )}
                </div>
              ))}
          </div>
          <div className="mt-4">
            {!admin ? (
              <ActionButton
                locale={locale}
                action={startExam.bind(null, a.id, locale)}
                label={text(locale, "شروع / ادامه", "Start / resume")}
              />
            ) : (
              <>
                <details>
                  <summary className="cursor-pointer">
                    {text(locale, "ویرایش تخصیص", "Edit assignment")}
                  </summary>
                  <ActionForm
                    locale={locale}
                    action={assignExam.bind(null, a.id)}
                    initial={Object.fromEntries(
                      Object.entries(a).map(([k, v]) => [
                        k,
                        v instanceof Date
                          ? v.toISOString().slice(0, 16)
                          : String(v ?? ""),
                      ]),
                    )}
                    fields={fields}
                  />
                </details>
                <DeleteAction
                  locale={locale}
                  action={deleteExamAssignment.bind(null, a.id, locale)}
                />
              </>
            )}
          </div>
        </PanelFormSection>
      ))}
      {!assignments.length && (
        <PanelEmptyState
          title={text(
            locale,
            "آزمونی اختصاص داده نشده",
            "No exams assigned yet",
          )}
          description=""
        />
      )}
    </PanelPage>
  );
}
export async function ExamAttemptPage({
  id,
  admin = false,
}: {
  id: string;
  admin?: boolean;
}) {
  const user = await requireRole(admin ? "admin" : "student");
  const locale = await getPanelLocale();
  if (!z.uuid().safeParse(id).success) notFound();
  const [attempt] = await getDatabase()
    .select()
    .from(examAttempts)
    .where(
      and(
        eq(examAttempts.id, id),
        admin ? undefined : eq(examAttempts.studentId, user.id),
      ),
    );
  if (!attempt) notFound();
  const expired = attempt.expiresAt !== null && attempt.expiresAt <= new Date();
  const complete = Boolean(attempt.finishedAt) || expired;
  const score = attempt.score ?? scoreExam(attempt.snapshot, attempt.answers);
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "آزمون", "Exam")}
        title={
          complete
            ? text(locale, "نتیجه آزمون", "Exam result")
            : text(locale, "پاسخ به آزمون", "Take exam")
        }
        description=""
      />
      {complete || admin ? (
        <PanelSurface className="p-8">
          <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
            {score}%
          </p>
          <p className="mt-4">
            {score >= attempt.passingScore
              ? text(locale, "قبول", "Passed")
              : text(locale, "نیاز به تمرین بیشتر", "More practice needed")}
          </p>
          <p className="mt-2 text-zinc-500">
            {text(locale, "حد نصاب", "Passing score")}: {attempt.passingScore}%
          </p>
          {admin && (
            <div className="mt-6 space-y-4">
              {attempt.snapshot.map((q) => (
                <div key={q.id}>
                  <h2 className="font-bold">
                    {locale === "en" ? q.promptEn || q.promptFa : q.promptFa}
                  </h2>
                  <p>
                    {(attempt.answers[q.id] ?? [])
                      .map((v) => {
                        const o = q.options.find((o) => o.id === v);
                        return o
                          ? locale === "en"
                            ? o.labelEn || o.labelFa
                            : o.labelFa
                          : v;
                      })
                      .join(" · ") || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </PanelSurface>
      ) : (
        <ExamRunner
          id={id}
          locale={locale}
          initial={attempt.answers}
          expiresAt={attempt.expiresAt?.toISOString() ?? null}
          questions={attempt.snapshot.map((q) => ({
            id: q.id,
            type: q.type,
            promptFa: q.promptFa,
            promptEn: q.promptEn,
            points: q.points,
            options: q.options.map((o) => ({
              id: o.id,
              labelFa: o.labelFa,
              labelEn: o.labelEn,
            })),
          }))}
        />
      )}
    </PanelPage>
  );
}
