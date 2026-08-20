import Link from "next/link";
import { DeletePostButton } from "@/components/blog/delete-post-button";
import { getAdminPosts } from "@/lib/blog/queries";

function formatDate(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(date)
    : "—";
}

export default async function AdminBlogPage() {
  const posts = await getAdminPosts();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            محتوای عمومی
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-950 dark:text-zinc-50">
            مدیریت وبلاگ
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            نوشته‌های منتشرشده و پیش‌نویس‌های کاکتوس.
          </p>
        </div>
        <Link
          href="/panel/admin/blog/new"
          className="rounded-xl bg-emerald-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
        >
          نوشته جدید
        </Link>
      </header>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        {posts.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-3xl text-start text-sm">
              <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="px-5 py-4 font-medium">عنوان</th>
                  <th className="px-5 py-4 font-medium">وضعیت</th>
                  <th className="px-5 py-4 font-medium">نویسنده</th>
                  <th className="px-5 py-4 font-medium">تاریخ انتشار</th>
                  <th className="px-5 py-4 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-zinc-950 dark:text-zinc-50">
                        {post.titleFa}
                      </p>
                      <p className="nums-en mt-1 text-xs text-zinc-500" dir="ltr">
                        /blog/{post.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={
                          post.status === "published"
                            ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }
                      >
                        {post.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                      {post.authorName}
                    </td>
                    <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                      {formatDate(post.publishedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <DeletePostButton postId={post.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              هنوز نوشته‌ای ساخته نشده است.
            </p>
            <Link
              href="/panel/admin/blog/new"
              className="mt-4 inline-block font-medium text-emerald-700 dark:text-emerald-400"
            >
              اولین نوشته را بسازید
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
