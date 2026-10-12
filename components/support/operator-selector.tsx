"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { PanelFormSection } from "@/components/panel/ui";
export function OperatorSelector({
  people,
  initial,
  locale,
}: {
  people: { id: string; name: string }[];
  initial: string[];
  locale: Locale;
}) {
  const [selected, setSelected] = useState(initial);
  return (
    <PanelFormSection
      title={locale === "fa" ? "اپراتورهای مجاز" : "Authorized operators"}
    >
      {people.map((person) => (
        <label
          key={person.id}
          className="flex cursor-pointer items-center gap-3 p-2"
        >
          <input
            type="checkbox"
            name="operatorIds"
            value={person.id}
            checked={selected.includes(person.id)}
            onChange={(event) =>
              setSelected((current) =>
                event.target.checked
                  ? [...current, person.id]
                  : current.filter((id) => id !== person.id),
              )
            }
          />
          <span>{person.name}</span>
        </label>
      ))}
    </PanelFormSection>
  );
}
