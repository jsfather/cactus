import { DeletePostButton } from "@/components/blog/delete-post-button";
import {
  PanelEmptyState,
  PanelPage,
  PanelPageHeader,
  PanelPrimaryLink,
  PanelSurface,
  PanelTable,
  PanelTableActions,
  PanelTableActionLink,
  PanelTableCell,
  PanelEditIcon,
} from "@/components/panel/ui";
import { getAdminPosts } from "@/lib/blog/queries";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { localeConfig } from "@/lib/i18n/config";
import { ToastOnMount } from "@/components/feedback/toast-effects";
import { PanelListControls, PanelPagination } from "@/components/panel/list-controls";
import { getSearchParam, parseAdminListQuery, type AdminListSearchParams } from "@/lib/panel/pagination";
import type { PostStatusFilter } from "@/lib/blog/queries";

function formatDate(date: Date | null, locale: "fa" | "en") {
  return date
    ? new Intl.DateTimeFormat(localeConfig[locale].dateLocale, { dateStyle: "medium" }).format(date)
    : "—";
}

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<AdminListSearchParams> }) {
  const [locale, query] = await Promise.all([getPanelLocale(), searchParams]);
  const listQuery = parseAdminListQuery(query);
  const statusValue = getSearchParam(query, "status");
  const status: PostStatusFilter = statusValue === "draft" || statusValue === "published" || statusValue === "scheduled" ? statusValue : "all";
  const posts = await getAdminPosts(locale, { ...listQuery, status });
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
        <PanelListControls
          action="/panel/admin/blog"
          locale={locale}
          query={listQuery.q}
          searchPlaceholder={locale === "fa" ? "جست‌وجوی عنوان، نشانی، برچسب یا نویسنده…" : "Search title, URL, tag, or author…"}
          filters={[{
            name: "status",
            label: dictionary.common.status,
            value: status,
            options: [
              { value: "all", label: locale === "fa" ? "همه وضعیت‌ها" : "All statuses" },
              { value: "draft", label: dictionary.common.draft },
              { value: "published", label: dictionary.common.published },
              { value: "scheduled", label: locale === "fa" ? "زمان‌بندی‌شده" : "Scheduled" },
            ],
          }]}
        />
        {posts.items.length ? (
          <PanelTable
            columns={[
              { label: dictionary.common.title, className: "w-[34%]" },
              { label: dictionary.common.status, className: "w-[14%]" },
              { label: dictionary.common.author, className: "w-[18%]" },
              { label: dictionary.common.publishedAt, className: "w-[18%]" },
              { label: dictionary.common.actions, className: "w-[16%]" },
            ]}
          >
                {posts.items.map((post) => {
                  const isScheduled = post.status === "published" && post.publishedAt && post.publishedAt > new Date();
                  return (
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
                        {isScheduled ? (locale === "fa" ? "زمان‌بندی‌شده" : "Scheduled") : post.status === "published" ? dictionary.common.published : dictionary.common.draft}
                      </span>
                    </PanelTableCell>
                    <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                      {post.authorName}
                    </PanelTableCell>
                    <PanelTableCell className="text-zinc-600 dark:text-zinc-400">
                      {formatDate(post.publishedAt, locale)}
                    </PanelTableCell>
                    <PanelTableCell>
                      <PanelTableActions>
                        <PanelTableActionLink
                          href={`/panel/admin/blog/${post.id}/edit`}
                          label={dictionary.common.edit}
                        >
                          <PanelEditIcon />
                        </PanelTableActionLink>
                        <DeletePostButton postId={post.id} locale={locale} />
                      </PanelTableActions>
                    </PanelTableCell>
                  </tr>
                  );
                })}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={listQuery.q || status !== "all" ? (locale === "fa" ? "نوشته‌ای پیدا نشد" : "No matching posts") : dictionary.blog.emptyTitle}
            description={listQuery.q || status !== "all" ? (locale === "fa" ? "عبارت جست‌وجو یا فیلترها را تغییر دهید." : "Try changing the search term or filters.") : dictionary.blog.emptyDescription}
            action={!listQuery.q && status === "all" ?
              <PanelPrimaryLink href="/panel/admin/blog/new">
                {dictionary.blog.newPost}
              </PanelPrimaryLink>
            : undefined}
          />
        )}
        <PanelPagination action="/panel/admin/blog" locale={locale} pagination={posts} query={{ ...(listQuery.q ? { q: listQuery.q } : {}), ...(status !== "all" ? { status } : {}) }} />
      </PanelSurface>
    </PanelPage>
  );
}
