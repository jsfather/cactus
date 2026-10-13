import { z } from "zod";
// ZarinPal v4 uses IRR; the catalog and orders are denominated in toman.
// Protocol: https://github.com/ZarinPal-Lab/Zarinpal-RestAPI-Sample-php
const responseSchema = z.object({
  data: z
    .union([z.object({
      code: z.number(),
      authority: z.string().optional(),
      ref_id: z.union([z.number(), z.string()]).optional(),
    }), z.array(z.unknown()).max(0)])
    .optional(),
  errors: z.union([z.array(z.unknown()), z.object({ code: z.number(), message: z.string().optional() })]).optional(),
});
export function paymentConfigured() {
  if (!z.uuid().safeParse(process.env.ZARINPAL_MERCHANT_ID).success) return false;
  try { const site = new URL(process.env.SITE_URL ?? ""); return site.protocol === "https:" || (process.env.NODE_ENV !== "production" && site.protocol === "http:"); } catch { return false; }
}
export class GatewayRejection extends Error {
  constructor(public readonly code: number) { super("Gateway rejected request"); }
}
export async function gatewayRequest(
  method: "request" | "verify",
  payload: Record<string, unknown>,
) {
  const merchant = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchant) throw new Error("Gateway is not configured");
  const response = await fetch(
    `https://api.zarinpal.com/pg/v4/payment/${method}.json`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchant_id: merchant, ...payload }),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    },
  );
  // Business errors may use a non-2xx HTTP status. Parse the gateway code
  // before classifying the response as a connection/service failure.
  const parsed = responseSchema.parse(await response.json());
  const data = Array.isArray(parsed.data) ? undefined : parsed.data;
  if (!data?.code || data.code < 0) {
    const code = !Array.isArray(parsed.errors) ? parsed.errors?.code : undefined;
    if (typeof code === "number") throw new GatewayRejection(code);
    if (data && data.code < 0) throw new GatewayRejection(data.code);
    throw new Error("Invalid gateway response");
  }
  if (!response.ok) throw new Error("Gateway unavailable");
  return data;
}
export function tomanToRial(amount: number) {
  const rial = amount * 10;
  if (!Number.isSafeInteger(rial) || rial < 0)
    throw new Error("Invalid amount");
  return rial;
}
