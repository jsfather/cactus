import { isAdministrator } from "@/lib/auth/permissions";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, isNull, lt, lte, ne, or } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { tickets, ticketMessages } from "@/lib/db/schema";
import { getTicketChat } from "@/lib/support/ticket-chat";
const response = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser(),
    { id } = await params;
  if (!user) return response({ error: "Unauthorized" }, 401);
  if (!z.uuid().safeParse(id).success)
    return response({ error: "Not found" }, 404);
  try {
    const page = z.coerce
        .number()
        .int()
        .min(1)
        .max(100000)
        .catch(1)
        .parse(request.nextUrl.searchParams.get("page") ?? 1),
      data = await getTicketChat(
        user,
        id,
        request.nextUrl.searchParams.get("locale") === "en" ? "en" : "fa",
        page,
      );
    return data ? response(data) : response({ error: "Not found" }, 404);
  } catch {
    return response({ error: "Unavailable" }, 503);
  }
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const origin = request.headers.get("origin");
  if (
    !origin ||
    (origin !== request.nextUrl.origin && origin !== process.env.SITE_URL)
  )
    return response({ error: "Forbidden" }, 403);
  if (Number(request.headers.get("content-length") ?? 0) > 4096)
    return response({ error: "Too large" }, 413);
  const user = await getCurrentUser(),
    { id } = await params;
  if (!user) return response({ error: "Unauthorized" }, 401);
  if (!z.uuid().safeParse(id).success)
    return response({ error: "Not found" }, 404);
  try {
    const parsed = z
      .object({
        operation: z.enum(["read", "typing"]),
        lastMessageId: z.uuid().optional(),
        typing: z.boolean().default(false),
      })
      .safeParse(await request.json());
    if (!parsed.success) return response({ error: "Invalid request" }, 400);
    const result = await getDatabase().transaction(async (tx) => {
      const [ticket] = await tx
        .select()
        .from(tickets)
        .where(
          and(
            eq(tickets.id, id),
            isAdministrator(user, "support")
              ? undefined
              : or(
                  eq(tickets.ownerId, user.id),
                  user.role === "teacher"
                    ? eq(tickets.assignedToId, user.id)
                    : undefined,
                ),
          ),
        )
        .for("update");
      if (!ticket) return false;
      const owner = ticket.ownerId === user.id;
      if (parsed.data.operation === "typing") {
        if (ticket.status === "closed") return false;
        await tx
          .update(tickets)
          .set(
            owner
              ? { ownerTypingAt: parsed.data.typing ? new Date() : null }
              : { staffTypingAt: parsed.data.typing ? new Date() : null },
          )
          .where(eq(tickets.id, id));
        return true;
      }
      if (!parsed.data.lastMessageId) return false;
      const [marker] = await tx
        .select({ id: ticketMessages.id, createdAt: ticketMessages.createdAt })
        .from(ticketMessages)
        .where(
          and(
            eq(ticketMessages.id, parsed.data.lastMessageId),
            eq(ticketMessages.ticketId, id),
          ),
        )
        .limit(1);
      if (!marker) return false;
      await tx
        .update(ticketMessages)
        .set({ readAt: new Date() })
        .where(
          and(
            eq(ticketMessages.ticketId, id),
            owner
              ? ne(ticketMessages.authorId, ticket.ownerId)
              : eq(ticketMessages.authorId, ticket.ownerId),
            isNull(ticketMessages.readAt),
            or(
              lt(ticketMessages.createdAt, marker.createdAt),
              and(
                eq(ticketMessages.createdAt, marker.createdAt),
                lte(ticketMessages.id, marker.id),
              ),
            ),
          ),
        );
      return true;
    });
    return result
      ? response({ success: true })
      : response({ error: "Not found" }, 404);
  } catch {
    return response({ error: "Unavailable" }, 503);
  }
}
