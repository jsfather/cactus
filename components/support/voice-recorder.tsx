"use client";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { secondaryButtonClass } from "@/components/panel/ui";

export function VoiceRecorder({
  locale,
  onUploaded,
}: {
  locale: Locale;
  onUploaded: (url: string) => void;
}) {
  const fa = locale === "fa";
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  const { toast } = useFeedback();
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  async function start() {
    if (recording || busy) return;
    setBusy(true);
    try {
      if (
        !navigator.mediaDevices?.getUserMedia ||
        typeof MediaRecorder === "undefined" ||
        !MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      )
        throw new Error();
      const captured = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (!alive.current) {
        captured.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = captured;
      const next = new MediaRecorder(captured, {
        mimeType: "audio/webm;codecs=opus",
      });
      recorder.current = next;
      const chunks: Blob[] = [];
      next.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      next.onstop = async () => {
        captured.getTracks().forEach((track) => track.stop());
        if (timer.current) clearTimeout(timer.current);
        if (!alive.current) return;
        setRecording(false);
        setBusy(true);
        try {
          const body = new FormData();
          body.set(
            "file",
            new File(chunks, "voice.webm", { type: "audio/webm" }),
          );
          const response = await fetch("/api/attachments", {
            method: "POST",
            body,
          });
          if (!response.ok) throw new Error();
          const result = await response.json();
          if (alive.current) {
            onUploaded(result.url);
            toast.success(
              fa
                ? "پیام صوتی آمادهٔ ارسال است."
                : "Voice message is ready to send.",
            );
          }
        } catch {
          if (alive.current)
            toast.error(
              fa
                ? "بارگذاری پیام صوتی انجام نشد."
                : "Could not upload voice message.",
            );
        } finally {
          if (alive.current) setBusy(false);
        }
      };
      next.start();
      setRecording(true);
      timer.current = setTimeout(() => {
        if (next.state === "recording") next.stop();
      }, 120000);
    } catch {
      stream.current?.getTracks().forEach((track) => track.stop());
      toast.error(
        fa
          ? "دسترسی به میکروفون یا ضبط WebM در این مرورگر در دسترس نیست."
          : "Microphone access or WebM recording is unavailable in this browser.",
      );
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return (
    <button
      type="button"
      className={secondaryButtonClass}
      disabled={busy}
      onClick={() => (recording ? recorder.current?.stop() : void start())}
    >
      {recording
        ? fa
          ? "■ پایان ضبط و آماده‌سازی"
          : "■ Stop and prepare"
        : busy
          ? fa
            ? "در حال آماده‌سازی…"
            : "Preparing…"
          : fa
            ? "🎙 ضبط پیام صوتی (حداکثر ۲ دقیقه)"
            : "🎙 Record voice (up to 2 minutes)"}
    </button>
  );
}
