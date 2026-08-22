import { notFound } from "next/navigation";
import { z } from "zod";
import { ExamForm } from "@/components/exams/exam-form";
import { QuestionActions } from "@/components/exams/exam-actions";
import { ToastOnMount } from "@/components/feedback/toast-effects";
import {
  PanelBackLink,
  PanelEmptyState,
  PanelPage,
  PanelPageHeader,
  PanelPrimaryLink,
  PanelSurface,
  PanelTable,
  PanelTableCell,
} from "@/components/panel/ui";
import { getAdminExam, getExamQuestions } from "@/lib/exams/queries";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function EditExamPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ toast?: string }>;
}) {
  const [{ id }, query, locale] = await Promise.all([
    params,
    searchParams,
    getPanelLocale(),
  ]);
  if (!z.uuid().safeParse(id).success) notFound();
  const [exam, questions] = await Promise.all([
    getAdminExam(id),
    getExamQuestions(id),
  ]);
  if (!exam) notFound();
  const dictionary = getPanelDictionary(locale);
  const number = (value: number) =>
    new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
  const totalPoints = questions.reduce((total, question) => total + question.points, 0);
  const typeLabels = {
    single_choice: dictionary.exams.singleChoice,
    multiple_choice: dictionary.exams.multipleChoice,
    true_false: dictionary.exams.trueFalse,
    short_answer: dictionary.exams.shortAnswer,
  };
  const toastTitles: Record<string, string> = {
    created: locale === "fa" ? "آزمون ساخته شد؛ اکنون سؤال‌ها را اضافه کنید." : "Exam created. You can now add questions.",
    "question-created": locale === "fa" ? "سؤال اضافه شد." : "Question added.",
    "question-updated": locale === "fa" ? "سؤال به‌روز شد." : "Question updated.",
  };

  return (
    <PanelPage>
      {query.toast && toastTitles[query.toast] ? (
        <ToastOnMount title={toastTitles[query.toast]} />
      ) : null}
      <div>
        <PanelBackLink href="/panel/admin/exams">{dictionary.common.back}</PanelBackLink>
      </div>
      <PanelPageHeader
        eyebrow={dictionary.exams.eyebrow}
        title={
          locale === "en"
            ? `Edit ${exam.titleEn || exam.titleFa}`
            : `ویرایش ${exam.titleFa}`
        }
        description={dictionary.exams.description}
      />
      <ExamForm
        locale={locale}
        mode="edit"
        examId={exam.id}
        initialValues={{
          titleFa: exam.titleFa,
          titleEn: exam.titleEn || "",
          descriptionFa: exam.descriptionFa || "",
          descriptionEn: exam.descriptionEn || "",
          instructionsFa: exam.instructionsFa || "",
          instructionsEn: exam.instructionsEn || "",
          status: exam.status,
          durationMinutes: exam.durationMinutes ? String(exam.durationMinutes) : "",
          passingScore: String(exam.passingScore),
          shuffleQuestions: exam.shuffleQuestions,
          shuffleOptions: exam.shuffleOptions,
        }}
      />

      <PanelSurface>
        <header className="flex flex-col gap-4 border-b border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-zinc-800">
          <div>
            <h2 className="font-bold text-zinc-950 dark:text-zinc-50">
              {dictionary.exams.questions}
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {number(questions.length)} {dictionary.exams.questions} · {number(totalPoints)} {dictionary.exams.points}
            </p>
          </div>
          <PanelPrimaryLink
            href={`/panel/admin/exams/${exam.id}/questions/new`}
            size="compact"
          >
            {dictionary.exams.newQuestion}
          </PanelPrimaryLink>
        </header>
        {questions.length ? (
          <PanelTable
            minWidth="min-w-3xl"
            columns={[
              { label: "#", className: "w-[8%]" },
              { label: dictionary.exams.prompt, className: "w-[39%]" },
              { label: dictionary.exams.questionType, className: "w-[18%]" },
              { label: dictionary.exams.points, className: "w-[10%]" },
              { label: dictionary.common.actions, className: "w-[25%]" },
            ]}
          >
            {questions.map((question, index) => (
              <tr key={question.id}>
                <PanelTableCell className="font-medium text-zinc-500">
                  {number(index + 1)}
                </PanelTableCell>
                <PanelTableCell>
                  <p className="line-clamp-2 font-medium text-zinc-950 dark:text-zinc-50">
                    {locale === "en" ? question.promptEn || question.promptFa : question.promptFa}
                  </p>
                  {question.optionCount ? (
                    <p className="mt-1 text-xs text-zinc-500">
                      {number(question.optionCount)} {dictionary.exams.options}
                    </p>
                  ) : null}
                </PanelTableCell>
                <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                  {typeLabels[question.type]}
                </PanelTableCell>
                <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                  {number(question.points)}
                </PanelTableCell>
                <PanelTableCell>
                  <QuestionActions
                    examId={exam.id}
                    questionId={question.id}
                    locale={locale}
                    canMoveUp={index > 0}
                    canMoveDown={index < questions.length - 1}
                  />
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={locale === "fa" ? "هنوز سؤالی وجود ندارد" : "No questions yet"}
            description={
              locale === "fa"
                ? "حداقل یک سؤال اضافه کنید تا آزمون قابل انتشار باشد."
                : "Add at least one question before publishing this exam."
            }
            action={
              <PanelPrimaryLink href={`/panel/admin/exams/${exam.id}/questions/new`}>
                {dictionary.exams.newQuestion}
              </PanelPrimaryLink>
            }
          />
        )}
      </PanelSurface>
    </PanelPage>
  );
}
