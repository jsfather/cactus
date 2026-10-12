import "server-only";
import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { visitorScope } from "./identity";
import { appSettings } from "@/lib/db/schema";
import { getDatabase } from "@/lib/db/client";
import { chatSettingsSchema, defaultChatSettings } from "./settings";
export const chatCookie = "cactus-chat-visitor";
export const chatBindingCookie = "cactus-chat-binding";
export async function getChatVisitorHash(requestHeaders?: Headers) {
  const token = (await cookies()).get(chatCookie)?.value;
  const scope = visitorScope(token, requestHeaders ?? (await headers()));
  return scope && (await cookies()).get(chatBindingCookie)?.value === scope
    ? scope
    : null;
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
