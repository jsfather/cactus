import "server-only";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { appSettings } from "@/lib/db/schema";
import { getDatabase } from "@/lib/db/client";
import { chatSettingsSchema, defaultChatSettings } from "./settings";
export const chatCookie = "cactus-chat-visitor";
export const visitorHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export async function getChatVisitorHash() {
  const token = (await cookies()).get(chatCookie)?.value;
  return token && /^[a-f0-9]{64}$/.test(token) ? visitorHash(token) : null;
}
export async function getChatSettings() {
  const [row] = await getDatabase()
    .select()
    .from(appSettings)
    .where(eq(appSettings.key, "support.live-chat"));
  try {
    const parsed = chatSettingsSchema.safeParse(JSON.parse(row?.value ?? "{}"));
    return parsed.success ? parsed.data : defaultChatSettings;
  } catch {
    return defaultChatSettings;
  }
}
