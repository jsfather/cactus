"use client";

import { useActionState, useEffect, useState } from "react";
import { createComment, type CommentFormState } from "@/app/comment-actions";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { FieldError, PanelTextarea } from "@/components/panel/form-controls";
import { primaryButtonClass } from "@/components/panel/ui";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const initialState: CommentFormState = {};
export function CommentForm({ targetType, targetId, slug, locale }: { targetType: "post" | "product"; targetId: string; slug: string; locale: Locale }) { const dictionary = getDictionary(locale); const [body, setBody] = useState(""); const [state, action, pending] = useActionState(createComment.bind(null, targetType, targetId, slug), initialState); const { toast } = useFeedback();
  useEffect(() => {
    if (!state.success) return;
    toast.success(state.success);
    const resetTimer = window.setTimeout(() => setBody(""), 0);
    return () => window.clearTimeout(resetTimer);
  }, [state.success, toast]);
  return <form action={action} className="mt-6 space-y-3"><input type="hidden" name="locale" value={locale} /><PanelTextarea name="body" value={body} onChange={(event) => setBody(event.target.value)} required minLength={2} maxLength={2000} rows={4} placeholder={dictionary.commentPlaceholder} /><FieldError errors={state.fieldErrors?.body} />{state.error ? <p role="alert" className="text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}<button disabled={pending} className={primaryButtonClass}>{pending ? (locale === "fa" ? "در حال ارسال…" : "Submitting…") : dictionary.sendComment}</button></form>;
}
