import Link from "next/link";
import { AcademicGuide } from "@/components/terms/academic-guide";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getDatabase } from "@/lib/db/client";
import {
  academicYears,
  academicSemesters,
  courseTemplates,
  termLevels,
  terms,
} from "@/lib/db/schema";
import {
  saveAcademic,
  deleteAcademic,
  archiveSemester,
} from "@/lib/academic/actions";
import {
  ActionForm,
  DeleteAction,
  ActionButton,
  type Field,
} from "@/components/workflows/action-form";
import {
  PanelPage,
  PanelPageHeader,
  PanelSurface,
  PanelPrimaryLink,
  PanelTable,
  PanelTableCell,
  PanelTableActions,
  PanelTableActionLink,
  PanelEditIcon,
} from "@/components/panel/ui";
import { formatPanelDate } from "@/lib/date/panel";
export default async function AcademicPage({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireRole("admin", "education");
  const [{ kind }, query, locale] = await Promise.all([
    params,
    searchParams,
    getPanelLocale(),
  ]);
  if (!["years", "semesters", "templates"].includes(kind)) notFound();
  if (
    query.edit &&
    query.edit !== "new" &&
    !z.uuid().safeParse(query.edit).success
  )
    notFound();
  const db = getDatabase();
  const t = (fa: string, en: string) => (locale === "fa" ? fa : en);
  const table =
    kind === "years"
      ? academicYears
      : kind === "semesters"
        ? academicSemesters
        : courseTemplates;
  const items = await db.select().from(table);
  const item = items.find((row) => row.id === query.edit);
  if (query.edit && query.edit !== "new" && !item) notFound();
  const years = await db
    .select()
    .from(academicYears)
    .orderBy(desc(academicYears.startDate));
  const levels = await db.select().from(termLevels);
  const title =
    kind === "years"
      ? t("سال‌های تحصیلی", "Academic years")
      : kind === "semesters"
        ? t("نیمسال‌ها و آرشیو", "Semesters and archive")
        : t("دوره‌های قابل استفاده مجدد", "Reusable course templates");
  const fields: Field[] = [
    {
      name: "titleFa",
      label: t("عنوان فارسی", "Persian title"),
      required: true,
    },
    { name: "titleEn", label: t("عنوان انگلیسی", "English title") },
  ];
  if (kind === "templates")
    fields.push(
      {
        name: "levelId",
        label: t("سطح", "Level"),
        required: true,
        options: levels.map((level) => ({
          value: level.id,
          label:
            locale === "fa" ? level.titleFa : level.titleEn || level.titleFa,
        })),
      },
      {
        name: "descriptionFa",
        label: t("توضیحات فارسی", "Persian description"),
        type: "textarea",
      },
      {
        name: "descriptionEn",
        label: t("توضیحات انگلیسی", "English description"),
        type: "textarea",
      },
    );
  else {
    fields.push(
      {
        name: "startDate",
        label: t("شروع", "Start"),
        type: "date",
        required: true,
      },
      {
        name: "endDate",
        label: t("پایان", "End"),
        type: "date",
        required: true,
      },
    );
    if (kind === "semesters")
      fields.push({
        name: "yearId",
        label: t("سال تحصیلی", "Academic year"),
        required: true,
        options: years.map((year) => ({
          value: year.id,
          label: locale === "fa" ? year.titleFa : year.titleEn || year.titleFa,
        })),
      });
  }
  const offers =
    kind === "semesters" && item
      ? await db
          .select()
          .from(terms)
          .where(eq(terms.semesterId, item.id))
          .orderBy(desc(terms.startDate))
      : [];
  return (
    <PanelPage>
      <PanelPageHeader
        title={title}
        eyebrow={t("مدیریت آموزش", "Academic management")}
        description={t(
          "دوره ثابت می‌ماند؛ در هر نیمسال یک ارائه با ورودی، پرداخت و نتایج مستقل دارید.",
          "Reuse courses; each semester offering keeps its own intake, payments and results.",
        )}
        actions={
          <PanelPrimaryLink href={`?edit=new`}>
            {t("افزودن", "Add")}
          </PanelPrimaryLink>
        }
      />
      <nav className="flex flex-wrap gap-4">
        {["years", "semesters", "templates"].map((value) => (
          <Link
            key={value}
            className="cursor-pointer text-emerald-600"
            href={`/panel/admin/academic/${value}`}
          >
            {value === "years"
              ? t("سال تحصیلی", "Years")
              : value === "semesters"
                ? t("نیمسال‌ها", "Semesters")
                : t("دوره‌ها", "Templates")}
          </Link>
        ))}
      </nav>
      <AcademicGuide locale={locale} />
      {query.edit && !(item && "archivedAt" in item && item.archivedAt) && (
        <ActionForm
          locale={locale}
          action={saveAcademic.bind(null, kind, item?.id ?? null)}
          fields={fields}
          initial={
            item
              ? Object.fromEntries(
                  Object.entries(item).map(([key, value]) => [
                    key,
                    String(value ?? ""),
                  ]),
                )
              : undefined
          }
        />
      )}
      <PanelSurface>
        <PanelTable
          columns={[
            { label: t("عنوان", "Title"), className: "w-[50%]" },
            { label: t("وضعیت", "Status"), className: "w-[20%]" },
            { label: t("عملیات", "Actions"), className: "w-[30%]" },
          ]}
        >
          {items.map((row) => (
            <tr key={row.id}>
              <PanelTableCell>
                {locale === "fa" ? row.titleFa : row.titleEn || row.titleFa}
                {"startDate" in row && (
                  <p className="mt-2 text-xs">
                    {formatPanelDate(String(row.startDate), locale)} —{" "}
                    {formatPanelDate(String(row.endDate), locale)}
                  </p>
                )}
              </PanelTableCell>
              <PanelTableCell>
                {"archivedAt" in row && row.archivedAt
                  ? t("آرشیو", "Archived")
                  : t("فعال", "Active")}
              </PanelTableCell>
              <PanelTableCell>
                <PanelTableActions>
                  <PanelTableActionLink
                    href={`?edit=${row.id}`}
                    label={t("جزئیات و ویرایش", "Details and edit")}
                  >
                    <PanelEditIcon />
                  </PanelTableActionLink>
                  <DeleteAction
                    locale={locale}
                    action={deleteAcademic.bind(null, kind, row.id, locale)}
                  />
                </PanelTableActions>
              </PanelTableCell>
            </tr>
          ))}
        </PanelTable>
      </PanelSurface>
      {kind === "semesters" && item && (
        <PanelSurface>
          <h2 className="font-bold">
            {t("ارائه‌های این نیمسال", "Semester offerings")}
          </h2>
          <div className="mt-3 space-y-3">
            {offers.map((offer) => (
              <Link
                className="block cursor-pointer text-emerald-600"
                key={offer.id}
                href={`/panel/admin/terms/${offer.id}/edit`}
              >
                {locale === "fa"
                  ? offer.titleFa
                  : offer.titleEn || offer.titleFa}
              </Link>
            ))}
          </div>
          {!("archivedAt" in item && item.archivedAt) && (
            <div className="mt-5">
              <p className="mb-3 text-sm">
                {t(
                  "آرشیو کردن، ثبت‌نام‌های فعال را تکمیل می‌کند و ارائه‌ها را برای حفظ نتایج قفل می‌کند.",
                  "Archiving completes active enrollments and locks offerings to retain results.",
                )}
              </p>
              <ActionButton
                locale={locale}
                label={t(
                  "آرشیو نیمسال و نتایج",
                  "Archive semester and results",
                )}
                action={archiveSemester.bind(null, item.id, locale)}
                confirmation={t(
                  "نیمسال و ارائه‌های آن قفل می‌شوند و نتایج دانش‌پژوهان حفظ می‌شود. ادامه می‌دهید؟",
                  "The semester and its offerings will be locked and student results retained. Continue?",
                )}
              />
            </div>
          )}
        </PanelSurface>
      )}
    </PanelPage>
  );
}
