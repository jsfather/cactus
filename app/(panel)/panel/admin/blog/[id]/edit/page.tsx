import { notFound } from "next/navigation";
import { PostForm, type PostFormValues } from "@/components/blog/post-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getAdminPost } from "@/lib/blog/queries";
import { getPanelDictionary } from "@/lib/i18n/panel";
import { getPanelLocale } from "@/lib/i18n/panel-server";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, locale] = await Promise.all([getAdminPost(id), getPanelLocale()]);

  if (!post) {
    notFound();
  }

  const initialValues: PostFormValues = {
    slug: post.slug,
    titleFa: post.titleFa,
    titleEn: post.titleEn ?? "",
    coverImageUrl: post.coverImageUrl ?? "",
    excerptFa: post.excerptFa,
    contentFa: post.contentFa,
    excerptEn: post.excerptEn ?? "",
    contentEn: post.contentEn ?? "",
    status: post.status,
  };
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
        title={locale === "fa" ? "ویرایش نوشته" : "Edit post"}
        description={dictionary.blog.description}
      />
      <PostForm locale={locale} mode="edit" postId={post.id} initialValues={initialValues} />
    </PanelPage>
  );
}
