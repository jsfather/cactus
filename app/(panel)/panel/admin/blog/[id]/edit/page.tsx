import { notFound } from "next/navigation";
import { PostForm, type PostFormValues } from "@/components/blog/post-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";
import { getAdminPost } from "@/lib/blog/queries";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getAdminPost(id);

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

  return (
    <PanelPage>
      <div>
        <PanelBackLink href="/panel/admin/blog">
          بازگشت به نوشته‌ها
        </PanelBackLink>
      </div>
      <PanelPageHeader
        eyebrow="مدیریت وبلاگ"
        title="ویرایش نوشته"
        description="اطلاعات، ترجمه و وضعیت انتشار این نوشته را به‌روزرسانی کنید."
      />
      <PostForm mode="edit" postId={post.id} initialValues={initialValues} />
    </PanelPage>
  );
}
