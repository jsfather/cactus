"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createQuestion,
  updateQuestion,
  type QuestionFormState,
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
import type { ExamQuestionType } from "@/lib/db/schema";
import type { Locale } from "@/lib/i18n/config";
import { getPanelDictionary } from "@/lib/i18n/panel";

const initialState: QuestionFormState = {};

type QuestionOptionValue = {
  labelFa: string;
  labelEn: string;
  isCorrect: boolean;
};

export type QuestionFormValues = {
  type: ExamQuestionType;
  promptFa: string;
  promptEn: string;
  explanationFa: string;
  explanationEn: string;
  points: string;
  correctBoolean: "true" | "false" | "";
  correctAnswerFa: string;
  correctAnswerEn: string;
  options: QuestionOptionValue[];
};

const emptyValues: QuestionFormValues = {
  type: "single_choice",
  promptFa: "",
  promptEn: "",
  explanationFa: "",
  explanationEn: "",
  points: "1",
  correctBoolean: "",
  correctAnswerFa: "",
  correctAnswerEn: "",
  options: [
    { labelFa: "", labelEn: "", isCorrect: true },
    { labelFa: "", labelEn: "", isCorrect: false },
    { labelFa: "", labelEn: "", isCorrect: false },
    { labelFa: "", labelEn: "", isCorrect: false },
  ],
};

