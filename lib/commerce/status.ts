import type { Locale } from "@/lib/i18n/config";
export const orderStages = [
  "pending",
  "processing",
  "packing",
  "shipped",
  "delivered",
] as const;
export const orderLabels: Record<string, [string, string]> = {
  pending: ["ثبت سفارش", "Order placed"],
  processing: ["پردازش", "Processing"],
  packing: ["بسته‌بندی", "Packing"],
  shipped: ["ارسال‌شده", "Shipped"],
  delivered: ["تحویل‌شده", "Delivered"],
  cancelled: ["لغوشده", "Cancelled"],
  paid: ["پرداخت‌شده", "Paid"],
  failed: ["ناموفق", "Failed"],
  refunded: ["بازپرداخت‌شده", "Refunded"],
};
export function orderLabel(status: string, locale: Locale) {
  return orderLabels[status]?.[locale === "fa" ? 0 : 1] ?? status;
}
