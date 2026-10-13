import { isAdministrator } from "@/lib/auth/permissions";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  inArray,
  isNull,
  lt,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import {
  chatConversations,
  chatMessages,
  chatOperatorPresence,
  users,
} from "@/lib/db/schema";
import {
  chatCookie,
  chatBindingCookie,
  getChatSettings,
  getChatVisitorHash,
} from "@/lib/live-chat/server";
import {
  newVisitorToken,
  visitorScope,
  chatRetentionMs,
} from "@/lib/live-chat/identity";
import { isChatOfficeOpen } from "@/lib/live-chat/settings";
import { attachmentRoot, attachmentType } from "@/lib/attachments/storage";

const reply = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
const startSchema = z.object({
  name: z.string().trim().min(2).max(160),
  mobile: z
    .string()
    .trim()
    .regex(/^09\d{9}$/),
  locale: z.enum(["fa", "en"]),
});
const messageSchema = z.object({
  operation: z.enum(["reply", "close", "claim", "delete", "read", "typing"]),
  inbox: z.boolean().default(false),
  lastMessageId: z.uuid().optional(),
  typing: z.boolean().default(false),
  id: z.uuid(),
  body: z.string().trim().max(5000).default(""),
});

async function context() {
  const [settings, user, hash] = await Promise.all([
    getChatSettings(),
    getCurrentUser(),
    getChatVisitorHash(),
  ]);
  const operator = Boolean(
    user &&
    (isAdministrator(user, "support") ||
      (user.role === "teacher" && settings.operatorIds.includes(user.id))),
  );
  return { settings, user, hash, operator, db: getDatabase() };
}
async function expire() {
  const { settings, db } = await context();
  await db
    .update(chatConversations)
    .set({ status: "closed", visitorTypingAt: null, operatorTypingAt: null })
    .where(
      and(
        eq(chatConversations.status, "open"),
        lt(
          chatConversations.lastMessageAt,
          new Date(Date.now() - settings.idleMinutes * 60000),
        ),
      ),
    );
}

