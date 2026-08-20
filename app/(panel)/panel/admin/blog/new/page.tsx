import Link from "next/link";
import { PostForm } from "@/components/blog/post-form";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <Link
          href="/panel/admin/blog"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
        >
          بازگشت به نوشته‌ها
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-zinc-950 dark:text-zinc-50">
          نوشته جدید
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          نسخه فارسی ضروری است و ترجمه انگلیسی را می‌توانید هم‌زمان اضافه کنید.
        </p>
      </header>
      <PostForm />
    </div>
  );
}
