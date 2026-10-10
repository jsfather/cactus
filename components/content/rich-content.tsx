import { sanitizeRichText } from "@/lib/content/rich-text";

export function RichContent({
  html,
  className = "",
  dir,
  lang,
}: {
  html: string;
  className?: string;
  dir?: "ltr" | "rtl" | "auto";
  lang?: string;
}) {
  return (
    <div
      className={`rich-content ${className}`}
      dir={dir}
      lang={lang}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }}
    />
  );
}
