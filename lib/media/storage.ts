import "server-only";

import path from "node:path";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const imageTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;

export type SupportedImageType = keyof typeof imageTypes;

export function getUploadRoot() {
  return path.resolve(
    process.env.UPLOAD_DIR?.trim() || path.join(process.cwd(), ".data", "uploads"),
  );
}

export function resolveUploadPath(parts: string[]) {
  if (
    !parts.length ||
    parts.some((part) => !/^[a-zA-Z0-9._-]+$/.test(part) || part === "." || part === "..")
  ) {
    return null;
  }

  const root = getUploadRoot();
  const resolved = path.resolve(root, ...parts);
  return resolved.startsWith(`${root}${path.sep}`) ? resolved : null;
}

export function hasValidImageSignature(bytes: Uint8Array, mime: SupportedImageType) {
  if (mime === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8;
  if (mime === "image/png") {
    return bytes.slice(0, 8).every((value, index) =>
      value === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index],
    );
  }
  if (mime === "image/gif") {
    const header = String.fromCharCode(...bytes.slice(0, 6));
    return header === "GIF87a" || header === "GIF89a";
  }
  if (mime === "image/webp") {
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    );
  }

  return false;
}
