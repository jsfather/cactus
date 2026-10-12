import "server-only";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import {
  tickets,
  ticketMessages,
  users,
  attachments,
  ticketDepartments,
  termEnrollments,
  terms,
  orderItems,
  orders,
} from "@/lib/db/schema";
import type { CurrentUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n/config";
import { userNameSql } from "@/lib/learning/queries";
export async function getTicketChat(
  user: CurrentUser,
  id: string,
  locale: Locale,
  messagePage = 1,
) {
  const db = getDatabase();
  const [ticket] = await db
    .select()
    .from(tickets)
    .where(
      and(
        eq(tickets.id, id),
        user.role === "admin"
          ? undefined
          : or(
              eq(tickets.ownerId, user.id),
              user.role === "teacher"
                ? eq(tickets.assignedToId, user.id)
                : undefined,
            ),
      ),
    )
    .limit(1);
  if (!ticket) return null;
  const staff =
    user.role === "admin" ||
    (user.role === "teacher" &&
      ticket.assignedToId === user.id &&
      ticket.ownerId !== user.id);
  const [requester] = await db
    .select({
      name: userNameSql(locale),
      avatarUrl: users.avatarUrl,
      role: users.role,
      mobile: users.mobile,
    })
    .from(users)
    .where(eq(users.id, ticket.ownerId))
    .limit(1);
  const [operator] = ticket.assignedToId
    ? await db
        .select({ name: userNameSql(locale), avatarUrl: users.avatarUrl })
        .from(users)
        .where(eq(users.id, ticket.assignedToId))
        .limit(1)
    : [];
  const [department] = await db
    .select({
      titleFa: ticketDepartments.titleFa,
      titleEn: ticketDepartments.titleEn,
    })
    .from(ticketDepartments)
    .where(eq(ticketDepartments.id, ticket.departmentId))
    .limit(1);
  const rows = await db
    .select({
      message: ticketMessages,
      name: userNameSql(locale),
      avatarUrl: users.avatarUrl,
      mime: attachments.mimeType,
    })
    .from(ticketMessages)
    .innerJoin(users, eq(users.id, ticketMessages.authorId))
    .leftJoin(
      attachments,
      eq(
        ticketMessages.attachmentUrl,
        sql`'/api/attachments/' || ${attachments.id}::text`,
      ),
    )
    .where(eq(ticketMessages.ticketId, id))
    .orderBy(desc(ticketMessages.createdAt), desc(ticketMessages.id))
    .limit(201)
    .offset((messagePage - 1) * 200);
  const enrollments =
    staff && requester?.role === "student"
      ? await db
          .select({
            titleFa: terms.titleFa,
            titleEn: terms.titleEn,
            status: termEnrollments.status,
            startDate: terms.startDate,
            endDate: terms.endDate,
          })
          .from(termEnrollments)
          .innerJoin(terms, eq(terms.id, termEnrollments.termId))
          .where(eq(termEnrollments.studentId, ticket.ownerId))
          .orderBy(desc(terms.startDate))
          .limit(10)
      : [];
  const purchases = staff
    ? await db
        .select({ titleFa: orderItems.titleFa, titleEn: orderItems.titleEn })
        .from(orderItems)
        .innerJoin(orders, eq(orders.id, orderItems.orderId))
        .where(
          and(
            eq(orders.userId, ticket.ownerId),
            eq(orders.paymentStatus, "paid"),
          ),
        )
        .orderBy(desc(orders.createdAt))
        .limit(5)
    : [];
  return {
    ticket: {
      id: ticket.id,
      subject: ticket.subject,
      status: ticket.status,
      ownerId: ticket.ownerId,
      rating: ticket.rating,
      updatedAt: ticket.updatedAt.toISOString(),
    },
    peerTyping:
      Date.now() -
        ((staff ? ticket.ownerTypingAt : ticket.staffTypingAt)?.getTime() ??
          0) <
      6000,
    requester,
    operator,
    staff,
    department: department
      ? locale === "en"
        ? department.titleEn || department.titleFa
        : department.titleFa
      : "",
    enrollments,
    purchases,
    messagesHasMore: rows.length > 200,
    messages: rows
      .slice(0, 200)
      .reverse()
      .map(({ message, name, avatarUrl, mime }) => ({
        id: message.id,
        body: message.body,
        name,
        avatarUrl,
        createdAt: message.createdAt.toISOString(),
        readAt: message.readAt?.toISOString() ?? null,
        attachmentUrl: message.attachmentUrl,
        attachmentMime: mime,
        mine: message.authorId === user.id,
      })),
  };
}
