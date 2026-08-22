import { notFound } from "next/navigation";
import { z } from "zod";
import { VariantForm } from "@/components/products/variant-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getAdminProduct } from "@/lib/products/queries";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function NewVariantPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, locale] = await Promise.all([params, getPanelLocale()]); if (!z.uuid().safeParse(id).success) notFound(); const product = await getAdminProduct(id); if (!product) notFound();
  return <PanelPage><PanelBackLink href={`/panel/admin/products/${id}/edit`}>{locale === "fa" ? "بازگشت" : "Back"}</PanelBackLink><PanelPageHeader eyebrow={locale === "en" ? product.titleEn || product.titleFa : product.titleFa} title={locale === "fa" ? "تنوع جدید" : "New variant"} description={locale === "fa" ? "یک SKU، قیمت و موجودی مستقل برای این محصول تعریف کنید." : "Define an independent SKU, price, and inventory for this product."} /><VariantForm locale={locale} productId={id} /></PanelPage>;
}
