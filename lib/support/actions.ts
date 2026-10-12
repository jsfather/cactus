"use server";
import { ownsAttachment } from "@/lib/attachments/storage";
import { and, desc, eq, ne, or, isNull } from "drizzle-orm";
import { notifyAdmins, notifyUsers } from "@/lib/notifications/events";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, requireRole } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  tickets,
  ticketMessages,
  ticketDepartments,
  notifications,
  users,
} from "@/lib/db/schema";
import {
  internalHref,
  validationError,
  saved,
  denied,
  failed,
  type ActionState,
} from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
const ticketAttachment = z
  .string()
  .trim()
  .refine(
    (value) => !value || /^\/api\/attachments\/[0-9a-f-]{36}$/.test(value),
  );
export async function saveTicket(
  id: string | null,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = z
    .object({
      subject: z.string().trim().min(2).max(240),
      departmentId: z.uuid(),
      body: z.string().trim().max(10000),
      attachmentUrl: ticketAttachment,
      ownerId: z.uuid(),
      assignedToId: z.union([z.uuid(), z.literal("")]),
      status: z.enum(["open", "pending", "closed"]),
    })
    .safeParse({
      ...Object.fromEntries(form),
      ownerId: user.role === "admin" ? form.get("ownerId") : user.id,
      assignedToId: user.role === "admin" ? form.get("assignedToId") : "",
      status: user.role === "admin" ? form.get("status") : "open",
    });
  if (!parsed.success) return validationError(locale, parsed.error);
  const input = parsed.data;
  if (!(await ownsAttachment(user, input.attachmentUrl))) return denied(locale);
  if (!id && !input.body && !input.attachmentUrl)
    return validationError(
      locale,
      new z.ZodError([{ code: "custom", path: ["body"], message: "Required" }]),
    );
  const db = getDatabase();
  const [department] = await db
    .select()
    .from(ticketDepartments)
    .where(
      and(
        eq(ticketDepartments.id, input.departmentId),
        eq(ticketDepartments.isActive, true),
      ),
    );
  if (!department) return denied(locale);
  if (input.assignedToId) {
    const [assignee] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.id, input.assignedToId),
          eq(users.isActive, true),
          or(eq(users.role, "teacher"), eq(users.role, "admin")),
        ),
      );
    if (!assignee) return denied(locale);
  }
  if (id) {
    if (user.role !== "admin" || !z.uuid().safeParse(id).success)
      return denied(locale);
    await db
      .update(tickets)
      .set({
        subject: input.subject,
        departmentId: input.departmentId,
        assignedToId: input.assignedToId || null,
        ownerId: input.ownerId,
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(tickets.id, id));
  } else {
    id = await db.transaction(async (tx) => {
      const [ticket] = await tx
        .insert(tickets)
        .values({
          ownerId: input.ownerId,
          subject: input.subject,
          departmentId: input.departmentId,
          assignedToId: input.assignedToId || null,
        })
        .returning();
      await tx.insert(ticketMessages).values({
        ticketId: ticket.id,
        authorId: user.id,
        body: input.body,
        attachmentUrl: input.attachmentUrl,
      });
      await notifyAdmins(tx, {
        titleFa: "تیکت جدید",
        titleEn: "New support ticket",
        bodyFa: `تیکت «${input.subject}» ثبت شد.`,
        bodyEn: `A ticket titled “${input.subject}” was opened.`,
        href: `/panel/tickets/${ticket.id}`,
      });
      await notifyUsers(tx, [input.ownerId, input.assignedToId], {
        titleFa: "تیکت پشتیبانی ثبت شد",
        titleEn: "Support ticket opened",
        bodyFa: `تیکت «${input.subject}» آماده پیگیری است.`,
        bodyEn: `You can follow ticket “${input.subject}”.`,
        href: `/panel/tickets/${ticket.id}`,
      });
      return ticket.id;
    });
  }
  revalidatePath("/panel", "layout");
  redirect(`/panel/tickets/${id}`);
}
export async function replyTicket(
  id: string,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = z
    .object({
      body: z.string().trim().max(10000),
      attachmentUrl: ticketAttachment,
    })
    .refine((value) => Boolean(value.body || value.attachmentUrl), {
      path: ["body"],
      message:
        locale === "fa"
          ? "پیام یا فایل را اضافه کنید."
          : "Add a message or file.",
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  if (!(await ownsAttachment(user, parsed.data.attachmentUrl)))
    return denied(locale);
  if (!z.uuid().safeParse(id).success) return denied(locale);
  const result = await getDatabase().transaction(async (tx) => {
    const [ticket] = await tx
      .select()
      .from(tickets)
      .where(eq(tickets.id, id))
      .for("update");
    if (
      !ticket ||
      ticket.status === "closed" ||
      (user.role !== "admin" &&
        ticket.ownerId !== user.id &&
        !(user.role === "teacher" && ticket.assignedToId === user.id))
    )
      return denied(locale);
    await tx
      .insert(ticketMessages)
      .values({ ticketId: id, authorId: user.id, ...parsed.data });
    await tx
      .update(tickets)
      .set({
        updatedAt: new Date(),
        status: user.id === ticket.ownerId ? "open" : "pending",
        ownerTypingAt: null,
        staffTypingAt: null,
        ...(user.id !== ticket.ownerId
          ? { rating: null, ratingResponderId: null }
          : {}),
      })
      .where(eq(tickets.id, id));
    const replyNotice = {
      titleFa: "پاسخ جدید تیکت",
      titleEn: "New ticket reply",
      bodyFa: ticket.subject,
      bodyEn: ticket.subject,
      href: `/panel/tickets/${id}`,
    };
    if (user.id === ticket.ownerId) {
      await notifyAdmins(tx, replyNotice);
      if (ticket.assignedToId && ticket.assignedToId !== user.id) {
        const [assignee] = await tx
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, ticket.assignedToId));
        if (assignee?.role !== "admin")
          await notifyUsers(tx, [ticket.assignedToId], replyNotice);
      }
    } else await notifyUsers(tx, [ticket.ownerId], replyNotice);
    return saved(locale);
  });
  revalidatePath("/panel", "layout");
  return result;
}
export async function rateTicket(
  id: string,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = z
    .object({ id: z.uuid(), rating: z.coerce.number().int().min(0).max(5) })
    .safeParse({ id, rating: form.get("rating") });
  if (!parsed.success) return validationError(locale, parsed.error);
  try {
    const result = await getDatabase().transaction(async (tx) => {
      const [ticket] = await tx
        .select()
        .from(tickets)
        .where(and(eq(tickets.id, id), eq(tickets.ownerId, user.id)))
        .for("update");
      if (!ticket || ticket.status !== "closed") return denied(locale);
      const [reply] = await tx
        .select({ authorId: ticketMessages.authorId })
        .from(ticketMessages)
        .innerJoin(users, eq(users.id, ticketMessages.authorId))
        .where(
          and(
            eq(ticketMessages.ticketId, id),
            ne(ticketMessages.authorId, ticket.ownerId),
            or(eq(users.role, "admin"), eq(users.role, "teacher")),
          ),
        )
        .orderBy(desc(ticketMessages.createdAt), desc(ticketMessages.id))
        .limit(1);
      if (!reply) return denied(locale);
      await tx
        .update(tickets)
        .set({
          rating: parsed.data.rating || null,
          ratingResponderId: parsed.data.rating ? reply.authorId : null,
        })
        .where(eq(tickets.id, id));
      return saved(locale);
    });
    revalidatePath(`/panel/tickets/${id}`);
    revalidatePath("/panel/tickets");
    return result;
  } catch {
    return failed(locale);
  }
}

