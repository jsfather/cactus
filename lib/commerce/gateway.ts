import { z } from "zod";
// ZarinPal v4 uses IRR; the catalog and orders are denominated in toman.
// Protocol: https://github.com/ZarinPal-Lab/Zarinpal-RestAPI-Sample-php
const responseSchema = z.object({
  data: z
    .object({
      code: z.number(),
      authority: z.string().optional(),
      ref_id: z.union([z.number(), z.string()]).optional(),
    })
    .optional(),
  errors: z.unknown().optional(),
});
export function paymentConfigured() {
  return Boolean(process.env.ZARINPAL_MERCHANT_ID && process.env.SITE_URL);
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
  if (!response.ok) throw new Error("Gateway unavailable");
  const parsed = responseSchema.parse(await response.json());
  if (!parsed.data) throw new Error("Gateway rejected request");
  return parsed.data;
}
export function tomanToRial(amount: number) {
  const rial = amount * 10;
  if (!Number.isSafeInteger(rial) || rial < 0)
    throw new Error("Invalid amount");
  return rial;
}
