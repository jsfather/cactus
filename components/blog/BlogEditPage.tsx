"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBlogStore } from "../../lib/store/blog";
import BlogForm from "./BlogFormNew";

interface BlogEditPageProps {
  blogId: number;
}

const BlogEditPage: React.FC<BlogEditPageProps> = ({ blogId }) => {
  const router = useRouter();
  const { currentBlog, loading, error, fetchBlog, clearCurrentBlog } =
    useBlogStore();

  useEffect(() => {
    fetchBlog(blogId);
    return () => clearCurrentBlog();
  }, [blogId, fetchBlog, clearCurrentBlog]);

  const handleFormClose = () => {
    router.push("/blog");
  };

  const handleFormSuccess = () => {
    router.push("/blog");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <div className="mt-4">
              <button
                onClick={handleFormClose}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Blog not found.</p>
        <button
          onClick={handleFormClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={handleFormClose}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
          >
            ← Back to Blog List
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
          <p className="text-gray-600">{currentBlog.title}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <BlogForm
          blog={currentBlog}
          mode="edit"
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          isModal={false}
        />
      </div>
    </div>
  );
};

export default BlogEditPage;