export async function changeTicketStatus(
  id: string,
  status: string,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireUser();
  if (
    !z.uuid().safeParse(id).success ||
    !z.enum(["open", "pending", "closed"]).safeParse(status).success
  )
    return denied(locale);
  try {
    const result = await getDatabase().transaction(
      async (tx): Promise<ActionState> => {
        const [ticket] = await tx
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
          .for("update");
        if (!ticket) return denied(locale);
        if (
          status === "pending" &&
          user.role !== "admin" &&
          (user.role !== "teacher" || ticket.ownerId === user.id)
        )
          return denied(locale);
        await tx
          .update(tickets)
          .set({
            status,
            updatedAt: new Date(),
            ownerTypingAt: null,
            staffTypingAt: null,
          })
          .where(eq(tickets.id, id));
        if (ticket.status !== status)
          await notifyUsers(
            tx,
            [ticket.ownerId === user.id ? ticket.assignedToId : ticket.ownerId],
            {
              titleFa: "وضعیت تیکت تغییر کرد",
              titleEn: "Ticket status updated",
              bodyFa: ticket.subject,
              bodyEn: ticket.subject,
              href: `/panel/tickets/${id}`,
            },
          );
        return saved(locale);
      },
    );
    revalidatePath("/panel", "layout");
    return result;
  } catch {
    return failed(locale);
  }
}
export async function deleteTicket(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  await requireRole("admin");
  if (!z.uuid().safeParse(id).success) return denied(locale);
  await getDatabase().delete(tickets).where(eq(tickets.id, id));
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function saveDepartment(
  id: string | null,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireRole("admin");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = z
    .object({
      titleFa: z.string().trim().min(2).max(160),
      titleEn: z.string().max(160),
      isActive: z.enum(["true", "false"]).transform((v) => v === "true"),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  if (id) {
    if (!z.uuid().safeParse(id).success) return denied(locale);
    await getDatabase()
      .update(ticketDepartments)
      .set(parsed.data)
      .where(eq(ticketDepartments.id, id));
  } else await getDatabase().insert(ticketDepartments).values(parsed.data);
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function deleteDepartment(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  await requireRole("admin");
  if (!z.uuid().safeParse(id).success) return denied(locale);
  try {
    await getDatabase()
      .delete(ticketDepartments)
      .where(eq(ticketDepartments.id, id));
  } catch {
    return failed(locale);
  }
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function saveNotification(
  id: string | null,
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireRole("admin");
  const locale = form.get("locale") === "en" ? "en" : "fa";
  const parsed = z
    .object({
      userId: z.uuid(),
      titleFa: z.string().trim().min(2).max(240),
      titleEn: z.string().max(240),
      bodyFa: z.string().trim().min(2).max(10000),
      bodyEn: z.string().max(10000),
      href: internalHref,
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return validationError(locale, parsed.error);
  if (id) {
    if (!z.uuid().safeParse(id).success) return denied(locale);
    await getDatabase()
      .update(notifications)
      .set(parsed.data)
      .where(eq(notifications.id, id));
  } else await getDatabase().insert(notifications).values(parsed.data);
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function readNotification(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireUser();
  if (!z.uuid().safeParse(id).success) return denied(locale);
  await getDatabase()
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notifications.id, id),
        eq(notifications.userId, user.id),
        isNull(notifications.readAt),
      ),
    );
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function readAllNotifications(
  locale: Locale,
): Promise<ActionState> {
  const user = await requireUser();
  try {
    await getDatabase()
      .update(notifications)
      .set({ readAt: new Date() })
      .where(
        and(eq(notifications.userId, user.id), isNull(notifications.readAt)),
      );
  } catch {
    return failed(locale);
  }
  revalidatePath("/panel", "layout");
  return saved(locale);
}
export async function deleteNotification(
  id: string,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireUser();
  if (!z.uuid().safeParse(id).success) return denied(locale);
  await getDatabase()
    .delete(notifications)
    .where(
      and(
        eq(notifications.id, id),
        user.role === "admin" ? undefined : eq(notifications.userId, user.id),
      ),
    );
  revalidatePath("/panel", "layout");
  return saved(locale);
}
