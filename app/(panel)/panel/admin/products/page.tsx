import { DeleteProductButton } from "@/components/products/delete-product-button";
import { PanelEditIcon, PanelEmptyState, PanelPage, PanelPageHeader, PanelPrimaryLink, PanelSurface, PanelTable, PanelTableActions, PanelTableActionLink, PanelTableCell } from "@/components/panel/ui";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { localeConfig } from "@/lib/i18n/config";
import { getAdminProducts } from "@/lib/products/queries";
import { ToastOnMount } from "@/components/feedback/toast-effects";
import { PanelListControls, PanelPagination } from "@/components/panel/list-controls";
import { getSearchParam, parseAdminListQuery, type AdminListSearchParams } from "@/lib/panel/pagination";
import type { ProductFeaturedFilter, ProductStatusFilter, ProductStockFilter } from "@/lib/products/queries";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<AdminListSearchParams> }) {
  const [locale, query] = await Promise.all([getPanelLocale(), searchParams]);
  const listQuery = parseAdminListQuery(query);
  const statusValue = getSearchParam(query, "status");
  const featuredValue = getSearchParam(query, "featured");
  const stockValue = getSearchParam(query, "stock");
  const status: ProductStatusFilter = statusValue === "draft" || statusValue === "published" ? statusValue : "all";
  const featured: ProductFeaturedFilter = featuredValue === "featured" || featuredValue === "standard" ? featuredValue : "all";
  const stock: ProductStockFilter = stockValue === "in_stock" || stockValue === "low" || stockValue === "out" ? stockValue : "all";
  const products = await getAdminProducts({ ...listQuery, status, featured, stock });
  const dictionary = getPanelDictionary(locale);
  const number = new Intl.NumberFormat(localeConfig[locale].dateLocale);
  return (
    <PanelPage>
      {query.toast === "created" ? <ToastOnMount title={locale === "fa" ? "محصول ساخته شد." : "Product created."} /> : null}
      {query.toast === "updated" ? <ToastOnMount title={locale === "fa" ? "محصول به‌روز شد." : "Product updated."} /> : null}
      <PanelPageHeader eyebrow={dictionary.shop.eyebrow} title={dictionary.shop.title} description={dictionary.shop.description} actions={<PanelPrimaryLink href="/panel/admin/products/new">{dictionary.shop.newProduct}</PanelPrimaryLink>} />
      <PanelSurface>
        <PanelListControls action="/panel/admin/products" locale={locale} query={listQuery.q} searchPlaceholder={locale === "fa" ? "جست‌وجوی عنوان یا نشانی محصول…" : "Search product title or URL…"} filters={[
          { name: "status", label: dictionary.common.status, value: status, options: [{ value: "all", label: locale === "fa" ? "همه وضعیت‌ها" : "All statuses" }, { value: "draft", label: dictionary.common.draft }, { value: "published", label: dictionary.common.published }] },
          { name: "featured", label: locale === "fa" ? "ویژه" : "Featured", value: featured, options: [{ value: "all", label: locale === "fa" ? "همه محصولات" : "All products" }, { value: "featured", label: locale === "fa" ? "فقط ویژه" : "Featured only" }, { value: "standard", label: locale === "fa" ? "غیرویژه" : "Not featured" }] },
          { name: "stock", label: dictionary.shop.inventory, value: stock, options: [{ value: "all", label: locale === "fa" ? "همه موجودی‌ها" : "All stock" }, { value: "in_stock", label: locale === "fa" ? "موجود" : "In stock" }, { value: "low", label: locale === "fa" ? "کم‌موجود" : "Low stock" }, { value: "out", label: locale === "fa" ? "ناموجود" : "Out of stock" }] },
        ]} />
        {products.items.length ? (
          <PanelTable columns={[{ label: dictionary.common.title, className: "w-[32%]" }, { label: dictionary.shop.price, className: "w-[18%]" }, { label: dictionary.shop.inventory, className: "w-[13%]" }, { label: dictionary.common.status, className: "w-[16%]" }, { label: dictionary.common.actions, className: "w-[21%]" }]}>
            {products.items.map((product) => (
              <tr key={product.id}>
                <PanelTableCell><p className="font-semibold text-zinc-950 dark:text-zinc-50">{locale === "en" ? product.titleEn || product.titleFa : product.titleFa}</p><p className="nums-en mt-1 truncate text-xs text-zinc-500" dir="ltr">/shop/{product.slug}</p></PanelTableCell>
                <PanelTableCell><span className="font-medium">{number.format(product.price)}</span></PanelTableCell>
                <PanelTableCell>{number.format(product.inventory)}</PanelTableCell>
                <PanelTableCell><span className={product.status === "published" ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300"}>{product.status === "published" ? dictionary.common.published : dictionary.common.draft}</span>{product.isFeatured ? <span className="ms-1 rounded-full bg-violet-100 px-2 py-1 text-[10px] text-violet-700 dark:bg-violet-950 dark:text-violet-300">★</span> : null}</PanelTableCell>
                <PanelTableCell><PanelTableActions><PanelTableActionLink href={`/panel/admin/products/${product.id}/edit`} label={dictionary.common.edit}><PanelEditIcon /></PanelTableActionLink><DeleteProductButton productId={product.id} locale={locale} /></PanelTableActions></PanelTableCell>
              </tr>
            ))}
          </PanelTable>
        ) : <PanelEmptyState title={listQuery.q || status !== "all" || featured !== "all" || stock !== "all" ? (locale === "fa" ? "محصولی پیدا نشد" : "No matching products") : dictionary.shop.emptyTitle} description={listQuery.q || status !== "all" || featured !== "all" || stock !== "all" ? (locale === "fa" ? "عبارت جست‌وجو یا فیلترها را تغییر دهید." : "Try changing the search term or filters.") : dictionary.shop.emptyDescription} action={!listQuery.q && status === "all" && featured === "all" && stock === "all" ? <PanelPrimaryLink href="/panel/admin/products/new">{dictionary.shop.newProduct}</PanelPrimaryLink> : undefined} />}
        <PanelPagination action="/panel/admin/products" locale={locale} pagination={products} query={{ ...(listQuery.q ? { q: listQuery.q } : {}), ...(status !== "all" ? { status } : {}), ...(featured !== "all" ? { featured } : {}), ...(stock !== "all" ? { stock } : {}) }} />
      </PanelSurface>
    </PanelPage>
  );
}
