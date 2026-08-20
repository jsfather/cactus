import { PostForm } from "@/components/blog/post-form";
import { PanelBackLink, PanelPage, PanelPageHeader } from "@/components/panel/ui";

export default function NewPostPage() {
  return (
    <PanelPage>
      <div>
        <PanelBackLink href="/panel/admin/blog">
          بازگشت به نوشته‌ها
        </PanelBackLink>
      </div>
      <PanelPageHeader
        eyebrow="مدیریت وبلاگ"
        title="نوشته جدید"
        description="نسخه فارسی ضروری است و ترجمه انگلیسی را می‌توانید هم‌زمان اضافه کنید."
      />
      <PostForm />
    </PanelPage>
  );
}
