"use client";
import { AttachmentField } from "./attachment-field";
import {
  PanelDatePicker,
  PanelTimePicker,
} from "@/components/panel/date-time-picker";
import {
  createContext,
  useActionState,
  useEffect,
  useRef,
  useTransition,
} from "react";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { useFeedback } from "@/components/feedback/feedback-provider";
import { useActionErrorToast } from "@/components/feedback/toast-effects";
import {
  FieldError,
  FormLabel,
  PanelInput,
  PanelSelect,
  PanelTextarea,
} from "@/components/panel/form-controls";
import {
  PanelFormFooter,
  PanelFormSection,
  PanelTableActionButton,
  PanelDeleteIcon,
  primaryButtonClass,
} from "@/components/panel/ui";
import { RichTextEditor } from "@/components/content/rich-text-editor";
import { ImageUploadField } from "@/components/media/image-upload-field";
import type { Locale } from "@/lib/i18n/config";
import { text, type ActionState } from "@/lib/workflows";
export const ActionFormFieldErrors = createContext<
  Record<string, string[] | undefined> | undefined
>(undefined);
export type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  dir?: "ltr" | "rtl";
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  defaultColor?: string;
};
export function ActionForm({
  locale,
  action,
  fields,
  initial = {},
  heading,
  submitLabel,
  children,
  sections,
}: {
  locale: Locale;
  action: (state: ActionState, data: FormData) => Promise<ActionState>;
  fields: Field[];
  initial?: Record<string, string>;
  heading?: string;
  submitLabel?: string;
  children?: React.ReactNode;
  sections?: { title: string; fields: string[]; sidebar?: boolean }[];
}) {
  const [state, submit, pending] = useActionState(action, {});
  const { bind, bindValue, values, setValues } = usePreservedFields(
    Object.fromEntries(
      fields.map((f) => [
        f.name,
        initial[f.name] ?? f.options?.[0]?.value ?? "",
      ]),
    ),
  );
  const { toast } = useFeedback();
  const last = useRef(state);
  useActionErrorToast(state);
  useEffect(() => {
    if (state !== last.current && state.success) toast.success(state.success);
    last.current = state;
  }, [state, toast]);
  const renderField = (f: Field, sidebar = false) => (
    <div
      key={f.name}
      className={`min-w-0 ${!sidebar && ["rich", "textarea", "image"].includes(f.type ?? "") ? "sm:col-span-2" : ""}`}
    >
      {f.name === "attachmentUrl" || f.type === "video" ? (
        <AttachmentField
          name={f.name}
          label={f.label}
          locale={locale}
          initialValue={initial[f.name]}
          videoOnly={f.type === "video"}
        />
      ) : f.type === "rich" ? (
        <>
          <p className="mb-2 text-sm font-medium">{f.label}</p>
          <RichTextEditor
            name={f.name}
            locale={locale}
            initialValue={initial[f.name] ?? ""}
            contentDirection={f.name.endsWith("En") ? "ltr" : "rtl"}
            required={f.required}
          />
        </>
      ) : f.type === "image" ? (
        <ImageUploadField
          name={f.name}
          locale={locale}
          kind="content"
          initialValue={initial[f.name]}
          label={f.label}
        />
      ) : f.type === "color" ? (
        <fieldset className="min-w-0">
          <legend className="mb-2 text-start text-sm font-medium">
            {f.label}
          </legend>
          <div className="flex items-center gap-3">
            <PanelInput
              type="color"
              aria-label={f.label}
              className="max-w-16 cursor-pointer p-1"
              value={
                /^#[0-9a-fA-F]{6}$/.test(values[f.name])
                  ? values[f.name]
                  : "#000000"
              }
              onChange={bind(f.name).onChange}
            />
            <PanelInput
              {...bind(f.name)}
              dir="ltr"
              className="nums-en"
              required
              pattern="#[0-9a-fA-F]{6}"
              maxLength={7}
              aria-label={`${f.label} HEX`}
            />
          </div>
          {f.hint && (
            <p className="mt-1.5 break-words text-start text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {f.hint}
            </p>
          )}
          {f.defaultColor && (
            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
              <span
                aria-hidden="true"
                className="size-5 rounded-md border border-zinc-300 dark:border-zinc-600"
                style={{ backgroundColor: f.defaultColor }}
              />
              <span>{locale === "fa" ? "رنگ پیش‌فرض" : "Default color"}</span>
            </div>
          )}
        </fieldset>
      ) : (
        <FormLabel label={f.label} hint={f.hint}>
          {f.type === "date" ? (
            <PanelDatePicker
              locale={locale}
              {...bindValue(f.name)}
              required={f.required}
              aria-label={f.label}
            />
          ) : f.type === "datetime-local" ? (
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              <PanelDatePicker
                locale={locale}
                value={values[f.name].split("T")[0]}
                onValueChange={(date) =>
                  setValues((current) => ({
                    ...current,
                    [f.name]: date
                      ? `${date}T${current[f.name].split("T")[1]?.slice(0, 5) || "00:00"}`
                      : "",
                  }))
                }
                required={f.required}
                aria-label={f.label}
              />
              <PanelTimePicker
                locale={locale}
                value={values[f.name].split("T")[1]?.slice(0, 5) || "00:00"}
                onValueChange={(time) =>
                  setValues((current) => ({
                    ...current,
                    [f.name]: current[f.name]
                      ? `${current[f.name].split("T")[0]}T${time}`
                      : "",
                  }))
                }
                aria-label={f.label}
              />
              <input type="hidden" name={f.name} value={values[f.name]} />
            </div>
          ) : f.options ? (
            <PanelSelect {...bind(f.name)} required={f.required}>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </PanelSelect>
          ) : f.type === "textarea" ? (
            <PanelTextarea
              {...bind(f.name)}
              rows={4}
              required={f.required}
              dir={
                f.dir ??
                (f.name.endsWith("En")
                  ? "ltr"
                  : f.name.endsWith("Fa")
                    ? "rtl"
                    : undefined)
              }
            />
          ) : (
            <PanelInput
              {...bind(f.name)}
              type={f.type ?? "text"}
              required={f.required}
              min={f.min}
              max={f.max}
              step={f.step}
              dir={
                f.dir ??
                (f.name.endsWith("En") ||
                ["url", "number", "datetime-local", "date"].includes(
                  f.type ?? "",
                )
                  ? "ltr"
                  : f.name.endsWith("Fa")
                    ? "rtl"
                    : undefined)
              }
            />
          )}
        </FormLabel>
      )}
      <FieldError errors={state.fieldErrors?.[f.name]} />
    </div>
  );
  return (
    <ActionFormFieldErrors.Provider value={state.fieldErrors}>
      <form
        action={submit}
        onReset={(event) => event.preventDefault()}
        className="space-y-5"
      >
        <input type="hidden" name="locale" value={locale} />
        {sections ? (
          <div
            className={`grid items-start gap-6 ${sections.some((section) => section.sidebar) ? "2xl:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]" : ""}`}
          >
            <div className="min-w-0 space-y-6">
              {sections
                .filter((section) => !section.sidebar)
                .map((section) => (
                  <PanelFormSection title={section.title} key={section.title}>
                    <div className="grid gap-5 sm:grid-cols-2">
                      {section.fields
                        .map((name) => fields.find((f) => f.name === name))
                        .filter((f): f is Field => Boolean(f))
                        .map((f) => renderField(f))}
                    </div>
                  </PanelFormSection>
                ))}
              {children}
            </div>
            {sections.some((section) => section.sidebar) && (
              <aside className="min-w-0 space-y-6">
                {sections
                  .filter((section) => section.sidebar)
                  .map((section) => (
                    <PanelFormSection title={section.title} key={section.title}>
                      <div className="grid gap-5">
                        {section.fields
                          .map((name) => fields.find((f) => f.name === name))
                          .filter((f): f is Field => Boolean(f))
                          .map((f) => renderField(f, true))}
                      </div>
                    </PanelFormSection>
                  ))}
              </aside>
            )}
          </div>
        ) : (
          <PanelFormSection
            title={heading ?? text(locale, "اطلاعات", "Details")}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((f) => renderField(f))}
              {children}
              {state.fieldErrors?.sections && (
                <FieldError errors={state.fieldErrors.sections} />
              )}
            </div>
          </PanelFormSection>
        )}
        <PanelFormFooter error={state.error}>
          <button className={primaryButtonClass} disabled={pending}>
            {pending
              ? text(locale, "در حال ذخیره…", "Saving…")
              : (submitLabel ?? text(locale, "ذخیره", "Save"))}
          </button>
        </PanelFormFooter>
      </form>
    </ActionFormFieldErrors.Provider>
  );
}
export function DeleteAction({
  locale,
  action,
}: {
  locale: Locale;
  action: () => Promise<ActionState>;
}) {
  const { confirm, toast } = useFeedback();
  const [pending, start] = useTransition();
  return (
    <PanelTableActionButton
      tone="danger"
      label={text(locale, "حذف", "Delete")}
      disabled={pending}
      onClick={async () => {
        if (
          await confirm({
            title: text(locale, "حذف این مورد؟", "Delete this item?"),
            description: text(
              locale,
              "این عملیات قابل بازگشت نیست.",
              "This action cannot be undone.",
            ),
            confirmLabel: text(locale, "حذف", "Delete"),
          })
        )
          start(async () => {
            const result = await action();
            if (result.error) toast.error(result.error);
            else if (result.success) toast.success(result.success);
          });
      }}
    >
      <PanelDeleteIcon />
    </PanelTableActionButton>
  );
}
export function ActionButton({
  locale,
  action,
  label,
  confirmation,
}: {
  locale: Locale;
  action: () => Promise<ActionState>;
  label: string;
  confirmation?: string;
}) {
  const { toast, confirm } = useFeedback();
  const [pending, start] = useTransition();
  return (
    <button
      className={primaryButtonClass}
      disabled={pending}
      onClick={async () => {
        if (
          confirmation &&
          !(await confirm({
            title: label,
            description: confirmation,
            confirmLabel: label,
          }))
        )
          return;
        start(async () => {
          try {
            const r = await action();
            if (r.error) toast.error(r.error);
            else if (r.success) toast.success(r.success);
          } catch {
            toast.error(
              text(
                locale,
                "عملیات انجام نشد.",
                "The action could not be completed.",
              ),
            );
          }
        });
      }}
    >
      {label}
    </button>
  );
}
