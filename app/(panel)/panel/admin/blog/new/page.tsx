import { PostForm } from "@/components/blog/post-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function NewPostPage() {
  const locale = await getPanelLocale();
  const dictionary = getPanelDictionary(locale);
  return (
    <PanelPage>
      <div>
        <PanelBackLink href="/panel/admin/blog">
          {dictionary.common.back}
        </PanelBackLink>
      </div>
      <PanelPageHeader
        eyebrow={dictionary.blog.eyebrow}
        title={dictionary.blog.newPost}
        description={dictionary.blog.description}
      />
      <PostForm locale={locale} />
    </PanelPage>
  );
}
