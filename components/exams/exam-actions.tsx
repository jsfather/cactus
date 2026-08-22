"use client";

import { useTransition } from "react";
import {
  deleteExam,
  deleteQuestion,
  moveQuestion,
} from "@/app/(panel)/panel/admin/exams/actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import {
  PanelActionSpinner,
  PanelDeleteIcon,
  PanelEditIcon,
  PanelTableActionButton,
  PanelTableActionLink,
  PanelTableActions,
} from "@/components/panel/ui";
import type { Locale } from "@/lib/i18n/config";

export function DeleteExamButton({
  examId,
  locale,
}: {
  examId: string;
  locale: Locale;
}) {
  const [pending, startTransition] = useTransition();
  const { confirm, toast } = useFeedback();
  const isFa = locale === "fa";

  async function remove() {
    const approved = await confirm({
      title: isFa ? "حذف آزمون؟" : "Delete exam?",
      description: isFa
        ? "آزمون و همه سؤال‌ها و گزینه‌های آن برای همیشه حذف می‌شوند."
        : "The exam and all of its questions and options will be permanently deleted.",
      confirmLabel: isFa ? "حذف آزمون" : "Delete exam",
    });
    if (!approved) return;

    startTransition(async () => {
      try {
        const result = await deleteExam(examId, locale);
        if (result.error) toast.error(result.error);
        else if (result.success) toast.success(result.success);
      } catch {
        toast.error(isFa ? "حذف آزمون انجام نشد." : "The exam could not be deleted.");
      }
    });
  }

  return (
    <PanelTableActionButton
      label={pending ? (isFa ? "در حال حذف…" : "Deleting…") : isFa ? "حذف آزمون" : "Delete exam"}
      tone="danger"
      disabled={pending}
      onClick={remove}
    >
      {pending ? <PanelActionSpinner /> : <PanelDeleteIcon />}
    </PanelTableActionButton>
  );
}

export function QuestionActions({
  examId,
  questionId,
  locale,
  canMoveUp,
  canMoveDown,
}: {
  examId: string;
  questionId: string;
  locale: Locale;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const { confirm, toast } = useFeedback();
  const isFa = locale === "fa";

  function move(direction: "up" | "down") {
    startTransition(async () => {
      try {
        const result = await moveQuestion(examId, questionId, direction, locale);
        if (result.error) toast.error(result.error);
      } catch {
        toast.error(isFa ? "تغییر ترتیب انجام نشد." : "The question could not be moved.");
      }
    });
  }

  async function remove() {
    const approved = await confirm({
      title: isFa ? "حذف سؤال؟" : "Delete question?",
      description: isFa
        ? "این سؤال و گزینه‌های آن برای همیشه حذف می‌شوند."
        : "This question and its options will be permanently deleted.",
      confirmLabel: isFa ? "حذف سؤال" : "Delete question",
    });
    if (!approved) return;

    startTransition(async () => {
      try {
        const result = await deleteQuestion(examId, questionId, locale);
        if (result.error) toast.error(result.error);
        else if (result.success) toast.success(result.success);
      } catch {
        toast.error(isFa ? "حذف سؤال انجام نشد." : "The question could not be deleted.");
      }
    });
  }

  return (
    <PanelTableActions>
      <PanelTableActionButton
        label={isFa ? "انتقال به بالا" : "Move up"}
        disabled={pending || !canMoveUp}
        onClick={() => move("up")}
      >
        <ArrowIcon direction="up" />
      </PanelTableActionButton>
      <PanelTableActionButton
        label={isFa ? "انتقال به پایین" : "Move down"}
        disabled={pending || !canMoveDown}
        onClick={() => move("down")}
      >
        <ArrowIcon direction="down" />
      </PanelTableActionButton>
      <PanelTableActionLink
        href={`/panel/admin/exams/${examId}/questions/${questionId}/edit`}
        label={isFa ? "ویرایش سؤال" : "Edit question"}
      >
        <PanelEditIcon />
      </PanelTableActionLink>
      <PanelTableActionButton
        label={pending ? (isFa ? "در حال انجام…" : "Working…") : isFa ? "حذف سؤال" : "Delete question"}
        tone="danger"
        disabled={pending}
        onClick={remove}
      >
        {pending ? <PanelActionSpinner /> : <PanelDeleteIcon />}
      </PanelTableActionButton>
    </PanelTableActions>
  );
}

function ArrowIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`size-4.5 ${direction === "down" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5.5 12.5 4.5-5 4.5 5" />
    </svg>
  );
}
