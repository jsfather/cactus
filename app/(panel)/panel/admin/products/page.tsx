import Link from "next/link";
import { DeleteProductButton } from "@/components/products/delete-product-button";
import { PanelEmptyState, PanelPage, PanelPageHeader, PanelPrimaryLink, PanelSurface, PanelTable, PanelTableCell } from "@/components/panel/ui";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { localeConfig } from "@/lib/i18n/config";
import { getAdminProducts } from "@/lib/products/queries";
import { ToastOnMount } from "@/components/feedback/toast-effects";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const [products, locale, query] = await Promise.all([getAdminProducts(), getPanelLocale(), searchParams]);
  const dictionary = getPanelDictionary(locale);
  const number = new Intl.NumberFormat(localeConfig[locale].dateLocale);
  return (
    <PanelPage>
      {query.toast === "created" ? <ToastOnMount title={locale === "fa" ? "محصول ساخته شد." : "Product created."} /> : null}
      {query.toast === "updated" ? <ToastOnMount title={locale === "fa" ? "محصول به‌روز شد." : "Product updated."} /> : null}
      <PanelPageHeader eyebrow={dictionary.shop.eyebrow} title={dictionary.shop.title} description={dictionary.shop.description} actions={<PanelPrimaryLink href="/panel/admin/products/new">{dictionary.shop.newProduct}</PanelPrimaryLink>} />
      <PanelSurface>
        {products.length ? (
          <PanelTable columns={[{ label: dictionary.common.title, className: "w-[32%]" }, { label: dictionary.shop.price, className: "w-[18%]" }, { label: dictionary.shop.inventory, className: "w-[13%]" }, { label: dictionary.common.status, className: "w-[16%]" }, { label: dictionary.common.actions, className: "w-[21%]" }]}>
            {products.map((product) => (
              <tr key={product.id}>
                <PanelTableCell><p className="font-semibold text-zinc-950 dark:text-zinc-50">{locale === "en" ? product.titleEn || product.titleFa : product.titleFa}</p><p className="nums-en mt-1 truncate text-xs text-zinc-500" dir="ltr">/shop/{product.slug}</p></PanelTableCell>
                <PanelTableCell><span className="font-medium">{number.format(product.price)}</span></PanelTableCell>
                <PanelTableCell>{number.format(product.inventory)}</PanelTableCell>
                <PanelTableCell><span className={product.status === "published" ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300"}>{product.status === "published" ? dictionary.common.published : dictionary.common.draft}</span>{product.isFeatured ? <span className="ms-1 rounded-full bg-violet-100 px-2 py-1 text-[10px] text-violet-700 dark:bg-violet-950 dark:text-violet-300">★</span> : null}</PanelTableCell>
                <PanelTableCell><div className="flex items-center gap-1"><Link href={`/panel/admin/products/${product.id}/edit`} className="rounded-lg px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40">{dictionary.common.edit}</Link><DeleteProductButton productId={product.id} locale={locale} /></div></PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : <PanelEmptyState title={dictionary.shop.emptyTitle} description={dictionary.shop.emptyDescription} action={<PanelPrimaryLink href="/panel/admin/products/new">{dictionary.shop.newProduct}</PanelPrimaryLink>} />}
      </PanelSurface>
    </PanelPage>
  );
}
