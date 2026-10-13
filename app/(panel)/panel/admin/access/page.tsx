import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { permissionSections } from "@/lib/auth/permissions";
import { deleteAccessProfile } from "@/lib/auth/access-actions";
import { accessProfiles, users } from "@/lib/db/schema";
import { getDatabase } from "@/lib/db/client";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { AccessProfileForm } from "@/components/users/access-profile-form";
import { DeleteAction } from "@/components/workflows/action-form";
import { PanelPage, PanelPageHeader, PanelSurface, PanelPrimaryLink, PanelTable, PanelTableCell, PanelTableActions, PanelTableActionLink, PanelEditIcon } from "@/components/panel/ui";

export default async function AccessPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireRole("admin");
  const [locale, query] = await Promise.all([getPanelLocale(), searchParams]);
  const fa = locale === "fa";
  if (query.edit && query.edit !== "new" && !z.uuid().safeParse(query.edit).success) notFound();
  const profiles = await getDatabase().select({ id: accessProfiles.id, titleFa: accessProfiles.titleFa, titleEn: accessProfiles.titleEn, permissions: accessProfiles.permissions, members: sql<number>`count(${users.id})::int` }).from(accessProfiles).leftJoin(users, eq(users.accessProfileId, accessProfiles.id)).groupBy(accessProfiles.id).orderBy(asc(accessProfiles.titleFa));
  const profile = profiles.find((item) => item.id === query.edit);
  if (query.edit && query.edit !== "new" && !profile) notFound();
  return <PanelPage>
    <PanelPageHeader eyebrow={fa ? "مدیریت" : "Administration"} title={fa ? "عنوان‌های کاری و سطح دسترسی" : "Job titles and permissions"} description={fa ? "عنوانی مثل پشتیبانی، سئو یا مالی بسازید، بخش‌های مجاز را مشخص کنید و در افزودن یا ویرایش همکار آن را انتخاب کنید. تغییر دسترسی عنوان روی همه همکاران آن اعمال می‌شود." : "Create titles such as Support, SEO, or Finance, choose their sections, and assign the title when creating or editing a colleague. Changes apply to everyone with that title."} actions={<PanelPrimaryLink href="?edit=new">{fa ? "عنوان جدید" : "New title"}</PanelPrimaryLink>} />
    {query.edit ? <AccessProfileForm key={profile?.id ?? "new"} locale={locale} profile={profile} /> : null}
    <PanelSurface><PanelTable columns={[{ label: fa ? "عنوان" : "Title", className: "w-[25%]" }, { label: fa ? "بخش‌های مجاز" : "Allowed sections", className: "w-[45%]" }, { label: fa ? "همکاران" : "Colleagues", className: "w-[10%]" }, { label: fa ? "عملیات" : "Actions", className: "w-[20%]" }]}>{profiles.map((item) => <tr key={item.id}><PanelTableCell>{fa ? item.titleFa : item.titleEn}</PanelTableCell><PanelTableCell><div className="flex flex-wrap gap-1">{permissionSections.filter((section) => item.permissions.includes(section.key)).map((section) => <span key={section.key} className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{fa ? section.fa : section.en}</span>)}</div>{!item.permissions.length ? (fa ? "بدون دسترسی مدیریتی" : "No administrative sections") : null}</PanelTableCell><PanelTableCell>{item.members.toLocaleString(fa ? "fa-IR" : "en-US")}</PanelTableCell><PanelTableCell><PanelTableActions><PanelTableActionLink href={`?edit=${item.id}`} label={fa ? "ویرایش دسترسی" : "Edit permissions"}><PanelEditIcon /></PanelTableActionLink><DeleteAction locale={locale} action={deleteAccessProfile.bind(null, item.id, locale)} /></PanelTableActions></PanelTableCell></tr>)}</PanelTable></PanelSurface>
    <Link href="/panel/admin/admins" className="cursor-pointer text-sm font-semibold text-emerald-700 dark:text-emerald-400">{fa ? "افزودن یا ویرایش همکار و تخصیص عنوان دسترسی" : "Create or edit colleagues and assign their access title"}</Link>
  </PanelPage>;
}
