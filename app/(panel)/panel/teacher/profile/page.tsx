import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { TeacherProfilePage } from "@/components/teacher-profiles/teacher-profile-page";

export default async function OwnTeacherProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [teacher, locale, query] = await Promise.all([requireRole("teacher"), getPanelLocale(), searchParams]);
  return <TeacherProfilePage teacherId={teacher.id} locale={locale} saved={query.saved === "1"} />;
}