export async function GET(request: NextRequest) {
  try {
    const { settings, user, hash, operator, db } = await context();
    // Changing the bound address expires the browser identity, not staff history.
    if (!hash && (await cookies()).get(chatCookie)) {
      (await cookies()).delete(chatCookie);
      (await cookies()).delete(chatBindingCookie);
    }
    await expire();
    const inbox = request.nextUrl.searchParams.get("inbox") === "1";
    const pageSchema = z.coerce.number().int().min(1).max(100000).catch(1);
    const historyPage = pageSchema.parse(
      request.nextUrl.searchParams.get("historyPage") ?? 1,
    );
    const messagePage = pageSchema.parse(
      request.nextUrl.searchParams.get("messagePage") ?? 1,
    );
    const historyLimit = inbox ? 100 : 20;
    if (inbox && !operator) return reply({ error: "Forbidden" }, 403);
    const online = settings.operatorIds.length
      ? await db
          .select({ id: users.id })
          .from(chatOperatorPresence)
          .innerJoin(users, eq(users.id, chatOperatorPresence.userId))
          .where(
            and(
              inArray(users.id, settings.operatorIds),
              eq(users.isActive, true),
              inArray(users.role, ["admin", "teacher"]),
              gt(chatOperatorPresence.lastSeenAt, new Date(Date.now() - 90000)),
            ),
          )
      : [];
    const allowed = inbox
      ? isAdministrator(user, "support")
        ? undefined
        : or(
            eq(chatConversations.operatorId, user!.id),
            isNull(chatConversations.operatorId),
          )
      : hash
        ? and(
            eq(chatConversations.visitorHash, hash),
            gt(
              chatConversations.lastMessageAt,
              new Date(Date.now() - chatRetentionMs),
            ),
          )
        : sql`false`;
    const history = await db
      .select({
        id: chatConversations.id,
        name: chatConversations.name,
        mobile: chatConversations.mobile,
        status: chatConversations.status,
        operatorId: chatConversations.operatorId,
        lastMessageAt: chatConversations.lastMessageAt,
        visitorTypingAt: chatConversations.visitorTypingAt,
        operatorTypingAt: chatConversations.operatorTypingAt,
      })
      .from(chatConversations)
      .where(allowed)
      .orderBy(desc(chatConversations.lastMessageAt))
      .limit(historyLimit + 1)
      .offset((historyPage - 1) * historyLimit);
    const requestedId = request.nextUrl.searchParams.get("id");
    if (requestedId && !z.uuid().safeParse(requestedId).success)
      return reply({ error: "Invalid id" }, 400);
    const selected = requestedId
      ? (
          await db
            .select({
              id: chatConversations.id,
              name: chatConversations.name,
              mobile: chatConversations.mobile,
              status: chatConversations.status,
              operatorId: chatConversations.operatorId,
              lastMessageAt: chatConversations.lastMessageAt,
              visitorTypingAt: chatConversations.visitorTypingAt,
              operatorTypingAt: chatConversations.operatorTypingAt,
            })
            .from(chatConversations)
            .where(and(allowed, eq(chatConversations.id, requestedId)))
            .limit(1)
        )[0]
      : inbox || request.nextUrl.searchParams.get("restore") === "1"
        ? history[0]
        : undefined;
    if (requestedId && !selected) return reply({ error: "Not found" }, 404);
    const messages = selected
      ? await db
          .select({
            id: chatMessages.id,
            sender: chatMessages.sender,
            body: chatMessages.body,
            createdAt: chatMessages.createdAt,
            readAt: chatMessages.readAt,
            authorName:
              request.nextUrl.searchParams.get("locale") === "en"
                ? sql<string>`concat_ws(' ',${users.firstNameEn},${users.lastNameEn})`
                : sql<string>`concat_ws(' ',${users.firstNameFa},${users.lastNameFa})`,
            avatarUrl: users.avatarUrl,
            hasImage: sql<boolean>`${chatMessages.imagePath} is not null`,
          })
          .from(chatMessages)
          .leftJoin(users, eq(users.id, chatMessages.authorId))
          .where(eq(chatMessages.conversationId, selected.id))
          .orderBy(desc(chatMessages.createdAt), desc(chatMessages.id))
          .limit(201)
          .offset((messagePage - 1) * 200)
      : [];
    const [assignedOperator] = selected?.operatorId
      ? await db
          .select({
            avatarUrl: users.avatarUrl,
            name:
              request.nextUrl.searchParams.get("locale") === "en"
                ? sql<string>`concat_ws(' ', ${users.firstNameEn}, ${users.lastNameEn})`
                : sql<string>`concat_ws(' ', ${users.firstNameFa}, ${users.lastNameFa})`,
          })
          .from(users)
          .where(eq(users.id, selected.operatorId))
          .limit(1)
      : [];
    return reply({
      history: inbox ? history.slice(0, historyLimit) : [],
      historyAvailable: !inbox && history.length > 0,
      historyHasMore: inbox && history.length > historyLimit,
      messagesHasMore: messages.length > 200,
      conversation: selected
        ? {
            ...selected,
            operatorName: assignedOperator?.name ?? null,
            operatorAvatarUrl: assignedOperator?.avatarUrl ?? null,
            peerTyping:
              Date.now() -
                ((inbox
                  ? selected.visitorTypingAt
                  : selected.operatorTypingAt
                )?.getTime() ?? 0) <
              6000,
          }
        : null,
      messages: messages.slice(0, 200).reverse(),
      onlineCount: online.length,
      settings: {
        enabled: settings.enabled,
        color: settings.color,
        logoUrl: settings.logoUrl,
        idleMinutes: settings.idleMinutes,
        greeting:
          request.nextUrl.searchParams.get("locale") === "en"
            ? settings.greetingEn
            : settings.greetingFa,
      },
      officeOpen: isChatOfficeOpen(settings),
      operatorId: inbox ? user?.id : undefined,
      isAdmin: inbox && isAdministrator(user, "support"),
    });
  } catch {
    return reply({ error: "Chat unavailable" }, 503);
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (
    !origin ||
    (origin !== request.nextUrl.origin && origin !== process.env.SITE_URL)
  )
    return reply({ error: "Invalid origin" }, 403);
  if (
    Number(request.headers.get("content-length") ?? 0) >
    5 * 1024 * 1024 + 16384
  )
    return reply({ error: "Too large" }, 413);
  try {
    const { settings, user, hash, operator, db } = await context();
    await expire();
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await request.formData();
      const id = String(form.get("id") ?? "");
      const file = form.get("file");
      if (
        !z.uuid().safeParse(id).success ||
        !(file instanceof File) ||
        !file.size ||
        file.size > 5 * 1024 * 1024
      )
        return reply({ error: "Invalid image" }, 400);
      const bytes = Buffer.from(await file.arrayBuffer());
      const type = attachmentType(bytes);
      if (
        !type ||
        !["image/jpeg", "image/png", "image/webp"].includes(type.mime) ||
        file.type !== type.mime
      )
        return reply({ error: "Unsupported image" }, 400);
      const filename = `${randomUUID()}-${Date.now()}.${type.ext}`;
      const directory = path.join(attachmentRoot(), "chat");
      let stored = false;
      try {
        const ok = await db.transaction(async (tx) => {
          await tx.execute(sql`select pg_advisory_xact_lock(924018)`);
          const [budget] = await tx
            .select({
              bytes: sql<string>`coalesce(sum(${chatMessages.imageBytes}), 0)`,
            })
            .from(chatMessages)
            .where(gt(chatMessages.createdAt, new Date(Date.now() - 86400000)));
          const [images] = await tx
            .select({ count: sql<number>`count(*)::int` })
            .from(chatMessages)
            .where(
              and(
                eq(chatMessages.conversationId, id),
                sql`${chatMessages.imagePath} is not null`,
              ),
            );
          if (
            Number(budget.bytes) + bytes.length > 250 * 1024 * 1024 ||
            images.count >= 20
          )
            return false;
          const [conversation] = await tx
            .select()
            .from(chatConversations)
            .where(eq(chatConversations.id, id))
            .for("update");
          const isStaff =
            form.get("inbox") === "1" &&
            operator &&
            user &&
            conversation?.operatorId === user.id;
          if (
            !conversation ||
            conversation.status !== "open" ||
            (!isStaff &&
              (!hash ||
                conversation.visitorHash !== hash ||
                Date.now() - conversation.lastMessageAt.getTime() >
                  chatRetentionMs)) ||
            Date.now() - conversation.lastMessageAt.getTime() < 1000
          )
            return false;
          await mkdir(directory, { recursive: true });
          await writeFile(path.join(directory, filename), bytes, {
            flag: "wx",
          });
          stored = true;
          await tx.insert(chatMessages).values({
            conversationId: id,
            sender: isStaff ? "operator" : "visitor",
            authorId: isStaff ? user!.id : null,
            body: "",
            imagePath: filename,
            imageMime: type.mime,
            imageBytes: bytes.length,
          });
          await tx
            .update(chatConversations)
            .set({
              lastMessageAt: new Date(),
              visitorTypingAt: null,
              operatorTypingAt: null,
            })
            .where(eq(chatConversations.id, id));
          return true;
        });
        if (!ok) return reply({ error: "Conversation unavailable" }, 409);
        return reply({ success: true });
      } catch {
        if (stored)
          await unlink(path.join(directory, filename)).catch(() => {});
        return reply({ error: "Upload failed" }, 500);
      }
    }
    const body = await request.json();
    if (body.operation === "presence") {
      if (!operator || !user) return reply({ error: "Forbidden" }, 403);
      await db
        .insert(chatOperatorPresence)
        .values({ userId: user.id })
        .onConflictDoUpdate({
          target: chatOperatorPresence.userId,
          set: { lastSeenAt: new Date() },
        });
      return reply({ success: true });
    }
    if (body.operation === "start") {
      if (settings.enabled !== "true") return reply({ error: "Disabled" }, 403);
      const parsed = startSchema.safeParse(body);
      if (!parsed.success)
        return reply({ error: "Invalid name or mobile" }, 400);
      const token = hash ? null : newVisitorToken();
      const key = hash ?? visitorScope(token!, request.headers);
      if (!key) return reply({ error: "Trusted client IP unavailable" }, 503);
      const result = await db.transaction(async (tx) => {
        // Global start cap and advisory lock bound anonymous conversation creation across instances.
        await tx.execute(sql`select pg_advisory_xact_lock(924016)`);
        const [existing] = await tx
          .select({ id: chatConversations.id })
          .from(chatConversations)
          .where(
            and(
              eq(chatConversations.visitorHash, key),
              eq(chatConversations.status, "open"),
            ),
          )
          .limit(1);
        if (existing) return existing;
        const [count] = await tx
          .select({ count: sql<number>`count(*)::int` })
          .from(chatConversations)
          .where(
            gt(chatConversations.createdAt, new Date(Date.now() - 86400000)),
          );
        if (count.count >= 500) return null;
        const online =
          isChatOfficeOpen(settings) && settings.operatorIds.length
            ? await tx
                .select({
                  id: users.id,
                  load: sql<number>`(select count(*)::int from chat_conversations where operator_id = ${users.id} and status = 'open')`,
                })
                .from(chatOperatorPresence)
                .innerJoin(users, eq(users.id, chatOperatorPresence.userId))
                .where(
                  and(
                    inArray(users.id, settings.operatorIds),
                    eq(users.isActive, true),
                    inArray(users.role, ["admin", "teacher"]),
                    gt(
                      chatOperatorPresence.lastSeenAt,
                      new Date(Date.now() - 90000),
                    ),
                  ),
                )
                .orderBy(
                  asc(
                    sql`(select count(*) from chat_conversations where operator_id = ${users.id} and status = 'open')`,
                  ),
                  asc(users.id),
                )
            : [];
        const [conversation] = await tx
          .insert(chatConversations)
          .values({
            ...parsed.data,
            visitorHash: key,
            operatorId: online[0]?.id ?? null,
          })
          .returning({ id: chatConversations.id });
        await tx.insert(chatMessages).values({
          conversationId: conversation.id,
          sender: "system",
          body: isChatOfficeOpen(settings)
            ? parsed.data.locale === "fa"
              ? settings.greetingFa
              : settings.greetingEn
            : parsed.data.locale === "fa"
              ? settings.awayFa
              : settings.awayEn,
        });
        return conversation;
      });
      if (!result) return reply({ error: "Please try later" }, 429);
      if (token) {
        (await cookies()).set(chatCookie, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 10,
        });
        (await cookies()).set(chatBindingCookie, key, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 10,
        });
      }
      return reply(result);
    }
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) return reply({ error: "Invalid message" }, 400);
    if (parsed.data.operation === "delete") {
      if (!isAdministrator(user, "support")) return reply({ error: "Forbidden" }, 403);
      const removed = await db.transaction(async (tx) => {
        const [conversation] = await tx
          .select()
          .from(chatConversations)
          .where(eq(chatConversations.id, parsed.data.id))
          .for("update");
        if (!conversation || conversation.status !== "closed") return null;
        const images = await tx
          .select({ pathname: chatMessages.imagePath })
          .from(chatMessages)
          .where(eq(chatMessages.conversationId, conversation.id));
        await tx
          .delete(chatConversations)
          .where(eq(chatConversations.id, conversation.id));
        return images;
      });
      if (!removed) return reply({ error: "Close conversation first" }, 409);
      for (const item of removed)
        if (item.pathname && /^[a-f0-9-]+\.(jpg|png|webp)$/.test(item.pathname))
          await unlink(
            path.join(attachmentRoot(), "chat", item.pathname),
          ).catch(() => {});
      return reply({ success: true });
    }
    const result = await db.transaction(async (tx) => {
      const [conversation] = await tx
        .select()
        .from(chatConversations)
        .where(eq(chatConversations.id, parsed.data.id))
        .for("update");
      if (!conversation) return false;
      if (parsed.data.operation === "claim") {
        if (!parsed.data.inbox || conversation.status !== "open") return false;
        if (
          !operator ||
          !user ||
          (conversation.operatorId && !isAdministrator(user, "support"))
        )
          return false;
        await tx
          .update(chatConversations)
          .set({ operatorId: user.id })
          .where(eq(chatConversations.id, conversation.id));
        return true;
      }
      const isStaff =
        parsed.data.inbox &&
        operator &&
        user &&
        conversation.operatorId === user.id;
      if (
        !isStaff &&
        (!hash ||
          hash !== conversation.visitorHash ||
          Date.now() - conversation.lastMessageAt.getTime() > chatRetentionMs)
      )
        return false;
      if (parsed.data.operation === "read") {
        if (!parsed.data.lastMessageId) return false;
        const [marker] = await tx
          .select({ createdAt: chatMessages.createdAt, id: chatMessages.id })
          .from(chatMessages)
          .where(
            and(
              eq(chatMessages.id, parsed.data.lastMessageId),
              eq(chatMessages.conversationId, conversation.id),
            ),
          )
          .limit(1);
        if (!marker) return false;
        await tx
          .update(chatMessages)
          .set({ readAt: new Date() })
          .where(
            and(
              eq(chatMessages.conversationId, conversation.id),
              eq(chatMessages.sender, isStaff ? "visitor" : "operator"),
              isNull(chatMessages.readAt),
              or(
                lt(chatMessages.createdAt, marker.createdAt),
                and(
                  eq(chatMessages.createdAt, marker.createdAt),
                  lte(chatMessages.id, marker.id),
                ),
              ),
            ),
          );
        return true;
      }
      if (conversation.status !== "open") return false;
      if (parsed.data.operation === "typing") {
        await tx
          .update(chatConversations)
          .set(
            isStaff
              ? { operatorTypingAt: parsed.data.typing ? new Date() : null }
              : { visitorTypingAt: parsed.data.typing ? new Date() : null },
          )
          .where(eq(chatConversations.id, conversation.id));
        return true;
      }
      if (parsed.data.operation === "close") {
        await tx
          .update(chatConversations)
          .set({
            status: "closed",
            visitorTypingAt: null,
            operatorTypingAt: null,
          })
          .where(eq(chatConversations.id, conversation.id));
        return true;
      }
      if (
        !parsed.data.body ||
        Date.now() - conversation.lastMessageAt.getTime() < 1000
      )
        return false;
      await tx.insert(chatMessages).values({
        conversationId: conversation.id,
        sender: isStaff ? "operator" : "visitor",
        authorId: isStaff ? user!.id : null,
        body: parsed.data.body,
      });
      await tx
        .update(chatConversations)
        .set({
          lastMessageAt: new Date(),
          visitorTypingAt: null,
          operatorTypingAt: null,
        })
        .where(eq(chatConversations.id, conversation.id));
      return true;
    });
    return result
      ? reply({ success: true })
      : reply({ error: "Conversation unavailable" }, 409);
  } catch {
    return reply({ error: "Chat unavailable" }, 503);
  }
}
