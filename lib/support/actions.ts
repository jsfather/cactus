"use server";
import { ownsAttachment } from "@/lib/attachments/storage";
import { and, eq, or } from "drizzle-orm";
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
  optionalUrl,
  internalHref,
  validationError,
  saved,
  denied,
  failed,
  type ActionState,
} from "@/lib/workflows";
import type { Locale } from "@/lib/i18n/config";
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
      attachmentUrl: optionalUrl,
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
  if (!id && !input.body)
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
      await tx
        .insert(ticketMessages)
        .values({
          ticketId: ticket.id,
          authorId: user.id,
          body: input.body,
          attachmentUrl: input.attachmentUrl,
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
      body: z.string().trim().min(1).max(10000),
      attachmentUrl: optionalUrl,
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
      })
      .where(eq(tickets.id, id));
    const target =
      user.id === ticket.ownerId ? ticket.assignedToId : ticket.ownerId;
    if (target && target !== user.id)
      await tx
        .insert(notifications)
        .values({
          userId: target,
          titleFa: "پاسخ جدید تیکت",
          titleEn: "New ticket reply",
          bodyFa: ticket.subject,
          bodyEn: ticket.subject,
          href: `/panel/tickets/${id}`,
        });
    return saved(locale);
  });
  revalidatePath("/panel", "layout");
  return result;
}
export async function changeTicketStatus(
  id: string,
  status: string,
  locale: Locale,
): Promise<ActionState> {
  const user = await requireUser();
  if (
    !z.uuid().safeParse(id).success ||
    !z.enum(["open", "closed"]).safeParse(status).success
  )
    return denied(locale);
  await getDatabase()
    .update(tickets)
    .set({ status, updatedAt: new Date() })
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
    );
  revalidatePath("/panel", "layout");
  return saved(locale);
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
    .where(and(eq(notifications.id, id), eq(notifications.userId, user.id)));
  revalidatePath("/panel/notifications");
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
