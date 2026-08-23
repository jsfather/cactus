import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { TeacherProfilePage } from "@/components/teacher-profiles/teacher-profile-page";

export default async function AdminTeacherProfilePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireRole("admin");
  const [{ id }, locale, query] = await Promise.all([params, getPanelLocale(), searchParams]);
  return <TeacherProfilePage teacherId={id} locale={locale} admin saved={query.saved === "1"} />;
}
