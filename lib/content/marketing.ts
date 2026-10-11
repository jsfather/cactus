/** Imported marketing copy sometimes mixes Markdown emphasis with rich HTML. */
export function formatMarketingText(value: string) {
  return value.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
}
