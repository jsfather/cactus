import { notFound } from "next/navigation";
import { z } from "zod";
import { QuestionForm } from "@/components/exams/question-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getAdminExam, getExamQuestion } from "@/lib/exams/queries";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string; questionId: string }>;
}) {
  const [{ id, questionId }, locale] = await Promise.all([
    params,
    getPanelLocale(),
  ]);
  if (!z.uuid().safeParse(id).success || !z.uuid().safeParse(questionId).success) {
    notFound();
  }
  const [exam, question] = await Promise.all([
    getAdminExam(id),
    getExamQuestion(id, questionId),
  ]);
  if (!exam || !question) notFound();
  const dictionary = getPanelDictionary(locale);

  return (
    <PanelPage>
      <div>
        <PanelBackLink href={`/panel/admin/exams/${exam.id}/edit`}>
          {dictionary.common.back}
        </PanelBackLink>
      </div>
      <PanelPageHeader
        eyebrow={locale === "en" ? exam.titleEn || exam.titleFa : exam.titleFa}
        title={
          locale === "fa"
            ? "ویرایش سؤال"
            : "Edit question"
        }
        description={dictionary.exams.description}
      />
      <QuestionForm
        locale={locale}
        examId={exam.id}
        mode="edit"
        questionId={question.id}
        initialValues={{
          type: question.type,
          promptFa: question.promptFa,
          promptEn: question.promptEn || "",
          explanationFa: question.explanationFa || "",
          explanationEn: question.explanationEn || "",
          points: String(question.points),
          correctBoolean:
            question.correctBoolean === null
              ? ""
              : question.correctBoolean
                ? "true"
                : "false",
          correctAnswerFa: question.correctAnswerFa || "",
          correctAnswerEn: question.correctAnswerEn || "",
          options: question.options.length
            ? question.options.map((option) => ({
                labelFa: option.labelFa,
                labelEn: option.labelEn || "",
                isCorrect: option.isCorrect,
              }))
            : [
                { labelFa: "", labelEn: "", isCorrect: true },
                { labelFa: "", labelEn: "", isCorrect: false },
              ],
        }}
      />
    </PanelPage>
  );
}
