import { ToastOnMount } from "@/components/feedback/toast-effects";
import { DeleteCategoryButton } from "@/components/products/delete-category-button";
import { PanelEditIcon, PanelEmptyState, PanelPage, PanelPageHeader, PanelPrimaryLink, PanelSurface, PanelTable, PanelTableActions, PanelTableActionLink, PanelTableCell } from "@/components/panel/ui";
import { getAdminProductCategories } from "@/lib/catalog/queries";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function ProductCategoriesPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const [locale, query, categories] = await Promise.all([getPanelLocale(), searchParams, getAdminProductCategories()]);
  const dictionary = getPanelDictionary(locale);
  const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US");
  return <PanelPage>
    {query.toast === "created" ? <ToastOnMount title={locale === "fa" ? "دسته ساخته شد." : "Category created."} /> : null}
    {query.toast === "updated" ? <ToastOnMount title={locale === "fa" ? "دسته به‌روز شد." : "Category updated."} /> : null}
    <PanelPageHeader eyebrow={locale === "fa" ? "فروشگاه" : "Shop"} title={locale === "fa" ? "دسته‌بندی محصولات" : "Product categories"} description={locale === "fa" ? "دسته‌های چندزبانه فروشگاه و ارتباط آن‌ها با محصولات را مدیریت کنید." : "Manage multilingual shop categories and their product assignments."} actions={<PanelPrimaryLink href="/panel/admin/product-categories/new">{locale === "fa" ? "دسته جدید" : "New category"}</PanelPrimaryLink>} />
    <PanelSurface>{categories.length ? <PanelTable columns={[{ label: dictionary.common.title, className: "w-[40%]" }, { label: locale === "fa" ? "نشانی" : "URL", className: "w-[25%]" }, { label: locale === "fa" ? "محصولات" : "Products", className: "w-[15%]" }, { label: dictionary.common.actions, className: "w-[20%]" }]}>
      {categories.map((category) => <tr key={category.id}>
        <PanelTableCell><p className="font-semibold text-zinc-950 dark:text-zinc-50">{locale === "en" ? category.titleEn || category.titleFa : category.titleFa}</p></PanelTableCell>
        <PanelTableCell><span dir="ltr" className="nums-en text-xs text-zinc-500">{category.slug}</span></PanelTableCell>
        <PanelTableCell>{number.format(category.productCount)}</PanelTableCell>
        <PanelTableCell><PanelTableActions><PanelTableActionLink href={`/panel/admin/product-categories/${category.id}/edit`} label={dictionary.common.edit}><PanelEditIcon /></PanelTableActionLink><DeleteCategoryButton categoryId={category.id} locale={locale} /></PanelTableActions></PanelTableCell>
      </tr>)}</PanelTable> : <PanelEmptyState title={locale === "fa" ? "دسته‌ای وجود ندارد" : "No categories yet"} description={locale === "fa" ? "اولین دسته فروشگاه را بسازید." : "Create the first shop category."} action={<PanelPrimaryLink href="/panel/admin/product-categories/new">{locale === "fa" ? "دسته جدید" : "New category"}</PanelPrimaryLink>} />}</PanelSurface>
  </PanelPage>;
}
