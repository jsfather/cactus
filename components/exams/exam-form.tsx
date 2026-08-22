"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createExam,
  updateExam,
  type ExamFormState,
} from "@/app/(panel)/panel/admin/exams/actions";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import {
  FieldError,
  FormLabel,
  PanelInput,
  PanelSelect,
  PanelTextarea,
} from "@/components/panel/form-controls";
import {
  PanelFormFooter,
  PanelFormSection,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/panel/ui";
import type { ExamStatus } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";

const initialState: ExamFormState = {};

export type ExamFormValues = {
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  descriptionEn: string;
  instructionsFa: string;
  instructionsEn: string;
  status: ExamStatus;
  durationMinutes: string;
  passingScore: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
};

const emptyValues: ExamFormValues = {
  titleFa: "",
  titleEn: "",
  descriptionFa: "",
  descriptionEn: "",
  instructionsFa: "",
  instructionsEn: "",
  status: "draft",
  durationMinutes: "",
  passingScore: "60",
  shuffleQuestions: false,
  shuffleOptions: false,
};

export function ExamForm({
  locale,
  mode = "create",
  examId,
  initialValues = emptyValues,
}: {
  locale: Locale;
  mode?: "create" | "edit";
  examId?: string;
  initialValues?: ExamFormValues;
}) {
  const dictionary = getPanelDictionary(locale);
  const actionHandler =
    mode === "edit" && examId ? updateExam.bind(null, examId) : createExam;
  const [state, action, pending] = useActionState(actionHandler, initialState);
  useActionErrorToast(state);
  const { bind } = usePreservedFields({
    titleFa: initialValues.titleFa,
    titleEn: initialValues.titleEn,
    descriptionFa: initialValues.descriptionFa,
    descriptionEn: initialValues.descriptionEn,
    instructionsFa: initialValues.instructionsFa,
    instructionsEn: initialValues.instructionsEn,
    status: initialValues.status,
    durationMinutes: initialValues.durationMinutes,
    passingScore: initialValues.passingScore,
  });
  const [shuffleQuestions, setShuffleQuestions] = useState(
    initialValues.shuffleQuestions,
  );
  const [shuffleOptions, setShuffleOptions] = useState(
    initialValues.shuffleOptions,
  );
  const isFa = locale === "fa";

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          <PanelFormSection
            title={dictionary.exams.faContent}
            description={
              isFa
                ? "عنوان فارسی الزامی است؛ توضیحات و راهنما را متناسب با شرکت‌کنندگان بنویسید."
                : "A Persian title is required. Add participant-facing context and instructions."
            }
          >
            <div className="space-y-5">
              <div>
                <FormLabel label={isFa ? "عنوان فارسی" : "Persian title"}>
                  <PanelInput {...bind("titleFa")} required dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.titleFa} />
              </div>
              <div>
                <FormLabel label={dictionary.exams.descriptionLabel}>
                  <PanelTextarea {...bind("descriptionFa")} rows={3} dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.descriptionFa} />
              </div>
              <div>
                <FormLabel label={dictionary.exams.instructions}>
                  <PanelTextarea {...bind("instructionsFa")} rows={5} dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.instructionsFa} />
              </div>
            </div>
          </PanelFormSection>

          <PanelFormSection
            title={dictionary.exams.enContent}
            description={
              isFa
                ? "برای نمایش آزمون در رابط انگلیسی، محتوای انگلیسی را اضافه کنید."
                : "Add English content for participants using the English interface."
            }
          >
            <div className="space-y-5">
              <div>
                <FormLabel label={isFa ? "عنوان انگلیسی" : "English title"}>
                  <PanelInput {...bind("titleEn")} dir="ltr" className="nums-en" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.titleEn} />
              </div>
              <div>
                <FormLabel
                  label={isFa ? "توضیح کوتاه انگلیسی" : "English description"}
                >
                  <PanelTextarea
                    {...bind("descriptionEn")}
                    rows={3}
                    dir="ltr"
                    className="nums-en"
                  />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.descriptionEn} />
              </div>
              <div>
                <FormLabel
                  label={isFa ? "دستورالعمل انگلیسی" : "English instructions"}
                >
                  <PanelTextarea
                    {...bind("instructionsEn")}
                    rows={5}
                    dir="ltr"
                    className="nums-en"
                  />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.instructionsEn} />
              </div>
            </div>
          </PanelFormSection>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6">
          <PanelFormSection
            title={dictionary.exams.settings}
            description={
              isFa
                ? "انتشار فقط پس از افزودن حداقل یک سؤال امکان‌پذیر است."
                : "Publishing is available after at least one question is added."
            }
          >
            <div className="space-y-5">
              <div>
                <FormLabel label={dictionary.common.status}>
                  <PanelSelect {...bind("status")}>
                    <option value="draft">{dictionary.common.draft}</option>
                    <option value="published" disabled={mode === "create"}>
                      {dictionary.common.published}
                    </option>
                    <option value="archived">{dictionary.exams.archived}</option>
                  </PanelSelect>
                </FormLabel>
                <FieldError errors={state.fieldErrors?.status} />
              </div>
              <div>
                <FormLabel
                  label={dictionary.exams.duration}
                  hint={dictionary.exams.durationHint}
                >
                  <PanelInput
                    {...bind("durationMinutes")}
                    type="number"
                    min="1"
                    max="600"
                    dir="ltr"
                    className="nums-en"
                  />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.durationMinutes} />
              </div>
              <div>
                <FormLabel label={dictionary.exams.passingScore}>
                  <PanelInput
                    {...bind("passingScore")}
                    required
                    type="number"
                    min="0"
                    max="100"
                    dir="ltr"
                    className="nums-en"
                  />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.passingScore} />
              </div>
              <ExamCheckbox
                name="shuffleQuestions"
                checked={shuffleQuestions}
                onChange={setShuffleQuestions}
                label={dictionary.exams.shuffleQuestions}
              />
              <ExamCheckbox
                name="shuffleOptions"
                checked={shuffleOptions}
                onChange={setShuffleOptions}
                label={dictionary.exams.shuffleOptions}
              />
            </div>
          </PanelFormSection>
        </aside>
      </div>

      <PanelFormFooter message={dictionary.exams.description} error={state.error}>
        <Link href="/panel/admin/exams" className={secondaryButtonClass}>
          {dictionary.common.cancel}
        </Link>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending
            ? dictionary.common.saving
            : mode === "edit"
              ? dictionary.common.save
              : dictionary.exams.saveExam}
        </button>
      </PanelFormFooter>
    </form>
  );
}

function ExamCheckbox({
  name,
  checked,
  onChange,
  label,
}: {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 text-start transition hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-emerald-800">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-emerald-700"
      />
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {label}
      </span>
    </label>
  );
}
