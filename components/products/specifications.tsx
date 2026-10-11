import { richTextLength } from "@/lib/content/rich-text";
import { RichContent } from "@/components/content/rich-content";
import { PublicIcon } from "@/components/public/icons";
import type { Locale } from "@/lib/i18n/config";

export function ProductSpecifications({ value, locale, fallback }: { value: string; locale: Locale; fallback: boolean }) {
  // Legacy imports may contain escaped HTML or block markup in a line-based field.
  const html = value.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
  const rows = html.replace(/<\/(?:p|li|tr|div|h[1-6])\s*>|<br\s*\/?\s*>/gi, "\n").replace(/<\/?(?:ul|ol|table|tbody|thead|p|li|tr|div|h[1-6])[^>]*>/gi, "").replace(/<\/t[dh]\s*>/gi, " · ").replace(/<t[dh][^>]*>/gi, "").split("\n").map(v => v.trim()).filter(v => richTextLength(v) > 0);
  return <ul className="specification-list" dir={fallback ? "rtl" : undefined} lang={fallback ? "fa" : locale}>{rows.map((row, i) => <li key={i}><PublicIcon name={i % 2 ? "shop" : "software"} /><RichContent html={row} /></li>)}</ul>;
}