export function QuestionForm({
  locale,
  examId,
  mode = "create",
  questionId,
  initialValues = emptyValues,
}: {
  locale: Locale;
  examId: string;
  mode?: "create" | "edit";
  questionId?: string;
  initialValues?: QuestionFormValues;
}) {
  const dictionary = getPanelDictionary(locale);
  const actionHandler =
    mode === "edit" && questionId
      ? updateQuestion.bind(null, examId, questionId)
      : createQuestion.bind(null, examId);
  const [state, action, pending] = useActionState(actionHandler, initialState);
  useActionErrorToast(state);
  const { bind, setValues, values } = usePreservedFields({
    type: initialValues.type,
    promptFa: initialValues.promptFa,
    promptEn: initialValues.promptEn,
    explanationFa: initialValues.explanationFa,
    explanationEn: initialValues.explanationEn,
    points: initialValues.points,
    correctBoolean: initialValues.correctBoolean,
    correctAnswerFa: initialValues.correctAnswerFa,
    correctAnswerEn: initialValues.correctAnswerEn,
  });
  const [options, setOptions] = useState(initialValues.options);
  const isFa = locale === "fa";
  const isChoice =
    values.type === "single_choice" || values.type === "multiple_choice";

  function updateOption(
    index: number,
    field: "labelFa" | "labelEn",
    value: string,
  ) {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [field]: value } : option,
      ),
    );
  }

  function setCorrect(index: number, checked: boolean) {
    setOptions((current) =>
      current.map((option, optionIndex) => ({
        ...option,
        isCorrect:
          values.type === "single_choice"
            ? optionIndex === index
            : optionIndex === index
              ? checked
              : option.isCorrect,
      })),
    );
  }

  function changeType(value: string) {
    const type = value as ExamQuestionType;
    setValues((current) => ({ ...current, type }));
    if (type === "single_choice") {
      setOptions((current) => {
        const selected = Math.max(
          0,
          current.findIndex((option) => option.isCorrect),
        );
        return current.map((option, index) => ({
          ...option,
          isCorrect: index === selected,
        }));
      });
    }
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="options" value={JSON.stringify(options)} />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          <PanelFormSection
            title={dictionary.exams.faContent}
            description={
              isFa
                ? "متن اصلی سؤال و توضیحی را که پس از پاسخ نمایش داده می‌شود وارد کنید."
                : "Add the primary question prompt and the explanation shown after answering."
            }
          >
            <div className="space-y-5">
              <div>
                <FormLabel label={isFa ? "متن سؤال فارسی" : "Persian prompt"}>
                  <PanelTextarea {...bind("promptFa")} required rows={4} dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.promptFa} />
              </div>
              <div>
                <FormLabel
                  label={isFa ? "توضیح پاسخ فارسی" : "Persian answer explanation"}
                >
                  <PanelTextarea {...bind("explanationFa")} rows={3} dir="rtl" />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.explanationFa} />
              </div>
            </div>
          </PanelFormSection>

          <PanelFormSection
            title={dictionary.exams.enContent}
            description={
              isFa
                ? "نسخه انگلیسی متن سؤال و توضیح پاسخ اختیاری است."
                : "The English question and explanation are optional."
            }
          >
            <div className="space-y-5">
              <div>
                <FormLabel label={isFa ? "متن سؤال انگلیسی" : "English prompt"}>
                  <PanelTextarea
                    {...bind("promptEn")}
                    rows={4}
                    dir="ltr"
                    className="nums-en"
                  />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.promptEn} />
              </div>
              <div>
                <FormLabel
                  label={isFa ? "توضیح پاسخ انگلیسی" : "English answer explanation"}
                >
                  <PanelTextarea
                    {...bind("explanationEn")}
                    rows={3}
                    dir="ltr"
                    className="nums-en"
                  />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.explanationEn} />
              </div>
            </div>
          </PanelFormSection>

          {isChoice ? (
            <PanelFormSection
              title={dictionary.exams.options}
              description={
                values.type === "single_choice"
                  ? isFa
                    ? "بین ۲ تا ۸ گزینه وارد و دقیقاً یک پاسخ صحیح انتخاب کنید."
                    : "Add 2–8 options and select exactly one correct answer."
                  : isFa
                    ? "بین ۲ تا ۸ گزینه وارد و همه پاسخ‌های صحیح را انتخاب کنید."
                    : "Add 2–8 options and select every correct answer."
              }
            >
              <div className="space-y-4">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end dark:border-zinc-800 dark:bg-zinc-900/40"
                  >
                    <label className="flex h-12 cursor-pointer items-center justify-center">
                      <input
                        type={values.type === "single_choice" ? "radio" : "checkbox"}
                        checked={option.isCorrect}
                        onChange={(event) => setCorrect(index, event.target.checked)}
                        className="size-4 accent-emerald-700"
                        aria-label={`${dictionary.exams.correctAnswer} ${index + 1}`}
                      />
                    </label>
                    <FormLabel label={`${isFa ? "گزینه فارسی" : "Persian option"} ${index + 1}`}>
                      <PanelInput
                        value={option.labelFa}
                        onChange={(event) => updateOption(index, "labelFa", event.target.value)}
                        required
                        dir="rtl"
                      />
                    </FormLabel>
                    <FormLabel label={`${isFa ? "گزینه انگلیسی" : "English option"} ${index + 1}`}>
                      <PanelInput
                        value={option.labelEn}
                        onChange={(event) => updateOption(index, "labelEn", event.target.value)}
                        dir="ltr"
                        className="nums-en"
                      />
                    </FormLabel>
                    <button
                      type="button"
                      disabled={options.length <= 2}
                      onClick={() =>
                        setOptions((current) =>
                          current.filter((_, optionIndex) => optionIndex !== index),
                        )
                      }
                      className="h-12 cursor-pointer rounded-xl border border-zinc-200 px-3 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      {dictionary.common.delete}
                    </button>
                  </div>
                ))}
                <FieldError errors={state.fieldErrors?.options} />
                <button
                  type="button"
                  disabled={options.length >= 8}
                  onClick={() =>
                    setOptions((current) => [
                      ...current,
                      { labelFa: "", labelEn: "", isCorrect: false },
                    ])
                  }
                  className={secondaryButtonClass}
                >
                  {isFa ? "افزودن گزینه" : "Add option"}
                </button>
              </div>
            </PanelFormSection>
          ) : null}

          {values.type === "true_false" ? (
            <PanelFormSection title={dictionary.exams.correctAnswer}>
              <div>
                <FormLabel label={dictionary.exams.correctAnswer}>
                  <PanelSelect {...bind("correctBoolean")} required>
                    <option value="">{isFa ? "انتخاب کنید" : "Select an answer"}</option>
                    <option value="true">{isFa ? "درست" : "True"}</option>
                    <option value="false">{isFa ? "نادرست" : "False"}</option>
                  </PanelSelect>
                </FormLabel>
                <FieldError errors={state.fieldErrors?.correctBoolean} />
              </div>
            </PanelFormSection>
          ) : null}

          {values.type === "short_answer" ? (
            <PanelFormSection
              title={dictionary.exams.correctAnswer}
              description={
                isFa
                  ? "پاسخ مورد انتظار فارسی الزامی است؛ نسخه انگلیسی را برای آزمون انگلیسی وارد کنید."
                  : "The expected Persian answer is required; add English for the English exam."
              }
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FormLabel label={isFa ? "پاسخ فارسی" : "Persian answer"}>
                    <PanelInput {...bind("correctAnswerFa")} required dir="rtl" />
                  </FormLabel>
                  <FieldError errors={state.fieldErrors?.correctAnswerFa} />
                </div>
                <div>
                  <FormLabel label={isFa ? "پاسخ انگلیسی" : "English answer"}>
                    <PanelInput
                      {...bind("correctAnswerEn")}
                      dir="ltr"
                      className="nums-en"
                    />
                  </FormLabel>
                  <FieldError errors={state.fieldErrors?.correctAnswerEn} />
                </div>
              </div>
            </PanelFormSection>
          ) : null}
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6">
          <PanelFormSection title={dictionary.exams.examInfo}>
            <div className="space-y-5">
              <div>
                <FormLabel label={dictionary.exams.questionType}>
                  <PanelSelect
                    name="type"
                    value={values.type}
                    onChange={(event) => changeType(event.target.value)}
                  >
                    <option value="single_choice">{dictionary.exams.singleChoice}</option>
                    <option value="multiple_choice">{dictionary.exams.multipleChoice}</option>
                    <option value="true_false">{dictionary.exams.trueFalse}</option>
                    <option value="short_answer">{dictionary.exams.shortAnswer}</option>
                  </PanelSelect>
                </FormLabel>
                <FieldError errors={state.fieldErrors?.type} />
              </div>
              <div>
                <FormLabel label={dictionary.exams.points}>
                  <PanelInput
                    {...bind("points")}
                    type="number"
                    min="1"
                    max="1000"
                    required
                    dir="ltr"
                    className="nums-en"
                  />
                </FormLabel>
                <FieldError errors={state.fieldErrors?.points} />
              </div>
            </div>
          </PanelFormSection>
        </aside>
      </div>

      <PanelFormFooter message={dictionary.exams.description} error={state.error}>
        <Link
          href={`/panel/admin/exams/${examId}/edit`}
          className={secondaryButtonClass}
        >
          {dictionary.common.cancel}
        </Link>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? dictionary.common.saving : dictionary.exams.saveQuestion}
        </button>
      </PanelFormFooter>
    </form>
  );
}
