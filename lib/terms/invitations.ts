import { createHash } from "node:crypto";

export function hashTermInvitationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
