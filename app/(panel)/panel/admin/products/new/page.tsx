import { ProductForm } from "@/components/products/product-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function NewProductPage() {
  const locale = await getPanelLocale();
  const dictionary = getPanelDictionary(locale);
  return <PanelPage><PanelBackLink href="/panel/admin/products">{dictionary.common.back}</PanelBackLink><PanelPageHeader eyebrow={dictionary.shop.eyebrow} title={dictionary.shop.newProduct} description={dictionary.shop.description} /><ProductForm locale={locale} /></PanelPage>;
}
