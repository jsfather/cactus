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
  landingPages,
} from "@/lib/db/schema";
import { getActivity, canAccessTerm } from "@/lib/learning/queries";
import { attachmentRoot } from "@/lib/attachments/storage";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success)
    return new NextResponse(null, { status: 404 });
  const db = getDatabase();
  const [item] = await db
    .select()
    .from(attachments)
    .where(eq(attachments.id, id));
  if (!item) return new NextResponse(null, { status: 404 });
  const url = `/api/attachments/${id}`;
  // Only deliberately published software downloads and landing videos are anonymous.
  // Learning activities, submissions, tickets and other resources retain their role checks.
  const [publicSoftware] = await db.select({ id: resources.id }).from(resources).where(and(eq(resources.kind, "requirements"), eq(resources.attachmentUrl, url), eq(resources.status, "published"), eq(resources.audience, "all"))).limit(1);
  const [publicVideo] = item.mimeType === "video/mp4" ? await db.select({id: landingPages.id}).from(landingPages).where(and(eq(landingPages.videoUrl, url), eq(landingPages.status, "published"))).limit(1) : [];
  let allowed = Boolean(publicSoftware || publicVideo) || Boolean(user && (user.role === "admin" || item.uploaderId === user.id));
  if (!user && !allowed) return new NextResponse(null, { status: 401 });
  if (!allowed && user) {
    const activities = await db
      .select({ id: learningActivities.id })
      .from(learningActivities)
      .where(eq(learningActivities.attachmentUrl, url));
    for (const a of activities)
      if (await getActivity(user, a.id)) allowed = true;
  }
  if (!allowed && user) {
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
  if (!allowed && user) {
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
  if (!allowed && user) {
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
        "Content-Disposition": `${publicVideo ? "inline" : "attachment"}; filename="download.${item.pathname.split(".").pop()}"; filename*=UTF-8''${encodeURIComponent(item.originalName)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "sandbox",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
