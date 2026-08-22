import { ExamForm } from "@/components/exams/exam-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function NewExamPage() {
  const locale = await getPanelLocale();
  const dictionary = getPanelDictionary(locale);
  return (
    <PanelPage>
      <div>
        <PanelBackLink href="/panel/admin/exams">{dictionary.common.back}</PanelBackLink>
      </div>
      <PanelPageHeader
        eyebrow={dictionary.exams.eyebrow}
        title={dictionary.exams.newExam}
        description={dictionary.exams.description}
      />
      <ExamForm locale={locale} />
    </PanelPage>
  );
}
