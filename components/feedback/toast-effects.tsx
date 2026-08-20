"use client";

import { useEffect, useRef } from "react";
import { useFeedback, type ToastVariant } from "./feedback-provider";

export function useActionErrorToast(state: { error?: string }) {
  const { toast } = useFeedback();
  const lastState = useRef(state);

  useEffect(() => {
    if (lastState.current !== state && state.error) toast.error(state.error);
    lastState.current = state;
  }, [state, toast]);
}

export function ToastOnMount({ title, description, variant = "success" }: { title: string; description?: string; variant?: ToastVariant }) {
  const { toast } = useFeedback();
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast.show({ title, description, variant });
  }, [description, title, toast, variant]);

  return null;
}
