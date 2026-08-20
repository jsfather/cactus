"use client";

import { useState, type ChangeEvent } from "react";

type FormControl =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

/**
 * Keeps form fields controlled so React server-action submissions cannot reset
 * the user's input when validation or a database constraint returns an error.
 */
export function usePreservedFields<T extends Record<string, string>>(
  initialValues: T,
) {
  const [values, setValues] = useState(initialValues);

  function bind<K extends keyof T>(name: K) {
    return {
      name: String(name),
      value: values[name],
      onChange: (event: ChangeEvent<FormControl>) => {
        const value = event.target.value;
        setValues((current) => ({ ...current, [name]: value }));
      },
    };
  }

  return { bind, setValues, values };
}
