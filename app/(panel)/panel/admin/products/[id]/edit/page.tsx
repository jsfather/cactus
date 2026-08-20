import { notFound } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";
import { getAdminProduct } from "@/lib/products/queries";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, locale] = await Promise.all([getAdminProduct(id), getPanelLocale()]);
  if (!product) notFound();
  const dictionary = getPanelDictionary(locale);
  return <PanelPage><PanelBackLink href="/panel/admin/products">{dictionary.common.back}</PanelBackLink><PanelPageHeader eyebrow={dictionary.shop.eyebrow} title={locale === "en" ? `Edit ${product.titleEn || product.titleFa}` : `ویرایش ${product.titleFa}`} description={dictionary.shop.description} /><ProductForm locale={locale} mode="edit" productId={product.id} initialValues={{ slug: product.slug, titleFa: product.titleFa, titleEn: product.titleEn || "", summaryFa: product.summaryFa, summaryEn: product.summaryEn || "", contentFa: product.contentFa, contentEn: product.contentEn || "", coverImageUrl: product.coverImageUrl || "", price: String(product.price), inventory: String(product.inventory), status: product.status, isFeatured: product.isFeatured }} /></PanelPage>;
}
