import Link from "next/link";
import { PanelEmptyState, PanelPage, PanelPageHeader, PanelPrimaryLink, PanelSurface, PanelTable, PanelTableCell } from "@/components/panel/ui";
import { TermStatusBadge } from "@/components/terms/term-status-badge";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getTeacherTerms } from "@/lib/terms/queries";

export default async function TeacherTermsPage() {
  const [teacher, locale] = await Promise.all([requireRole("teacher"), getPanelLocale()]); const items = await getTeacherTerms(teacher.id); const isFa = locale === "fa";
  return <PanelPage><PanelPageHeader eyebrow={isFa ? "آموزش" : "Learning"} title={isFa ? "ترم‌های من" : "My terms"} description={isFa ? "ترم‌های اختصاص‌داده‌شده، دانش پژوهان و پیوندهای ثبت‌نام را مدیریت کنید." : "Manage your assigned terms, students, and enrollment links."} actions={<PanelPrimaryLink href="/panel/teacher/schedule">{isFa ? "برنامه هفتگی" : "Weekly schedule"}</PanelPrimaryLink>} />
    <PanelSurface>{items.length ? <PanelTable columns={[{ label: isFa ? "ترم" : "Term", className: "w-[38%]" }, { label: isFa ? "وضعیت" : "Status", className: "w-[20%]" }, { label: isFa ? "دانش پژوهان" : "Students", className: "w-[17%]" }, { label: isFa ? "مدیریت" : "Manage", className: "w-[25%]" }]}>{items.map((term) => <tr key={term.id}><PanelTableCell><p className="font-semibold">{locale === "en" ? term.titleEn || term.titleFa : term.titleFa}</p><p className="mt-1 text-xs text-zinc-500">{locale === "en" ? term.levelTitleEn || term.levelTitleFa : term.levelTitleFa}</p></PanelTableCell><PanelTableCell><TermStatusBadge status={term.status} locale={locale} /></PanelTableCell><PanelTableCell>{isFa ? `${term.studentCount.toLocaleString("fa-IR")} نفر` : term.studentCount}</PanelTableCell><PanelTableCell><Link href={`/panel/teacher/terms/${term.id}`} className="inline-flex cursor-pointer rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300">{isFa ? "مدیریت دانش پژوهان" : "Manage students"}</Link></PanelTableCell></tr>)}</PanelTable> : <PanelEmptyState title={isFa ? "ترمی به شما اختصاص داده نشده" : "No assigned terms"} description={isFa ? "پس از اختصاص ترم توسط مدیر، اینجا نمایش داده می‌شود." : "Terms appear here after an administrator assigns them to you."} />}</PanelSurface>
  </PanelPage>;
}
