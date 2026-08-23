import { readFile, stat, unlink } from "node:fs/promises";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { studentDocuments, studentInformation } from "@/lib/db/schema";
import { resolveStudentDocumentPath } from "@/lib/student-information/document-storage";

export const runtime = "nodejs";

async function getAuthorizedDocument(id: string) {
  const user = await getCurrentUser();
  if (!user) return { user: null, document: null };
  const parsedId = z.uuid().safeParse(id);
  if (!parsedId.success) return { user, document: null };

  const [document] = await getDatabase().select().from(studentDocuments)
    .where(user.role === "admin"
      ? eq(studentDocuments.id, parsedId.data)
      : and(eq(studentDocuments.id, parsedId.data), eq(studentDocuments.userId, user.id)))
    .limit(1);
  return { user, document: document ?? null };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { user, document } = await getAuthorizedDocument(id);
  if (!user) return new Response(null, { status: 401 });
  if (!document) return new Response(null, { status: 404 });
  const absolutePath = resolveStudentDocumentPath(document.pathname);
  if (!absolutePath) return new Response(null, { status: 404 });

  try {
    const [file, fileStats] = await Promise.all([readFile(absolutePath), stat(absolutePath)]);
    if (!fileStats.isFile()) return new Response(null, { status: 404 });
    const filename = encodeURIComponent(document.originalName);
    const disposition = document.mimeType === "application/pdf" ? "attachment" : "inline";
    return new Response(file, {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Length": String(file.byteLength),
        "Content-Disposition": `${disposition}; filename*=UTF-8''${filename}`,
        "Cache-Control": "private, no-store",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "Cross-Origin-Resource-Policy": "same-origin",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { user, document } = await getAuthorizedDocument(id);
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
  if (!document) return Response.json({ error: "Document not found." }, { status: 404 });

  if (user.role !== "admin") {
    const [information] = await getDatabase().select({ status: studentInformation.status })
      .from(studentInformation)
      .where(eq(studentInformation.userId, user.id))
      .limit(1);
    if (information?.status === "pending" || information?.status === "approved") {
      return Response.json({ error: "This submission cannot be changed." }, { status: 409 });
    }
  }

  await getDatabase().delete(studentDocuments).where(eq(studentDocuments.id, document.id));
  const absolutePath = resolveStudentDocumentPath(document.pathname);
  if (absolutePath) await unlink(absolutePath).catch(() => undefined);
  revalidatePath("/panel/student/information");
  revalidatePath(`/panel/admin/students/${document.userId}/information`);
  return Response.json({ success: true });
}
