"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveExamAnswers, expireExam } from "@/lib/exams/attempt-actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { PanelInput, PanelTextarea } from "@/components/panel/form-controls";
import {
  PanelFormSection,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/panel/ui";
import { text } from "@/lib/workflows";
import type { AnswerMap, ExamSnapshot } from "@/lib/workflow-types";
import type { Locale } from "@/lib/i18n/config";
export type SafeQuestion = Pick<
  ExamSnapshot,
  "id" | "type" | "promptFa" | "promptEn" | "points"
> & { options: { id: string; labelFa: string; labelEn: string | null }[] };
export function ExamRunner({
  id,
  locale,
  questions,
  initial,
  expiresAt,
}: {
  id: string;
  locale: Locale;
  questions: SafeQuestion[];
  initial: AnswerMap;
  expiresAt: string | null;
}) {
  const [answers, setAnswers] = useState(initial);
  const latest = useRef(answers);
  const persisted = useRef(JSON.stringify(initial));
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [now, setNow] = useState(() => Date.now());
  const [pending, start] = useTransition();
  const { confirm, toast } = useFeedback();
  const router = useRouter();
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const remaining = expiresAt
    ? Math.max(0, Math.ceil((Date.parse(expiresAt) - now) / 1000))
    : null;
  useEffect(() => {
    if (remaining === 0) {
      expireExam(id).then(() => router.refresh());
    }
  }, [id, remaining, router]);
  useEffect(() => {
    latest.current = answers;
    if (JSON.stringify(answers) === persisted.current || remaining === 0) return;
    const timer = setTimeout(() => {
      const payload = JSON.stringify(latest.current);
      setSaveStatus("saving");
      queue.current = queue.current.catch(() => {}).then(async () => {
        if (payload === persisted.current) return;
        const form = new FormData();
        form.set("locale", locale);
        form.set("answers", payload);
        const result = await saveExamAnswers(id, false, {}, form);
        if (result.error) { setSaveStatus("error"); return; }
        persisted.current = payload;
        setSaveStatus("saved");
      }).catch(() => setSaveStatus("error"));
    }, 400);
    return () => clearTimeout(timer);
  }, [answers, id, locale, remaining]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (JSON.stringify(latest.current) !== persisted.current) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  async function save(finish: boolean) {
    if (
      finish &&
      !(await confirm({
        title: text(locale, "پایان آزمون؟", "Finish exam?"),
        description: text(
          locale,
          "پس از پایان، پاسخ‌ها قابل تغییر نیستند.",
          "Answers cannot be changed after finishing.",
        ),
        confirmLabel: text(locale, "ثبت نهایی", "Finish"),
      }))
    )
      return;
    start(async () => {
      await queue.current.catch(() => {});
      const form = new FormData();
      const payload = JSON.stringify(latest.current);
      form.set("locale", locale);
      form.set("answers", payload);
      try {
        const r = await saveExamAnswers(id, finish, {}, form);
        if (r.error) { setSaveStatus("error"); toast.error(r.error); }
        else if (r.success) { persisted.current = payload; setSaveStatus("saved"); toast.success(r.success); }
      } catch {
        setSaveStatus("error");
        toast.error(text(locale, "ذخیره انجام نشد. دوباره تلاش کنید.", "Could not save. Please retry."));
      }
    });
  }
  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-white p-4 dark:border-emerald-800 dark:bg-zinc-950">
        <p>
          {text(locale, "پاسخ داده‌شده", "Answered")}:{" "}
          {Object.values(answers).filter((a) => a.length && a[0]).length}/
          {questions.length}
        </p>
        {remaining !== null && (
          <p role="timer">
            {text(locale, "زمان باقی‌مانده", "Time remaining")}:{" "}
            {Math.floor(remaining / 60)}:
            {String(remaining % 60).padStart(2, "0")}
          </p>
        )}
        <button
          className={secondaryButtonClass}
          disabled={pending || remaining === 0}
          onClick={() => save(false)}
        >
          {text(locale, "ذخیره پاسخ‌ها", "Save answers")}
        </button>
      </div>
      <p role="status" className="text-sm text-zinc-500">{saveStatus === "error" ? text(locale, "ذخیره خودکار انجام نشد؛ دوباره ذخیره کنید.", "Autosave failed; please save again.") : saveStatus === "saving" ? text(locale, "در حال ذخیره…", "Saving…") : text(locale, "پاسخ‌ها به‌صورت خودکار ذخیره می‌شوند.", "Answers are saved automatically.")}</p>
      {questions.map((q, index) => (
        <PanelFormSection
          key={q.id}
          title={`${index + 1}. ${locale === "en" ? q.promptEn || q.promptFa : q.promptFa}`}
        >
          <fieldset disabled={pending || remaining === 0}>
            <legend className="sr-only">
              {locale === "en" ? q.promptEn || q.promptFa : q.promptFa}
            </legend>
            {q.type === "short_answer" ? (
              <PanelTextarea
                value={answers[q.id]?.[0] ?? ""}
                onChange={(e) =>
                  setAnswers({ ...answers, [q.id]: [e.target.value] })
                }
              />
            ) : (
              <div className="space-y-3">
                {(q.type === "true_false"
                  ? [
                      { id: "true", labelFa: "درست", labelEn: "True" },
                      { id: "false", labelFa: "نادرست", labelEn: "False" },
                    ]
                  : q.options
                ).map((o) => (
                  <label
                    key={o.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <PanelInput
                      className="!size-4"
                      type={q.type === "multiple_choice" ? "checkbox" : "radio"}
                      name={q.id}
                      checked={(answers[q.id] ?? []).includes(o.id)}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          [q.id]:
                            q.type === "multiple_choice"
                              ? e.target.checked
                                ? [...(answers[q.id] ?? []), o.id]
                                : (answers[q.id] ?? []).filter(
                                    (v) => v !== o.id,
                                  )
                              : [o.id],
                        })
                      }
                    />
                    {locale === "en" ? o.labelEn || o.labelFa : o.labelFa}
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        </PanelFormSection>
      ))}
      <button
        className={primaryButtonClass}
        disabled={pending || remaining === 0}
        onClick={() => save(true)}
      >
        {text(locale, "پایان و ثبت آزمون", "Finish and submit exam")}
      </button>
    </div>
  );
}
