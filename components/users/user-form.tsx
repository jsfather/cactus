"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  createManagedUser,
  type UserFormState,
  updateManagedUser,
} from "@/app/(panel)/panel/admin/users/actions";
import { usePreservedFields } from "@/components/forms/use-preserved-fields";
import { FieldError, FormLabel, PanelInput } from "@/components/panel/form-controls";
import {
  PanelFormSection,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/panel/ui";
import type { UserRole } from "@/lib/db/schema";
import { userSectionConfig } from "@/lib/users/config";

const initialState: UserFormState = {};

export type UserFormValues = {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
};

export function UserForm({
  role,
  mode = "create",
  userId,
  initialValues = {
    name: "",
    email: "",
    password: "",
    isActive: true,
  },
}: {
  role: UserRole;
  mode?: "create" | "edit";
  userId?: string;
  initialValues?: UserFormValues;
}) {
  const config = userSectionConfig[role];
  const formAction =
    mode === "edit" && userId
      ? updateManagedUser.bind(null, role, userId)
      : createManagedUser.bind(null, role);
  const [state, action, pending] = useActionState(formAction, initialState);
  const { bind } = usePreservedFields({
    name: initialValues.name,
    email: initialValues.email,
    password: initialValues.password,
  });
  const [isActive, setIsActive] = useState(initialValues.isActive);

  return (
    <form action={action} className="space-y-8">
      <PanelFormSection title={`اطلاعات ${config.singular}`}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FormLabel label="نام و نام خانوادگی">
              <PanelInput {...bind("name")} required autoComplete="name" />
            </FormLabel>
            <FieldError errors={state.fieldErrors?.name} />
          </div>

          <div dir="ltr">
            <FormLabel label="Email">
              <PanelInput
                {...bind("email")}
                type="email"
                required
                autoComplete="email"
                className="nums-en text-start"
              />
            </FormLabel>
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <div className="sm:col-span-2" dir="ltr">
            <FormLabel
              label={mode === "edit" ? "New password (optional)" : "Password"}
              hint={
                mode === "edit"
                  ? "Leave empty to keep the current password. Minimum 12 characters when changed."
                  : "Use at least 12 characters."
              }
            >
              <PanelInput
                {...bind("password")}
                type="password"
                required={mode === "create"}
                minLength={mode === "create" ? 12 : undefined}
                autoComplete="new-password"
                className="nums-en text-start"
              />
            </FormLabel>
            <FieldError errors={state.fieldErrors?.password} />
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 sm:col-span-2 dark:border-zinc-800">
            <input
              type="checkbox"
              name="isActive"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="mt-1 size-4 accent-emerald-700"
            />
            <span>
              <span className="block text-sm font-medium">حساب فعال باشد</span>
              <span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                حساب غیرفعال امکان ورود به پنل را ندارد.
              </span>
            </span>
          </label>
        </div>
      </PanelFormSection>

      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          {state.error ? (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {state.error}
            </p>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              نقش این حساب در بخش {config.plural} ثابت می‌ماند.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={config.path} className={secondaryButtonClass}>
            انصراف
          </Link>
          <button type="submit" disabled={pending} className={primaryButtonClass}>
            {pending
              ? "در حال ذخیره…"
              : mode === "edit"
                ? "ذخیره تغییرات"
                : `ساخت ${config.singular}`}
          </button>
        </div>
      </section>
    </form>
  );
}
