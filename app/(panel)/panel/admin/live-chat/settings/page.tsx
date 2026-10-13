import { and, eq, inArray } from "drizzle-orm";
import { requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { userNameSql } from "@/lib/learning/queries";
import { getChatSettings } from "@/lib/live-chat/server";
import { saveChatSettings } from "@/lib/live-chat/actions";
import { ActionForm } from "@/components/workflows/action-form";
import { OperatorSelector } from "@/components/support/operator-selector";
import { PanelPage, PanelPageHeader } from "@/components/panel/ui";
export default async function ChatSettingsPage() {
  await requireRole("admin", "support");
  const [locale, settings] = await Promise.all([
    getPanelLocale(),
    getChatSettings(),
  ]);
  const people = await getDatabase()
    .select({ id: users.id, name: userNameSql(locale) })
    .from(users)
    .where(
      and(eq(users.isActive, true), inArray(users.role, ["admin", "teacher"])),
    );
  const t = (fa: string, en: string) => (locale === "fa" ? fa : en);
  return (
    <PanelPage>
      <PanelPageHeader
        title={t("تنظیمات چت آنلاین", "Live chat settings")}
        eyebrow={t("پشتیبانی", "Support")}
        description={t(
          "ساعت پاسخ‌گویی بر اساس ساعت تهران است؛ آنلاین بودن اپراتور نیازمند باز بودن صفحه پاسخ‌گویی است.",
          "Office hours use Tehran time. Operators are online while their inbox remains open.",
        )}
      />
      <ActionForm
        locale={locale}
        action={saveChatSettings}
        initial={Object.fromEntries(
          Object.entries(settings).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(",") : String(value),
          ]),
        )}
        fields={[
          {
            name: "enabled",
            label: t("فعال‌بودن چت", "Enable chat"),
            options: [
              { value: "true", label: t("فعال", "Enabled") },
              { value: "false", label: t("غیرفعال", "Disabled") },
            ],
          },
          { name: "color", label: t("رنگ چت", "Chat color"), type: "color" },
          { name: "logoUrl", label: t("نشان چت", "Chat logo"), type: "image" },
          {
            name: "greetingFa",
            label: t("پیام شروع فارسی", "Persian greeting"),
            type: "textarea",
          },
          {
            name: "greetingEn",
            label: t("پیام شروع انگلیسی", "English greeting"),
            type: "textarea",
          },
          {
            name: "awayFa",
            label: t("پیام خارج از ساعت کاری فارسی", "Persian away message"),
            type: "textarea",
          },
          {
            name: "awayEn",
            label: t("پیام خارج از ساعت کاری انگلیسی", "English away message"),
            type: "textarea",
          },
          {
            name: "startHour",
            label: t("ساعت شروع", "Start hour"),
            type: "number",
            min: 0,
            max: 23,
          },
          {
            name: "endHour",
            label: t("ساعت پایان", "End hour"),
            type: "number",
            min: 1,
            max: 24,
          },
          {
            name: "workingDays",
            label: t("روزهای کاری", "Working days"),
            dir: "ltr",
            hint: t(
              "شماره روزها با کاما: شنبه 6، یکشنبه 0، دوشنبه 1، سه‌شنبه 2، چهارشنبه 3، پنجشنبه 4، جمعه 5",
              "Comma separated: Sunday 0 through Saturday 6",
            ),
          },
          {
            name: "idleMinutes",
            label: t(
              "بستن خودکار پس از عدم ارسال (دقیقه)",
              "Close after inactivity (minutes)",
            ),
            type: "number",
            min: 1,
            max: 1440,
          },
        ]}
      >
        <OperatorSelector
          people={people}
          initial={settings.operatorIds}
          locale={locale}
        />
      </ActionForm>
    </PanelPage>
  );
}
