import Link from "next/link";
import { primaryButtonClass } from "@/components/panel/ui";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getAdminLandings } from "@/lib/landings/queries";
import { deleteLanding } from "@/lib/landings/actions";
import {
  parseAdminListQuery,
  type AdminListSearchParams,
} from "@/lib/panel/pagination";
import {
  PanelPage,
  PanelPageHeader,
  PanelTable,
  PanelTableCell,
  PanelTableActionLink,
  PanelEditIcon,
  PanelSurface,
  PanelEmptyState,
} from "@/components/panel/ui";
import {
  PanelListControls,
  PanelPagination,
} from "@/components/panel/list-controls";
import { DeleteAction } from "@/components/workflows/action-form";
import { ToastOnMount } from "@/components/feedback/toast-effects";
export default async function LandingList({
  searchParams,
}: {
  searchParams: Promise<AdminListSearchParams>;
}) {
  await requireRole("admin");
  const locale = await getPanelLocale(),
    fa = locale === "fa",
    params = await searchParams,
    query = parseAdminListQuery(params),
    result = await getAdminLandings(query);
  return (
    <PanelPage>
      {(params.success === "created" || params.success === "updated") && (
        <ToastOnMount title={fa ? "لندینگ ذخیره شد." : "Landing saved."} />
      )}
      <PanelPageHeader
        eyebrow={fa ? "مدیریت محتوا" : "Content management"}
        title={fa ? "لندینگ‌ساز" : "Landing builder"}
        description={
          fa
            ? "صفحه مستقل با نشانی کوتاه، بنر میان محتوا و دیدگاه‌های قابل مدیریت."
            : "Standalone pages with root addresses, mid-content banners and moderated comments."
        }
        actions={
          <Link href="/panel/admin/landings/new" className={primaryButtonClass}>
            {fa ? "لندینگ جدید" : "New landing"}
          </Link>
        }
      />
      <PanelSurface>
        <PanelListControls
          action="/panel/admin/landings"
          locale={locale}
          query={query.q}
          searchPlaceholder={fa ? "عنوان یا نشانی…" : "Title or address…"}
        />
        {result.items.length ? (
          <PanelTable
            columns={[
              { label: fa ? "عنوان" : "Title", className: "w-[35%]" },
              { label: fa ? "نشانی" : "Address", className: "w-[30%]" },
              { label: fa ? "وضعیت" : "Status", className: "w-[15%]" },
              { label: fa ? "عملیات" : "Actions", className: "w-[20%]" },
            ]}
          >
            {result.items.map((page) => (
              <tr key={page.id}>
                <PanelTableCell>
                  {fa ? page.titleFa : page.titleEn || page.titleFa}
                </PanelTableCell>
                <PanelTableCell>
                  <a
                    dir="ltr"
                    href={`/${locale === "en" ? "en/" : ""}${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all"
                  >
                    /{page.slug}
                  </a>
                </PanelTableCell>
                <PanelTableCell>
                  {page.status === "published"
                    ? fa
                      ? "منتشرشده"
                      : "Published"
                    : fa
                      ? "پیش‌نویس"
                      : "Draft"}
                </PanelTableCell>
                <PanelTableCell>
                  <PanelTableActionLink
                    href={`/panel/admin/landings/${page.id}`}
                    label={fa ? "ویرایش" : "Edit"}
                  >
                    <PanelEditIcon />
                  </PanelTableActionLink>
                  <DeleteAction
                    locale={locale}
                    action={deleteLanding.bind(null, page.id, locale)}
                  />
                </PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : (
          <PanelEmptyState
            title={fa ? "لندینگی وجود ندارد" : "No landings yet"}
            description={
              fa
                ? "اولین صفحه مستقل را بسازید."
                : "Create your first standalone page."
            }
          />
        )}
        <PanelPagination
          action="/panel/admin/landings"
          locale={locale}
          pagination={result}
          query={query.q ? { q: query.q } : {}}
        />
      </PanelSurface>
    </PanelPage>
  );
}
