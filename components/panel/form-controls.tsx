import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { SelectChevron } from "@/components/ui/select-chevron";
import { getPanelInputClass, getPanelSelectClass, panelTextareaClass, type PanelControlSize } from "./ui";

export function FieldError({ errors, id }: { errors?: string[]; id?: string }) {
  return errors?.length ? (
    <p id={id} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
      {errors[0]}
    </p>
  ) : null;
}

export function FormLabel({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block text-start">
      <span className="mb-2 block text-start text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-start text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function PanelInput({
  className = "",
  controlSize = "default",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { controlSize?: PanelControlSize }) {
  return <input {...props} className={`${getPanelInputClass(controlSize)} ${className}`} />;
}

export function PanelTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${panelTextareaClass} ${className}`} />;
}

export function PanelSelect({
  className = "",
  children,
  controlSize = "default",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { controlSize?: PanelControlSize }) {
  return (
    <span className="relative block">
      <select {...props} className={`${getPanelSelectClass(controlSize)} ${className}`}>
        {children}
      </select>
      <SelectChevron />
    </span>
  );
}
