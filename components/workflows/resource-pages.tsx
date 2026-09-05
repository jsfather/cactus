import { SoftwareCatalog } from "./software-catalog";
import { and, asc, eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole, requireUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { resources } from "@/lib/db/schema";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { resourceKind, resourceLabels } from "@/lib/resources/config";
import { saveResource, deleteResource } from "@/lib/resources/actions";
import { text, title } from "@/lib/workflows";
import { ActionForm, DeleteAction } from "./action-form";
import {
  PanelPage,
  PanelPageHeader,
  PanelPrimaryLink,
  PanelSurface,
  PanelTable,
  PanelTableCell,
  PanelTableActions,
  PanelTableActionLink,
  PanelEditIcon,
  PanelEmptyState,
} from "@/components/panel/ui";
import { RichContent } from "@/components/content/rich-content";
import { ToastOnMount } from "@/components/feedback/toast-effects";
import type { Locale } from "@/lib/i18n/config";
export async function ResourceAdmin({
  kind: raw,
  id,
  saved = false,
}: {
  kind: string;
  id?: string;
  saved?: boolean;
}) {
  await requireRole("admin");
  const locale = await getPanelLocale();
  const parsed = resourceKind.safeParse(raw);
  if (!parsed.success) notFound();
  const kind = parsed.data;
  const label = resourceLabels[kind][locale === "fa" ? 0 : 1];
  const base = `/panel/admin/resources/${kind}`;
  if (id) {
    const [item] =
      id === "new"
        ? []
        : await getDatabase()
            .select()
            .from(resources)
            .where(and(eq(resources.id, id), eq(resources.kind, kind)));
    if (id !== "new" && !item) notFound();
    return (
      <PanelPage>
        <PanelPageHeader
          eyebrow={label}
          title={text(locale, "ویرایش محتوا", "Edit content")}
          description=""
        />
        <ActionForm
          locale={locale}
          action={saveResource.bind(null, kind, id === "new" ? null : id)}
          initial={
            item
              ? Object.fromEntries(
                  Object.entries(item).map(([k, v]) => [k, String(v ?? "")]),
                )
              : {}
          }
          fields={[
            ...(kind === "requirements" ? [
              { name: "categoryFa", label: text(locale, "دسته فارسی", "Persian category") },
              { name: "categoryEn", label: text(locale, "دسته انگلیسی", "English category") },
              { name: "platforms", label: text(locale, "سیستم‌عامل‌ها با کاما", "Platforms separated by commas"), hint: "Windows, macOS, Linux, Web" },
              { name: "version", label: text(locale, "نسخه پیشنهادی دوره", "Course-recommended version") },
              { name: "documentationUrl", label: text(locale, "پیوند مستندات", "Documentation URL"), type: "url" },
            ] : []),
            {
              name: "titleFa",
              label: text(locale, "عنوان فارسی", "Persian title"),
              required: true,
            },
            {
              name: "titleEn",
              label: text(locale, "عنوان انگلیسی", "English title"),
            },
            {
              name: "contentFa",
              label: text(locale, "متن فارسی", "Persian content"),
              type: "rich",
              required: true,
            },
            {
              name: "contentEn",
              label: text(locale, "متن انگلیسی", "English content"),
              type: "rich",
            },
            {
              name: "attachmentUrl",
              label: text(locale, "پیوند فایل یا ویدئو", "File or video link"),
              type: "url",
            },
            {
              name: "audience",
              label: text(locale, "مخاطب", "Audience"),
              options: [
                { value: "all", label: text(locale, "همه", "Everyone") },
                ...(["student", "teacher", "admin", "member"] as const).map(
                  (v, i) => ({
                    value: v,
                    label:
                      locale === "fa"
                        ? ["دانش پژوه", "مدرس", "مدیر", "عضو"][i]
                        : v,
                  }),
                ),
              ],
            },
            {
              name: "status",
              label: text(locale, "وضعیت", "Status"),
              options: [
                { value: "draft", label: text(locale, "پیش‌نویس", "Draft") },
                {
                  value: "published",
                  label: text(locale, "منتشرشده", "Published"),
                },
              ],
            },
            {
              name: "sortOrder",
              label: text(locale, "ترتیب", "Order"),
              type: "number",
              min: 0,
            },
          ]}
        />
      </PanelPage>
    );
  }
  const items = await getDatabase()
    .select()
    .from(resources)
    .where(eq(resources.kind, kind))
    .orderBy(asc(resources.sortOrder));
  return (
    <PanelPage>
      {saved && <ToastOnMount title={text(locale, "ذخیره شد", "Saved")} />}
      <PanelPageHeader
        eyebrow={text(locale, "محتوا", "Content")}
        title={label}
        description=""
        actions={
          <PanelPrimaryLink href={`${base}/new`}>
            {text(locale, "ایجاد", "Create")}
          </PanelPrimaryLink>
        }
      />
      <PanelSurface>
        {items.length ? (
          <PanelTable
            columns={[
              { label: text(locale, "عنوان", "Title"), className: "w-[60%]" },
              { label: text(locale, "وضعیت", "Status"), className: "w-[20%]" },
              {
                label: text(locale, "عملیات", "Actions"),
                className: "w-[20%]",
              },
            ]}
          >
            {items.map((item) => (
              <tr key={item.id}>
                <PanelTableCell>{title(item, locale)}</PanelTableCell>
                <PanelTableCell>
                  {text(
                    locale,
                    item.status === "draft" ? "پیش‌نویس" : "منتشرشده",
                    item.status,
                  )}
                </PanelTableCell>
                <PanelTableCell>
                  <PanelTableActions>
                    <PanelTableActionLink
                      href={`${base}/${item.id}`}
                      label={text(locale, "ویرایش", "Edit")}
                    >
                      <PanelEditIcon />
                    </PanelTableActionLink>
                    <DeleteAction
                      locale={locale}
                      action={deleteResource.bind(null, kind, item.id, locale)}
                    />
                  </PanelTableActions>
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={text(locale, "موردی وجود ندارد", "No items yet")}
            description=""
          />
        )}
      </PanelSurface>
    </PanelPage>
  );
}
export async function ResourceContent({
  kind,
  locale,
  audience = "all",
}: {
  kind: "faqs" | "guides" | "requirements";
  locale: Locale;
  audience?: string;
}) {
  const items = await getDatabase()
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.kind, kind),
        eq(resources.status, "published"),
        inArray(resources.audience, ["all", audience]),
      ),
    )
    .orderBy(asc(resources.sortOrder));
  if (kind === "requirements") return <SoftwareCatalog locale={locale} items={items.map(item => ({ ...item, body: <RichContent html={locale === "en" ? item.contentEn || item.contentFa : item.contentFa} /> }))} />;
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <details
          key={item.id}
          className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
          open={kind !== "faqs"}
        >
          <summary className="cursor-pointer text-lg font-bold">
            {title(item, locale)}
          </summary>
          <div className="mt-4">
            <RichContent
              html={
                locale === "en"
                  ? item.contentEn || item.contentFa
                  : item.contentFa
              }
            />
            {item.attachmentUrl && (
              <Link
                className="mt-4 inline-block text-emerald-700 dark:text-emerald-400"
                href={item.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text(locale, "مشاهده فایل", "Open attachment")}
              </Link>
            )}
          </div>
        </details>
      ))}
      {!items.length && (
        <PanelEmptyState
          title={text(
            locale,
            "هنوز محتوایی منتشر نشده",
            "No published content yet",
          )}
          description=""
        />
      )}
    </div>
  );
}
export async function GuidesPage() {
  const user = await requireUser();
  const locale = await getPanelLocale();
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={text(locale, "راهنما", "Help")}
        title={text(locale, "راهنمای پنل", "Panel guides")}
        description=""
      />
      <ResourceContent kind="guides" locale={locale} audience={user.role} />
    </PanelPage>
  );
}
