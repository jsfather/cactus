"use client";

import { useEffect, useId, useRef, useState } from "react";
import { toLatinDigits } from "@/lib/auth/mobile";
import type { Locale } from "@/lib/i18n/config";

const OTP_LENGTH = 6;

function digitsOnly(value: string) {
  return toLatinDigits(value).replace(/\D/g, "").slice(0, OTP_LENGTH);
}

export function OtpCodeInput({ locale, name = "code", error, onValueChange, onComplete }: {
  locale: Locale;
  name?: string;
  error?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}) {
  const [digits, setDigits] = useState(() => Array<string>(OTP_LENGTH).fill(""));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const labelId = useId();
  const errorId = useId();
  const isFa = locale === "fa";
  const value = digits.join("");

  useEffect(() => {
    onValueChange?.(value);
    if (value.length === OTP_LENGTH) onComplete?.(value);
  }, [onComplete, onValueChange, value]);

  useEffect(() => {
    const form = inputs.current[0]?.form;
    if (!form) return;
    let focusFrame = 0;
    const reset = () => {
      setDigits(Array<string>(OTP_LENGTH).fill(""));
      focusFrame = window.requestAnimationFrame(() => {
        inputs.current[0]?.focus();
        inputs.current[0]?.select();
      });
    };
    form.addEventListener("reset", reset);
    return () => {
      form.removeEventListener("reset", reset);
      window.cancelAnimationFrame(focusFrame);
    };
  }, []);

  function focus(index: number) {
    const input = inputs.current[Math.max(0, Math.min(index, OTP_LENGTH - 1))];
    input?.focus();
    input?.select();
  }

  function distribute(rawValue: string, startIndex: number) {
    const incoming = digitsOnly(rawValue);
    if (!incoming) return;
    setDigits((current) => {
      const next = [...current];
      for (let offset = 0; offset < incoming.length && startIndex + offset < OTP_LENGTH; offset += 1) next[startIndex + offset] = incoming[offset];
      return next;
    });
    focus(Math.min(startIndex + incoming.length, OTP_LENGTH - 1));
  }

  return (
    <fieldset className="min-w-0" aria-describedby={error ? errorId : undefined}>
      <legend id={labelId} className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        {isFa ? "کد تأیید ۶ رقمی" : "6-digit verification code"}
      </legend>
      <input type="hidden" name={name} value={value} />
      <div dir="ltr" className="grid grid-cols-6 gap-1.5 sm:gap-2" role="group" aria-labelledby={labelId}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => { inputs.current[index] = element; }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            enterKeyHint={index === OTP_LENGTH - 1 ? "done" : "next"}
            value={digit}
            aria-label={isFa ? `رقم ${index + 1} از ${OTP_LENGTH}` : `Digit ${index + 1} of ${OTP_LENGTH}`}
            aria-invalid={Boolean(error)}
            className="auth-otp-input nums-en h-12 min-w-0 rounded-xl border border-zinc-300 bg-white text-center text-xl font-bold text-zinc-950 caret-emerald-600 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/15"
            autoFocus={index === 0}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => {
              const incoming = digitsOnly(event.target.value);
              if (incoming.length > 1) return distribute(incoming, index);
              setDigits((current) => current.map((item, itemIndex) => itemIndex === index ? incoming : item));
              if (incoming && index < OTP_LENGTH - 1) focus(index + 1);
            }}
            onPaste={(event) => {
              const pasted = digitsOnly(event.clipboardData.getData("text"));
              if (!pasted) return;
              event.preventDefault();
              distribute(pasted, pasted.length === OTP_LENGTH ? 0 : index);
            }}
            onKeyDown={(event) => {
              if (event.key === "Backspace") {
                event.preventDefault();
                if (digits[index]) setDigits((current) => current.map((item, itemIndex) => itemIndex === index ? "" : item));
                else if (index > 0) {
                  setDigits((current) => current.map((item, itemIndex) => itemIndex === index - 1 ? "" : item));
                  focus(index - 1);
                }
              } else if (event.key === "Delete") {
                event.preventDefault();
                setDigits((current) => current.map((item, itemIndex) => itemIndex === index ? "" : item));
              } else if (event.key === "ArrowLeft") {
                event.preventDefault(); focus(index - 1);
              } else if (event.key === "ArrowRight") {
                event.preventDefault(); focus(index + 1);
              } else if (event.key === "Home") {
                event.preventDefault(); focus(0);
              } else if (event.key === "End") {
                event.preventDefault(); focus(OTP_LENGTH - 1);
              }
            }}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs leading-4 text-zinc-500 dark:text-zinc-400">
        {isFa ? "کد را وارد کنید یا همه ۶ رقم را یک‌جا جای‌گذاری کنید." : "Enter the code or paste all 6 digits at once."}
      </p>
      {error ? <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
    </fieldset>
  );
}
