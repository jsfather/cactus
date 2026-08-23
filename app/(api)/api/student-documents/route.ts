import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { studentDocumentKind, studentDocuments, studentInformation } from "@/lib/db/schema";
import {
  getStudentDocumentDirectory,
  hasValidStudentDocumentSignature,
  MAX_STUDENT_DOCUMENT_SIZE,
  resolveStudentDocumentPath,
  studentDocumentTypes,
  type StudentDocumentMime,
} from "@/lib/student-information/document-storage";

export const runtime = "nodejs";

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Authentication required.", 401);
  if (user.role !== "student") return errorResponse("Student access required.", 403);

  const [information] = await getDatabase().select({ status: studentInformation.status })
    .from(studentInformation)
    .where(eq(studentInformation.userId, user.id))
    .limit(1);
  if (information?.status === "pending" || information?.status === "approved") {
    return errorResponse("This submission cannot be changed while it is under review or approved.", 409);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_STUDENT_DOCUMENT_SIZE + 1024 * 1024) {
    return errorResponse("The document is too large.", 413);
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = z.enum(studentDocumentKind.enumValues).safeParse(formData.get("kind"));
  if (!(file instanceof File) || !kind.success) {
    return errorResponse("A valid document and document kind are required.", 400);
  }
  if (file.size < 1 || file.size > MAX_STUDENT_DOCUMENT_SIZE) {
    return errorResponse("Documents must be smaller than 5 MB.", 413);
  }
  if (!(file.type in studentDocumentTypes)) {
    return errorResponse("Only JPEG, PNG, WebP, and PDF documents are supported.", 415);
  }

  const mime = file.type as StudentDocumentMime;
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasValidStudentDocumentSignature(bytes, mime)) {
    return errorResponse("The uploaded file signature is invalid.", 415);
  }

  const now = new Date();
  const filename = `${randomUUID()}-${now.getTime()}.${studentDocumentTypes[mime]}`;
  const pathname = ["private", "student-documents", user.id, filename].join("/");
  const directory = getStudentDocumentDirectory(user.id);
  const absolutePath = path.join(directory, filename);
  const originalName = file.name.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 255) || filename;

  await mkdir(directory, { recursive: true });
  await writeFile(absolutePath, bytes, { flag: "wx" });

  try {
    const database = getDatabase();
    const [previous] = await database.select({ pathname: studentDocuments.pathname })
      .from(studentDocuments)
      .where(and(
        eq(studentDocuments.userId, user.id),
        eq(studentDocuments.kind, kind.data),
      ))
      .limit(1);

    const [document] = await database.insert(studentDocuments).values({
      userId: user.id,
      kind: kind.data,
      pathname,
      originalName,
      mimeType: mime,
      size: file.size,
    }).onConflictDoUpdate({
      target: [studentDocuments.userId, studentDocuments.kind],
      set: { pathname, originalName, mimeType: mime, size: file.size, updatedAt: now },
    }).returning({
      id: studentDocuments.id,
      kind: studentDocuments.kind,
      originalName: studentDocuments.originalName,
      mimeType: studentDocuments.mimeType,
      size: studentDocuments.size,
      updatedAt: studentDocuments.updatedAt,
    });

    if (previous?.pathname && previous.pathname !== pathname) {
      const previousPath = resolveStudentDocumentPath(previous.pathname);
      if (previousPath) await unlink(previousPath).catch(() => undefined);
    }
    revalidatePath("/panel/student/information");
    return Response.json(document, { status: 201 });
  } catch (error) {
    await unlink(absolutePath).catch(() => undefined);
    throw error;
  }
}
