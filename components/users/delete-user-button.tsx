"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  deleteManagedUser,
  type DeleteUserState,
} from "@/app/(panel)/panel/admin/users/actions";
import { dangerButtonClass } from "@/components/panel/ui";
import type { UserRole } from "@/lib/db/schema";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={dangerButtonClass}
    >
      {pending ? "در حال حذف…" : "حذف"}
    </button>
  );
}

export function DeleteUserButton({
  role,
  userId,
  disabled = false,
}: {
  role: UserRole;
  userId: string;
  disabled?: boolean;
}) {
  const actionWithIdentity = deleteManagedUser.bind(null, role, userId);
  const [state, action] = useActionState<DeleteUserState, FormData>(
    actionWithIdentity,
    {},
  );

  return (
    <div>
      <form
        action={action}
        onSubmit={(event) => {
          if (!window.confirm("این حساب حذف شود؟ این عملیات قابل بازگشت نیست.")) {
            event.preventDefault();
          }
        }}
      >
        <SubmitButton disabled={disabled} />
      </form>
      {state.error ? (
        <p className="mt-1 max-w-44 text-xs leading-5 text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
