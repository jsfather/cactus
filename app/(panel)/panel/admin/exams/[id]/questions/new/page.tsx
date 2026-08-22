import { notFound } from "next/navigation";
import { z } from "zod";
import { QuestionForm } from "@/components/exams/question-form";
import { ToastOnMount } from "@/components/feedback/toast-effects";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getAdminExam } from "@/lib/exams/queries";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function NewQuestionPage({
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
  const exam = await getAdminExam(id);
  if (!exam) notFound();
  const dictionary = getPanelDictionary(locale);

  return (
    <PanelPage>
      {query.toast === "exam-created" ? (
        <ToastOnMount
          title={
            locale === "fa"
              ? "آزمون ساخته شد؛ اولین سؤال را اضافه کنید."
              : "Exam created. Add the first question."
          }
        />
      ) : null}
      <div>
        <PanelBackLink href={`/panel/admin/exams/${exam.id}/edit`}>
          {dictionary.common.back}
        </PanelBackLink>
      </div>
      <PanelPageHeader
        eyebrow={locale === "en" ? exam.titleEn || exam.titleFa : exam.titleFa}
        title={dictionary.exams.newQuestion}
        description={dictionary.exams.description}
      />
      <QuestionForm locale={locale} examId={exam.id} />
    </PanelPage>
  );
}
