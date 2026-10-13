import { isAdministrator } from "@/lib/auth/permissions";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/lib/db/client";
import { chatMessages, chatConversations } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { getChatSettings, getChatVisitorHash } from "@/lib/live-chat/server";
import { attachmentRoot } from "@/lib/attachments/storage";
import { chatRetentionMs } from "@/lib/live-chat/identity";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success)
    return new Response(null, { status: 404 });
  const [user, hash, settings] = await Promise.all([
    getCurrentUser(),
    getChatVisitorHash(),
    getChatSettings(),
  ]);
  const [row] = await getDatabase()
    .select({ message: chatMessages, conversation: chatConversations })
    .from(chatMessages)
    .innerJoin(
      chatConversations,
      eq(chatMessages.conversationId, chatConversations.id),
    )
    .where(and(eq(chatMessages.id, id)))
    .limit(1);
  const staff =
    user &&
    (isAdministrator(user, "support") ||
      (user.role === "teacher" &&
        settings.operatorIds.includes(user.id) &&
        row?.conversation.operatorId === user.id));
  if (
    !row ||
    (!staff &&
      (!hash ||
        hash !== row.conversation.visitorHash ||
        Date.now() - row.conversation.lastMessageAt.getTime() >
          chatRetentionMs)) ||
    !row.message.imagePath ||
    !/^[a-f0-9-]+\.(jpg|png|webp)$/.test(row.message.imagePath) ||
    !["image/jpeg", "image/png", "image/webp"].includes(
      row.message.imageMime ?? "",
    )
  )
    return new Response(null, { status: 404 });
  try {
    const bytes = await readFile(
      path.join(attachmentRoot(), "chat", row.message.imagePath),
    );
    return new Response(bytes, {
      headers: {
        "Content-Type": row.message.imageMime!,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
