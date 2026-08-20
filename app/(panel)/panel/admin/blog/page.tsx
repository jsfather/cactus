import Link from "next/link";
import { DeletePostButton } from "@/components/blog/delete-post-button";
import {
  PanelEmptyState,
  PanelPage,
  PanelPageHeader,
  PanelPrimaryLink,
  PanelSurface,
  PanelTable,
  PanelTableCell,
} from "@/components/panel/ui";
import { getAdminPosts } from "@/lib/blog/queries";

function formatDate(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(date)
    : "—";
}

export default async function AdminBlogPage() {
  const posts = await getAdminPosts();

  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow="محتوای عمومی"
        title="مدیریت وبلاگ"
        description="نوشته‌های فارسی و انگلیسی را ایجاد، مشاهده، ویرایش یا حذف کنید."
        actions={
          <PanelPrimaryLink href="/panel/admin/blog/new">
            نوشته جدید
          </PanelPrimaryLink>
        }
      />

      <PanelSurface>
        {posts.length ? (
          <PanelTable
            columns={[
              { label: "عنوان", className: "w-[34%]" },
              { label: "وضعیت", className: "w-[14%]" },
              { label: "نویسنده", className: "w-[18%]" },
              { label: "تاریخ انتشار", className: "w-[18%]" },
              { label: "عملیات", className: "w-[16%]" },
            ]}
          >
                {posts.map((post) => (
                  <tr key={post.id}>
                    <PanelTableCell>
                      <p className="font-medium text-zinc-950 dark:text-zinc-50">
                        {post.titleFa}
                      </p>
                      <p
                        className="nums-en mt-1 text-end text-xs text-zinc-500"
                        dir="ltr"
                      >
                        /blog/{post.slug}
                      </p>
                    </PanelTableCell>
                    <PanelTableCell>
                      <span
                        className={
                          post.status === "published"
                            ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }
                      >
                        {post.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                      </span>
                    </PanelTableCell>
                    <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                      {post.authorName}
                    </PanelTableCell>
                    <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                      {formatDate(post.publishedAt)}
                    </PanelTableCell>
                    <PanelTableCell>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/panel/admin/blog/${post.id}/edit`}
                          className="rounded-lg px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                        >
                          ویرایش
                        </Link>
                        <DeletePostButton postId={post.id} />
                      </div>
                    </PanelTableCell>
                  </tr>
                ))}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title="هنوز نوشته‌ای وجود ندارد"
            description="یک نوشته جدید بسازید تا در وبلاگ عمومی کاکتوس نمایش داده شود."
            action={
              <PanelPrimaryLink href="/panel/admin/blog/new">
                اولین نوشته را بسازید
              </PanelPrimaryLink>
            }
          />
        )}
      </PanelSurface>
    </PanelPage>
  );
}
