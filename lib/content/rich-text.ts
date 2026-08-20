import sanitizeHtml from "sanitize-html";

const options: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "h2",
    "h3",
    "h4",
    "strong",
    "em",
    "s",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "hr",
    "br",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  transformTags: {
    a: (_tagName, attribs) => ({
      tagName: "a",
      attribs: {
        ...attribs,
        target: attribs.href?.startsWith("/") ? "_self" : "_blank",
        rel: "noopener noreferrer",
      },
    }),
  },
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function sanitizeRichText(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const html = /<\/?[a-z][\s\S]*>/i.test(trimmed)
    ? trimmed
    : trimmed
        .split(/\n{2,}/)
        .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
        .join("");

  return sanitizeHtml(html, options);
}

export function richTextLength(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
    .replaceAll(/\s+/g, " ")
    .trim().length;
}
