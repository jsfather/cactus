import { z } from "zod";
import { detailColorTokens } from "./detail-colors";

export const colorTokens = [
  ["paper", "پس‌زمینه صفحه", "Page background", "#f5f9f8", "#0c1d19"],
  [
    "surface",
    "کارت‌ها و سطح هدر",
    "Cards and header surface",
    "#ffffff",
    "#132722",
  ],
  [
    "surface-soft",
    "سطح ثانویه و کادرها",
    "Secondary surfaces",
    "#edf5f1",
    "#17302b",
  ],
  [
    "ink",
    "متن اصلی و عنوان‌ها",
    "Main text and headings",
    "#14211f",
    "#eef7f3",
  ],
  [
    "muted",
    "توضیحات و متن ثانویه",
    "Descriptions and secondary text",
    "#62776f",
    "#a1b8b0",
  ],
  [
    "line",
    "خط جداکننده و حاشیه کارت",
    "Dividers and card borders",
    "#e3ece7",
    "#28443b",
  ],
  [
    "green",
    "لینک‌ها، آیکن و نشان فعال",
    "Links, icons and active indicators",
    "#008653",
    "#63d6a3",
  ],
  [
    "green-bright",
    "تأکید روشن و نوار بارگذاری",
    "Bright accents and loading bar",
    "#04c37e",
    "#04c37e",
  ],
  ["green-deep", "سطوح تیره برند", "Deep brand surfaces", "#003b30", "#003b30"],
  [
    "button-start",
    "ابتدای گرادیان دکمه اصلی",
    "Primary button gradient start",
    "#009f61",
    "#009f61",
  ],
  [
    "button-end",
    "انتهای گرادیان دکمه اصلی",
    "Primary button gradient end",
    "#007448",
    "#007448",
  ],
  [
    "button-text",
    "نوشته دکمه اصلی",
    "Primary button text",
    "#ffffff",
    "#ffffff",
  ],
  ["hover", "هاور لینک و دکمه", "Link and button hover", "#006740", "#9aefc4"],
  ["footer-bg", "پس‌زمینه فوتر", "Footer background", "#002c24", "#071410"],
  [
    "footer-text",
    "عنوان و متن اصلی فوتر",
    "Footer headings and main text",
    "#edf7f1",
    "#edf7f1",
  ],
  [
    "footer-muted",
    "اطلاعات تماس و متن فرعی فوتر",
    "Footer contact and secondary text",
    "#b5cfc3",
    "#a1b8b0",
  ],
  [
    "footer-hover",
    "هاور پیوندهای فوتر",
    "Footer link hover",
    "#7ee0ab",
    "#9aefc4",
  ],
  ["footer-line", "خط جداکننده فوتر", "Footer divider", "#2c4942", "#28443b"],
  ...detailColorTokens,
] as const;
const paletteShape = Object.fromEntries(
  colorTokens.map(([key]) => [key, z.string().regex(/^#[0-9a-fA-F]{6}$/)]),
);
export const defaultAppearance = {
  light: Object.fromEntries(
    colorTokens.map(([key, , , light]) => [key, light]),
  ),
  dark: Object.fromEntries(colorTokens.map(([key, , , , dark]) => [key, dark])),
  fontSize: 14,
  lineHeight: 1.85,
  headingWeight: 900,
  buttonWeight: 800,
  buttonSize: 13,
};
export const appearanceSchema = z.object({
  light: z.object(paletteShape),
  dark: z.object(paletteShape),
  fontSize: z.coerce.number().min(12).max(20),
  lineHeight: z.coerce.number().min(1.4).max(2.4),
  headingWeight: z.coerce.number().int().min(400).max(900).multipleOf(100),
  buttonWeight: z.coerce.number().int().min(400).max(900).multipleOf(100),
  buttonSize: z.coerce.number().min(12).max(18),
});
export type SiteAppearance = z.infer<typeof appearanceSchema>;
export function appearanceCss(settings: SiteAppearance) {
  const palette = (mode: "light" | "dark") =>
    colorTokens
      .map(([key]) => `--cactus-${key}:${settings[mode][key]};`)
      .join("");
  return `:root{${palette("light")}--cactus-font-size:${settings.fontSize}px;--cactus-font-scale:${settings.fontSize / 14};--cactus-leading:${settings.lineHeight};--cactus-heading-weight:${settings.headingWeight};--cactus-button-weight:${settings.buttonWeight};--cactus-button-size:${settings.buttonSize}px;}html.dark{${palette("dark")}}`;
}
