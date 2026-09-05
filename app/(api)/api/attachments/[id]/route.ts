import path from "node:path";
import { readFile } from "node:fs/promises";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  attachments,
  learningActivities,
  homeworkSubmissions,
  ticketMessages,
  tickets,
  resources,
} from "@/lib/db/schema";
import { getActivity, canAccessTerm } from "@/lib/learning/queries";
import { attachmentRoot } from "@/lib/attachments/storage";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse(null, { status: 401 });
  const { id } = await params;
  if (!z.uuid().safeParse(id).success)
    return new NextResponse(null, { status: 404 });
  const db = getDatabase();
  const [item] = await db
    .select()
    .from(attachments)
    .where(eq(attachments.id, id));
  if (!item) return new NextResponse(null, { status: 404 });
  let allowed = user.role === "admin" || item.uploaderId === user.id;
  const url = `/api/attachments/${id}`;
  if (!allowed) {
    const activities = await db
      .select({ id: learningActivities.id })
      .from(learningActivities)
      .where(eq(learningActivities.attachmentUrl, url));
    for (const a of activities)
      if (await getActivity(user, a.id)) allowed = true;
  }
  if (!allowed) {
    const rows = await db
      .select({
        studentId: homeworkSubmissions.studentId,
        termId: learningActivities.termId,
      })
      .from(homeworkSubmissions)
      .innerJoin(
        learningActivities,
        eq(learningActivities.id, homeworkSubmissions.activityId),
      )
      .where(eq(homeworkSubmissions.attachmentUrl, url));
    for (const row of rows)
      if (
        row.studentId === user.id ||
        (await canAccessTerm(user, row.termId, true))
      )
        allowed = true;
  }
  if (!allowed) {
    const [row] = await db
      .select({ id: tickets.id })
      .from(ticketMessages)
      .innerJoin(tickets, eq(tickets.id, ticketMessages.ticketId))
      .where(
        and(
          eq(ticketMessages.attachmentUrl, url),
          or(
            eq(tickets.ownerId, user.id),
            user.role === "teacher"
              ? eq(tickets.assignedToId, user.id)
              : undefined,
          ),
        ),
      );
    allowed = Boolean(row);
  }
  if (!allowed) {
    const [row] = await db
      .select({ id: resources.id })
      .from(resources)
      .where(
        and(
          eq(resources.attachmentUrl, url),
          eq(resources.status, "published"),
          or(eq(resources.audience, "all"), eq(resources.audience, user.role)),
        ),
      );
    allowed = Boolean(row);
  }
  if (!allowed) return new NextResponse(null, { status: 404 });
  if (path.basename(item.pathname) !== item.pathname)
    return new NextResponse(null, { status: 404 });
  try {
    const bytes = await readFile(path.join(attachmentRoot(), item.pathname));
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": item.mimeType,
        "Content-Disposition": `attachment; filename="download.${item.pathname.split(".").pop()}"; filename*=UTF-8''${encodeURIComponent(item.originalName)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "sandbox",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
