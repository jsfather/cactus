"use client";

import { useFormStatus } from "react-dom";
import { deletePost } from "@/app/(panel)/panel/admin/blog/actions";
import { dangerButtonClass } from "@/components/panel/ui";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={dangerButtonClass}
    >
      {pending ? "در حال حذف…" : "حذف"}
    </button>
  );
}

export function DeletePostButton({ postId }: { postId: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(event) => {
        if (!window.confirm("این نوشته حذف شود؟ این عملیات قابل بازگشت نیست.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="postId" value={postId} />
      <SubmitButton />
    </form>
  );
}
