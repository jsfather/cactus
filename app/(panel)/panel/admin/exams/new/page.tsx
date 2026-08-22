import { ExamForm } from "@/components/exams/exam-form";
import {
  PanelBackLink,
  PanelPage,
  PanelPageHeader,
  PanelSurface,
} from "@/components/panel/ui";
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
        description={
          locale === "fa"
            ? "ابتدا مشخصات آزمون را ذخیره کنید؛ سپس مستقیم به افزودن اولین سؤال می‌روید."
            : "Save the exam details first, then you will go directly to adding the first question."
        }
      />
      <PanelSurface>
        <ol
          aria-label={locale === "fa" ? "مراحل ساخت آزمون" : "Exam creation steps"}
          className="grid sm:grid-cols-2"
        >
          <li className="border-b border-zinc-200 bg-emerald-50/70 p-5 sm:border-b-0 sm:border-e dark:border-zinc-800 dark:bg-emerald-950/30">
            <div className="flex items-start gap-3">
              <span className="nums-en flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white dark:bg-emerald-500 dark:text-emerald-950">
                1
              </span>
              <span>
                <strong className="block text-sm text-zinc-950 dark:text-zinc-50">
                  {dictionary.exams.examInfo}
                </strong>
                <span className="mt-1 block text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                  {locale === "fa"
                    ? "عنوان، راهنما و تنظیمات نمره‌دهی را تکمیل کنید."
                    : "Complete titles, instructions, and scoring settings."}
                </span>
              </span>
            </div>
          </li>
          <li className="p-5">
            <div className="flex items-start gap-3">
              <span className="nums-en flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                2
              </span>
              <span>
                <strong className="block text-sm text-zinc-950 dark:text-zinc-50">
                  {dictionary.exams.questions}
                </strong>
                <span className="mt-1 block text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                  {locale === "fa"
                    ? "پس از ساخت آزمون، اولین سؤال را اضافه کنید."
                    : "After creating the exam, add its first question."}
                </span>
              </span>
            </div>
          </li>
        </ol>
      </PanelSurface>
      <ExamForm locale={locale} />
    </PanelPage>
  );
}
