import { notFound } from "next/navigation";
import { z } from "zod";
import { QuestionForm } from "@/components/exams/question-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getAdminExam } from "@/lib/exams/queries";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function NewQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, locale] = await Promise.all([params, getPanelLocale()]);
  if (!z.uuid().safeParse(id).success) notFound();
  const exam = await getAdminExam(id);
  if (!exam) notFound();
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
        title={dictionary.exams.newQuestion}
        description={dictionary.exams.description}
      />
      <QuestionForm locale={locale} examId={exam.id} />
    </PanelPage>
  );
}
