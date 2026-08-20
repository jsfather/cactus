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
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { localeConfig } from "@/lib/i18n/config";
import { ToastOnMount } from "@/components/feedback/toast-effects";

function formatDate(date: Date | null, locale: "fa" | "en") {
  return date
    ? new Intl.DateTimeFormat(localeConfig[locale].dateLocale, { dateStyle: "medium" }).format(date)
    : "—";
}

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const [posts, locale, query] = await Promise.all([getAdminPosts(), getPanelLocale(), searchParams]);
  const dictionary = getPanelDictionary(locale);

  return (
    <PanelPage>
      {query.toast === "created" ? <ToastOnMount title={locale === "fa" ? "نوشته ساخته شد." : "Post created."} /> : null}
      {query.toast === "updated" ? <ToastOnMount title={locale === "fa" ? "نوشته به‌روز شد." : "Post updated."} /> : null}
      <PanelPageHeader
        eyebrow={dictionary.blog.eyebrow}
        title={dictionary.blog.title}
        description={dictionary.blog.description}
        actions={
          <PanelPrimaryLink href="/panel/admin/blog/new">
            {dictionary.blog.newPost}
          </PanelPrimaryLink>
        }
      />

      <PanelSurface>
        {posts.length ? (
          <PanelTable
            columns={[
              { label: dictionary.common.title, className: "w-[34%]" },
              { label: dictionary.common.status, className: "w-[14%]" },
              { label: dictionary.common.author, className: "w-[18%]" },
              { label: dictionary.common.publishedAt, className: "w-[18%]" },
              { label: dictionary.common.actions, className: "w-[16%]" },
            ]}
          >
                {posts.map((post) => (
                  <tr key={post.id}>
                    <PanelTableCell>
                      <p className="font-medium text-zinc-950 dark:text-zinc-50">
                        {locale === "en" ? post.titleEn || post.titleFa : post.titleFa}
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
                        {post.status === "published" ? dictionary.common.published : dictionary.common.draft}
                      </span>
                    </PanelTableCell>
                    <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                      {post.authorName}
                    </PanelTableCell>
                    <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                      {formatDate(post.publishedAt, locale)}
                    </PanelTableCell>
                    <PanelTableCell>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/panel/admin/blog/${post.id}/edit`}
                          className="rounded-lg px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                        >
                          {dictionary.common.edit}
                        </Link>
                        <DeletePostButton postId={post.id} locale={locale} />
                      </div>
                    </PanelTableCell>
                  </tr>
                ))}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={dictionary.blog.emptyTitle}
            description={dictionary.blog.emptyDescription}
            action={
              <PanelPrimaryLink href="/panel/admin/blog/new">
                {dictionary.blog.newPost}
              </PanelPrimaryLink>
            }
          />
        )}
      </PanelSurface>
    </PanelPage>
  );
}
