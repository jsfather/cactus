import { sanitizeRichText } from "@/lib/content/rich-text";

export function RichContent({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }}
    />
  );
}
