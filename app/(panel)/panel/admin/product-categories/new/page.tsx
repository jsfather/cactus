import { CategoryForm } from "@/components/products/category-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function NewCategoryPage() {
  const locale = await getPanelLocale();
  return <PanelPage><PanelBackLink href="/panel/admin/product-categories">{locale === "fa" ? "بازگشت" : "Back"}</PanelBackLink><PanelPageHeader eyebrow={locale === "fa" ? "فروشگاه" : "Shop"} title={locale === "fa" ? "دسته جدید" : "New category"} description={locale === "fa" ? "یک دسته چندزبانه برای گروه‌بندی محصولات بسازید." : "Create a multilingual category for organizing products."} /><CategoryForm locale={locale} /></PanelPage>;
}
