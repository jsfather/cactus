import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { SelectChevron } from "@/components/ui/select-chevron";
import { panelInputClass, panelSelectClass } from "./ui";

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
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function PanelInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${panelInputClass} ${className}`} />;
}

export function PanelSelect({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select {...props} className={`${panelSelectClass} ${className}`}>
        {children}
      </select>
      <SelectChevron />
    </span>
  );
}
