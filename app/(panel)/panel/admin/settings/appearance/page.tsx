import { requireRole } from "@/lib/auth/session";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getSiteAppearance } from "@/lib/site-content/appearance-server";
import { saveAppearance } from "@/lib/site-content/appearance-actions";
import { colorTokens } from "@/lib/site-content/appearance";
import { ActionForm } from "@/components/workflows/action-form";
import { PanelPage, PanelPageHeader } from "@/components/panel/ui";
export default async function AppearancePage() {
  await requireRole("admin");
  const [locale, settings] = await Promise.all([
    getPanelLocale(),
    getSiteAppearance(),
  ]);
  const fa = locale === "fa";
  const numbers = [
    ["fontSize", "اندازه متن پایه", "Base text size", 12, 20],
    ["lineHeight", "فاصله خطوط", "Line height", 1.4, 2.4],
    ["headingWeight", "وزن عنوان‌ها", "Heading weight", 400, 900],
    ["buttonWeight", "وزن متن دکمه", "Button weight", 400, 900],
    ["buttonSize", "اندازه متن دکمه", "Button text size", 12, 18],
  ] as const;
  const colors = (["light", "dark"] as const).flatMap((mode) =>
    colorTokens.map(([key, labelFa, labelEn, light, dark, ...locations]) => ({
      name: `${mode}-${key}`,
      label: fa ? labelFa : labelEn,
      type: "color",
      dir: "ltr" as const,
      hint:
        locations[0] ||
        `${fa ? "رنگ پیش‌فرض" : "Default color"}: ${mode === "light" ? light : dark}`,
    })),
  );
  return (
    <PanelPage>
      <PanelPageHeader
        eyebrow={fa ? "تنظیمات سایت" : "Site settings"}
        title={fa ? "رنگ‌ها و تایپوگرافی سایت" : "Site colors & typography"}
        description={
          fa
            ? "فونت محلی وزیرمتن حفظ می‌شود. هر رنگ در حالت روشن و تاریک مستقل است؛ خوانایی متن و کنتراست را هنگام انتخاب در نظر بگیرید."
            : "The local Vazirmatn font is preserved. Light and dark palettes are independent; consider readability and contrast."
        }
      />
      <ActionForm
        locale={locale}
        action={saveAppearance}
        initial={Object.fromEntries([
          ...colors.map((f) => [
            f.name,
            settings[f.name.startsWith("light") ? "light" : "dark"][
              f.name.replace(/^(light|dark)-/, "")
            ],
          ]),
          ...numbers.map(([key]) => [key, String(settings[key])]),
        ])}
        fields={[
          ...colors,
          ...numbers.map(([name, labelFa, labelEn, min, max]) => ({
            name,
            label: fa ? labelFa : labelEn,
            type: "number",
            min,
            max,
            step:
              name === "lineHeight" ? 0.05 : name.endsWith("Weight") ? 100 : 1,
          })),
        ]}
        sections={[
          ...(["light", "dark"] as const).map((mode) => ({
            title:
              mode === "light"
                ? fa
                  ? "حالت روشن"
                  : "Light mode"
                : fa
                  ? "حالت تاریک"
                  : "Dark mode",
            fields: colors
              .filter((f) => f.name.startsWith(mode))
              .map((f) => f.name),
          })),
          {
            title: fa ? "تایپوگرافی" : "Typography",
            fields: numbers.map(([key]) => key),
          },
        ]}
      />
    </PanelPage>
  );
}
