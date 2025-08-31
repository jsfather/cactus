import BlogEditPage from "../../../components/blog/BlogEditPage";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const blogId = parseInt(params.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <BlogEditPage blogId={blogId} />
      </div>
    </div>
  );
}
