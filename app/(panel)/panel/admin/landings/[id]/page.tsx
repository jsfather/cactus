import { eq } from "drizzle-orm";
import { z } from "zod";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getDatabase } from "@/lib/db/client";
import { landingPages } from "@/lib/db/schema";
import { LandingForm } from "@/components/landings/landing-form";
import { PanelPage, PanelPageHeader } from "@/components/panel/ui";
export default async function EditLanding({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("admin", "content");
  const locale = await getPanelLocale(),
    { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const [page] = await getDatabase()
    .select()
    .from(landingPages)
    .where(eq(landingPages.id, id));
  if (!page) notFound();
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={locale === "fa" ? "مدیریت محتوا" : "Content management"}
        description={
          locale === "fa"
            ? "محتوا و انتشار صفحه مستقل را مدیریت کنید."
            : "Manage standalone page content and publication."
        }
        title={locale === "fa" ? "ویرایش لندینگ" : "Edit landing"}
      />
      <LandingForm locale={locale} page={page} />
    </PanelPage>
  );
}
