import BlogList from "../../components/blog/BlogListNew";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <BlogList />
      </div>
    </div>
  );
}
