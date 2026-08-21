const FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const configured = process.env.SITE_URL?.trim();
  try {
    return new URL(configured || FALLBACK_SITE_URL);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

export function absoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}
