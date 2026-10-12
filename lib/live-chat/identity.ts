import { createHash, randomBytes } from "node:crypto";
import { isIP } from "node:net";
export const chatRetentionMs = 10 * 86400000;
export function newVisitorToken() {
  return `${Date.now()}.${randomBytes(32).toString("hex")}`;
}
export function visitorScope(
  token: string | undefined,
  headers: Headers,
  now = Date.now(),
) {
  if (!token || !/^\d{13}\.[a-f0-9]{64}$/.test(token)) return null;
  const issued = Number(token.split(".")[0]);
  if (issued > now || now - issued > chatRetentionMs) return null;
  // Never authorize by IP alone. Only use a header explicitly trusted by the deployment.
  const configured = process.env.CHAT_CLIENT_IP_HEADER;
  if (configured && !["x-real-ip", "x-forwarded-for"].includes(configured))
    return null;
  let ip = "unavailable";
  if (configured === "x-real-ip" || configured === "x-forwarded-for") {
    const raw = headers.get(configured)?.split(",")[0]?.trim() ?? "";
    if (isIP(raw) === 4) ip = raw;
    else if (isIP(raw) === 6)
      ip = new URL(`http://[${raw}]/`).hostname.toLowerCase();
    else return null;
  }
  return createHash("sha256").update(`v2:${token}:${ip}`).digest("hex");
}
