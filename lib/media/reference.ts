export function isAllowedImageReference(value: string) {
  if (!value) return true;

  if (value.startsWith("/media/")) {
    return /^\/media\/[a-zA-Z0-9._/-]+$/.test(value) && !value.includes("..") && !value.includes("//");
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
