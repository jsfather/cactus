import { sanitizeRichText } from "@/lib/content/rich-text";
import { RichContent } from "@/components/content/rich-content";
import { PublicIcon, type PublicIconName } from "./icons";

export function ValueCards({
  html,
  dir,
}: {
  html: string;
  dir?: "rtl" | "ltr";
}) {
  const sanitized = sanitizeRichText(html);
  // The editor uses headings to delimit values; content without headings stays intact.
  const cards = sanitized
    .split(/(?=<h[23](?:\s[^>]*)?>)/i)
    .filter((chunk) => chunk.trim());
  const icons: PublicIconName[] = [
    "shop",
    "teachers",
    "courses",
    "honors",
    "software",
    "book",
  ];
  return (
    <div className="value-grid" dir={dir}>
      {cards.map((card, index) => (
        <article className="value-card" key={index}>
          <span className="value-icon">
            <PublicIcon name={icons[index % icons.length]} />
          </span>
          <RichContent html={card} />
        </article>
      ))}
    </div>
  );
}
