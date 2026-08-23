import "server-only";

import path from "node:path";
import { getUploadRoot, hasValidImageSignature, imageTypes } from "@/lib/media/storage";

export const MAX_STUDENT_DOCUMENT_SIZE = 5 * 1024 * 1024;

export const studentDocumentTypes = {
  ...imageTypes,
  "application/pdf": "pdf",
} as const;

export type StudentDocumentMime = keyof typeof studentDocumentTypes;

export function hasValidStudentDocumentSignature(bytes: Uint8Array, mime: StudentDocumentMime) {
  if (mime === "application/pdf") {
    return String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-";
  }
  return hasValidImageSignature(bytes, mime);
}

export function resolveStudentDocumentPath(pathname: string) {
  const parts = pathname.split("/");
  if (
    parts.length < 4 ||
    parts[0] !== "private" ||
    parts[1] !== "student-documents" ||
    parts.some((part) => !/^[a-zA-Z0-9._-]+$/.test(part) || part === "." || part === "..")
  ) {
    return null;
  }
  const root = getUploadRoot();
  const resolved = path.resolve(root, ...parts);
  return resolved.startsWith(`${root}${path.sep}`) ? resolved : null;
}

export function getStudentDocumentDirectory(userId: string) {
  return path.join(getUploadRoot(), "private", "student-documents", userId);
}

