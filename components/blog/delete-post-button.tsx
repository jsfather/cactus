"use client";

import { useFormStatus } from "react-dom";
import { deletePost } from "@/app/(panel)/panel/admin/blog/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/40"
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
