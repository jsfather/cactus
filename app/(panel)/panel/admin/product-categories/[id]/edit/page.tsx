import { notFound } from "next/navigation";
import { z } from "zod";
import { CategoryForm } from "@/components/products/category-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getProductCategory } from "@/lib/catalog/queries";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, locale] = await Promise.all([params, getPanelLocale()]);
  if (!z.uuid().safeParse(id).success) notFound();
  const category = await getProductCategory(id);
  if (!category) notFound();
  return <PanelPage><PanelBackLink href="/panel/admin/product-categories">{locale === "fa" ? "بازگشت" : "Back"}</PanelBackLink><PanelPageHeader eyebrow={locale === "fa" ? "فروشگاه" : "Shop"} title={locale === "fa" ? `ویرایش ${category.titleFa}` : `Edit ${category.titleEn || category.titleFa}`} description={locale === "fa" ? "اطلاعات دسته را ویرایش کنید." : "Update category information."} /><CategoryForm locale={locale} categoryId={category.id} initialValues={{ slug: category.slug, titleFa: category.titleFa, titleEn: category.titleEn || "", descriptionFa: category.descriptionFa || "", descriptionEn: category.descriptionEn || "" }} /></PanelPage>;
}
