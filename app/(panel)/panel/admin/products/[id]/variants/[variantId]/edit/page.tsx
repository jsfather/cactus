import { notFound } from "next/navigation";
import { z } from "zod";
import { VariantForm } from "@/components/products/variant-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getProductVariant } from "@/lib/catalog/queries";
import { getAdminProduct } from "@/lib/products/queries";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function EditVariantPage({ params }: { params: Promise<{ id: string; variantId: string }> }) {
  const [{ id, variantId }, locale] = await Promise.all([params, getPanelLocale()]); if (!z.uuid().safeParse(id).success || !z.uuid().safeParse(variantId).success) notFound(); const [product, variant] = await Promise.all([getAdminProduct(id), getProductVariant(id, variantId)]); if (!product || !variant) notFound();
  return <PanelPage><PanelBackLink href={`/panel/admin/products/${id}/edit`}>{locale === "fa" ? "بازگشت" : "Back"}</PanelBackLink><PanelPageHeader eyebrow={locale === "en" ? product.titleEn || product.titleFa : product.titleFa} title={locale === "fa" ? `ویرایش ${variant.titleFa}` : `Edit ${variant.titleEn || variant.titleFa}`} description={locale === "fa" ? "اطلاعات تنوع محصول را ویرایش کنید." : "Update product variant information."} /><VariantForm locale={locale} productId={id} variantId={variantId} initialValues={{ sku: variant.sku, titleFa: variant.titleFa, titleEn: variant.titleEn || "", price: variant.price === null ? "" : String(variant.price), inventory: String(variant.inventory), isActive: variant.isActive }} /></PanelPage>;
}
