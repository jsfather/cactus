import { ActionForm } from "@/components/workflows/action-form";
import { saveSpecifications } from "@/lib/products/specification-actions";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ToastOnMount } from "@/components/feedback/toast-effects";
import { PanelBackLink, PanelEditIcon, PanelEmptyState, PanelPage, PanelPageHeader, PanelPrimaryLink, PanelSurface, PanelTable, PanelTableActions, PanelTableActionLink, PanelTableCell } from "@/components/panel/ui";
import { DeleteVariantButton } from "@/components/products/delete-variant-button";
import { ProductForm } from "@/components/products/product-form";
import { getProductCategories, getProductCategoryIds, getProductVariants } from "@/lib/catalog/queries";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getAdminProduct } from "@/lib/products/queries";

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ toast?: string }> }) {
  const [{ id }, query, locale] = await Promise.all([params, searchParams, getPanelLocale()]);
  if (!z.uuid().safeParse(id).success) notFound();
  const [product, categories, categoryIds, variants] = await Promise.all([getAdminProduct(id), getProductCategories(), getProductCategoryIds(id), getProductVariants(id)]);
  if (!product) notFound();
  const dictionary = getPanelDictionary(locale);
  const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US");
  const toastTitles: Record<string, string> = { created: locale === "fa" ? "محصول ساخته شد؛ اکنون می‌توانید تنوع‌ها را اضافه کنید." : "Product created. You can now add variants.", "variant-created": locale === "fa" ? "تنوع اضافه شد." : "Variant added.", "variant-updated": locale === "fa" ? "تنوع به‌روز شد." : "Variant updated." };
  return <PanelPage>
    {query.toast && toastTitles[query.toast] ? <ToastOnMount title={toastTitles[query.toast]} /> : null}
    <PanelBackLink href="/panel/admin/products">{dictionary.common.back}</PanelBackLink>
    <PanelPageHeader eyebrow={dictionary.shop.eyebrow} title={locale === "en" ? `Edit ${product.titleEn || product.titleFa}` : `ویرایش ${product.titleFa}`} description={dictionary.shop.description} />
    <ProductForm locale={locale} mode="edit" productId={product.id} categories={categories} initialValues={{ slug: product.slug, titleFa: product.titleFa, titleEn: product.titleEn || "", summaryFa: product.summaryFa, summaryEn: product.summaryEn || "", contentFa: product.contentFa, contentEn: product.contentEn || "", coverImageUrl: product.coverImageUrl || "", price: String(product.price), inventory: String(product.inventory), status: product.status, isFeatured: product.isFeatured, categoryIds }} />
    <ActionForm locale={locale} heading={locale === "fa" ? "مشخصات فنی" : "Technical specifications"} action={saveSpecifications.bind(null, product.id)} initial={{ specificationsFa: product.specificationsFa ?? "", specificationsEn: product.specificationsEn ?? "" }} fields={[{name:"specificationsFa",label:locale === "fa" ? "ویژگی‌های فارسی، هر خط یک ویژگی" : "Persian specifications, one per line",type:"textarea"},{name:"specificationsEn",label:locale === "fa" ? "ویژگی‌های انگلیسی، هر خط یک ویژگی" : "English specifications, one per line",type:"textarea"}]} />
    <PanelSurface>
      <header className="flex flex-col gap-4 border-b border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800"><div><h2 className="font-bold">{locale === "fa" ? "تنوع‌های محصول" : "Product variants"}</h2><p className="mt-1 text-xs text-zinc-500">{locale === "fa" ? "SKU، قیمت و موجودی مستقل برای انتخاب‌های محصول." : "Independent SKU, price, and inventory options."}</p></div><PanelPrimaryLink href={`/panel/admin/products/${id}/variants/new`} size="compact">{locale === "fa" ? "تنوع جدید" : "New variant"}</PanelPrimaryLink></header>
      {variants.length ? <PanelTable columns={[{ label: locale === "fa" ? "عنوان" : "Title", className: "w-[28%]" }, { label: "SKU", className: "w-[22%]" }, { label: dictionary.shop.price, className: "w-[17%]" }, { label: dictionary.shop.inventory, className: "w-[13%]" }, { label: dictionary.common.actions, className: "w-[20%]" }]}>
        {variants.map((variant) => <tr key={variant.id}><PanelTableCell><p className="font-medium">{locale === "en" ? variant.titleEn || variant.titleFa : variant.titleFa}</p>{!variant.isActive ? <span className="mt-1 inline-block text-xs text-zinc-500">{dictionary.common.inactive}</span> : null}</PanelTableCell><PanelTableCell><span dir="ltr" className="nums-en text-xs">{variant.sku}</span></PanelTableCell><PanelTableCell>{variant.price === null ? (locale === "fa" ? "قیمت پایه" : "Base price") : number.format(variant.price)}</PanelTableCell><PanelTableCell>{number.format(variant.inventory)}</PanelTableCell><PanelTableCell><PanelTableActions><PanelTableActionLink href={`/panel/admin/products/${id}/variants/${variant.id}/edit`} label={dictionary.common.edit}><PanelEditIcon /></PanelTableActionLink><DeleteVariantButton productId={id} variantId={variant.id} locale={locale} /></PanelTableActions></PanelTableCell></tr>)}
      </PanelTable> : <PanelEmptyState title={locale === "fa" ? "این محصول تنوعی ندارد" : "This product has no variants"} description={locale === "fa" ? "اگر محصول چند اندازه، بسته یا نسخه دارد، اولین تنوع را اضافه کنید." : "Add a variant when the product has multiple sizes, packages, or editions."} action={<PanelPrimaryLink href={`/panel/admin/products/${id}/variants/new`}>{locale === "fa" ? "تنوع جدید" : "New variant"}</PanelPrimaryLink>} />}
    </PanelSurface>
  </PanelPage>;
}
