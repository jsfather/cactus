import Link from "next/link";
import { getProductStats } from "@/lib/commerce/analytics";
import type { Locale } from "@/lib/i18n/config";
import { PanelStatCard, PanelStatGrid } from "@/components/panel/stat-card";
import { PanelSurface } from "@/components/panel/ui";
export async function ProductAnalytics({ locale }: { locale: Locale }) {
  const stats = await getProductStats(),
    fa = locale === "fa",
    number = (value: number) => value.toLocaleString(locale),
    max = Math.max(1, ...stats.best.map((p) => p.quantity));
  return (
    <div className="space-y-5">
      <PanelStatGrid>
        <PanelStatCard
          label={fa ? "کل محصولات" : "Total products"}
          value={number(stats.total)}
          detail={
            fa
              ? `${number(stats.total - stats.published)} پیش‌نویس`
              : `${number(stats.total - stats.published)} drafts`
          }
          href="/panel/admin/products"
        />
        <PanelStatCard
          label={fa ? "محصولات منتشرشده" : "Published products"}
          value={number(stats.published)}
          tone="sky"
          href="/panel/admin/products?status=published"
        />
        <PanelStatCard
          label={fa ? "رو به کمبود" : "Low stock"}
          value={number(stats.low)}
          detail={
            fa
              ? "موجودی ۱ تا ۴؛ با احتساب متغیرها"
              : "1–4 units; includes variants"
          }
          tone="amber"
          icon="clock"
          href="/panel/admin/products?stock=low"
        />
        <PanelStatCard
          label={fa ? "ناموجود" : "Out of stock"}
          value={number(stats.out)}
          tone="rose"
          href="/panel/admin/products?stock=out"
        />
      </PanelStatGrid>
      <PanelSurface className="p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-bold">
              {fa ? "محصولات پرفروش" : "Best-selling products"}
            </h2>
            <p className="mt-1 text-xs leading-6 text-zinc-500">
              {fa
                ? "بر اساس تعداد اقلام سفارش‌های پرداخت‌شده و لغونشده"
                : "Units in paid, non-cancelled orders"}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {number(stats.units)} {fa ? "واحد فروخته‌شده" : "units sold"}
          </span>
        </div>
        {stats.best.length ? (
          <ol className="grid gap-4 lg:grid-cols-2">
            {stats.best.map((product, index) => (
              <li key={product.id}>
                <Link
                  href={`/panel/admin/products/${product.id}/edit`}
                  className="flex min-w-0 items-start gap-3 rounded-2xl border border-zinc-200 p-4 transition hover:border-emerald-300 dark:border-zinc-800"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-zinc-100 font-bold dark:bg-zinc-800">
                    {number(index + 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {fa
                          ? product.titleFa
                          : product.titleEn || product.titleFa}
                      </p>
                      <span className="text-xs text-zinc-500">
                        {number(product.quantity)} {fa ? "عدد" : "units"}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${(product.quantity / max) * 100}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">
                      {number(product.revenue)}{" "}
                      {fa ? "تومان فروش" : "toman sales"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500 dark:bg-zinc-900">
            {fa
              ? "پس از اولین پرداخت، آمار پرفروش‌ها نمایش داده می‌شود."
              : "Best sellers appear after the first completed payment."}
          </p>
        )}
      </PanelSurface>
    </div>
  );
}
